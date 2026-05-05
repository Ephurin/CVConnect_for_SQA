<template>
  <div class="department-content">
    <AdminUserDetailModal v-model="isViewModalOpen" :user-id="userDetailId" />
    <div class="table-title">Thành viên doanh nghiệp</div>
    <OrgAdminEmployeeBaseTable
      :table-data="tableData"
      :columns="tableColumns"
      :allow-actions="allowActions"
      :show-checkbox="false"
      :show-actions="true"
      :is-loading="isFetchingData"
      :selection-list="selectedRows"
      :select-options="filterSelectOption"
      :sort="sort"
      :filter="filter"
      :is-table-empty="isNoData"
      @selection-update="handleSelectionsUpdate"
      @delete="handleTableActionClick($event, 'delete')"
      @edit="handleTableActionClick($event, 'edit')"
      @view="handleTableActionClick($event, 'view')"
      @sort="handleSort"
      @filter="handleFilter"
    />
    <div class="top-section">
      <div class="record-count">{{ `${totalItems} bản ghi` }}</div>
      <UPagination
        :show-edges="true"
        :sibling-count="1"
        :variant="'ghost'"
        active-variant="subtle"
        :items-per-page="pageSize"
        :page="pageIndex"
        :total="totalItems"
        @update:page="handlePageIndexChange($event)"
      />
      <USelect
        variant="subtle"
        :items="pageSizeOpts"
        class="w-fit bg-white text-[#333333]"
        :model-value="pageSize"
        @update:model-value="handlePageSizeChange($event)"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import type { TTableAction } from "~/components/app/table/data-table.vue";
import type { TSort } from "~/types/common";
import { cloneDeep, debounce } from "lodash";
import { CELL_TYPE, CHIP_TYPE } from "~/const/common";
import {
  organizationEmployeeTableHeaders,
  pageSizeOptions,
} from "~/const/views/system-admin/organizations";
import axios from "axios";

const route = useRoute();
const router = useRouter();
const isCreateModalOpen = ref<boolean>(false);
const isDeleteModalOpen = ref<boolean>(false);
const isEditViewOpen = ref<boolean>(false);
const editViewId = ref<number | null>(null);
const editViewInitialMode = ref<any>(null);
const editViewMode = ref<any>(null);
const isFetchingData = ref<boolean>(false);
const fetchEmployeeController = ref<AbortController | null>();
const filter = ref<Record<string, any>>({});
const totalItems = ref<number>(0);
const isNoData = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const deleteList = ref<any[]>([]);
const isViewModalOpen = ref<boolean>(false);
const userDetailId = ref<number>(-1);
const allowActions = computed(() => {
  const url = route.path;
  const menuItem = getMenuItem(url);
  const permissions = Array.from(menuItem?.permissions || []);
  return permissions;
});
const industryList = ref<any[]>([]);
const provinceList = ref<any[]>([]);
const rolesFilterOptions = ref<any[]>([]);
const queryObj = ref<any>({});

const { getMenuItem } = useSidebarStore();
const { setLoading } = useLoadingStore();
// TODO: REPLACE THIS APIS
const { getDepartments, deleteDepartment, changeDepartmentStatus } =
  useDepartmentApi();
const { getOrgMembers, getRoleFilterOption, changeOrgMemberStatus } =
  useOrgMemberApi();
const { getRoles } = useRoleApi();

const { getOrgEmployees } = useOrgApi();
const { getIndustries } = useIndustryApi();

type TProps = {
  orgId: any;
};

const props = defineProps<TProps>();

onBeforeMount(async () => {
  setLoading(true);
  const rolesRes = await getRoles({ pageSize: 999 });
  rolesFilterOptions.value = rolesRes.data.data;

  await fetchData();

  setLoading(false);
});

const handleDeleteClick = (items: any[]) => {
  deleteList.value = items;
  isDeleteModalOpen.value = true;
};

const clearViewEditId = () => {
  editViewId.value = null;
  editViewInitialMode.value = null;
  editViewMode.value = null;
};

const sort = computed(() => {
  return {
    key: filter.value.sortBy,
    type: filter.value.sortDirection ? filter.value.sortDirection : undefined,
  };
});

const pageIndex = computed(() => {
  return !isNaN(filter.value.pageIndex) ? +filter.value.pageIndex + 1 : 1;
});

const pageSize = computed(() => {
  return filter.value.pageSize ? +filter.value.pageSize : 10;
});

const handleSort = (e: TSort) => {
  filter.value = {
    ...filter.value,
    sortBy: e.type ? e.key : undefined,
    sortDirection: e.type ? e.type : undefined,
  };
};
const handleFilter = (e: any) => {
  filter.value = e;
};

const fetchData = async () => {
  if (fetchEmployeeController.value) {
    fetchEmployeeController.value.abort();
  }

  fetchEmployeeController.value = new AbortController();
  isFetchingData.value = true;
  const query = queryObj.value;
  const res = await getOrgEmployees(
    props.orgId,
    query,
    fetchEmployeeController.value,
  );
  if (res.data.data.length == 0) {
    isNoData.value = true;
  } else {
    isNoData.value = false;
  }
  if (res === null) {
    return;
  }
  isFetchingData.value = false;
  const data = res.data.data;
  totalItems.value = res.data.pageInfo.totalElements;

  for (const [index, entry] of data.entries()) {
    entry.index = index + 1 + (pageIndex.value - 1) * pageSize.value;
    entry.createdAt = formatDateTime(entry.createdAt, "DD/MM/YYYY - HH:mm");
    entry.updatedAt = formatDateTime(entry.updatedAt, "DD/MM/YYYY - HH:mm");
    entry.roleIds = entry.roles.map((role: any) => role.name).join(", ");
    entry.id = entry.userId;
    entry.isActive = entry.isActive
      ? {
          text: "Đang hoạt động",
          type: CHIP_TYPE.SUCCESS,
          cellType: CELL_TYPE.TAG,
        }
      : {
          text: "Ngừng hoạt động",
          type: CHIP_TYPE.ERROR,
          cellType: CELL_TYPE.TAG,
        };
    entry.isEmailVerified = entry.isEmailVerified
      ? {
          text: "Đã xác thực",
          type: CHIP_TYPE.SUCCESS,
          cellType: CELL_TYPE.TAG,
        }
      : {
          text: "Chưa xác thực",
          type: CHIP_TYPE.ERROR,
          cellType: CELL_TYPE.TAG,
        };
    entry.canDelete = false;
  }
  tableData.value = data;
};
const debouncedFetchData = debounce(fetchData, 500);
const selectedRows = ref<number[]>([]);
const handleSelectionsUpdate = (selectionList: number[]) => {
  selectedRows.value = selectionList;
};

const handlePageSizeChange = (e: any) => {
  filter.value = {
    ...filter.value,
    pageIndex: 0,
    pageSize: e,
  };
};

const handlePageIndexChange = (e: any) => {
  filter.value = {
    ...filter.value,
    pageIndex: e - 1,
  };
};

const handleTableActionClick = (id: number, action: TTableAction) => {
  if (action === "delete") {
    handleDeleteClick([id]);
  }
  if (action === "view") {
    userDetailId.value = id;
    isViewModalOpen.value = true;
  }
  if (action === "edit") {
    editViewId.value = id;
    editViewInitialMode.value = "edit";
    editViewMode.value = "edit";
    isEditViewOpen.value = true;
  }
};

const tableData = ref([]);
const filterSelectOption = computed(() => {
  return {
    isActive: [
      {
        label: "Ngừng hoạt động",
        value: false,
      },
      {
        label: "Đang hoạt động",
        value: true,
      },
    ],
    isEmailVerified: [
      {
        label: "Đã xác thực",
        value: true,
      },
      {
        label: "Chưa xác thực",
        value: false,
      },
    ],
    roleIds: rolesFilterOptions.value.map((role) => ({
      label: role.name,
      value: role.id,
    })),
  };
});

const tableColumns = computed(() => {
  return organizationEmployeeTableHeaders;
});
const pageSizeOpts = computed(() => {
  return pageSizeOptions;
});

// NOTE: From filter to query string
const normalizeFilter = (filter: any) => {
  const normalizedFilter = cloneDeep(filter);
  if (normalizedFilter.createdAt) {
    const startDate = normalizedFilter.createdAt[0];
    const endDate = normalizedFilter.createdAt[1];
    delete normalizedFilter.createdAt;
    if (startDate) {
      normalizedFilter.createdAtStart = toUtcDate(startDate);
    }
    if (endDate) {
      normalizedFilter.createdAtEnd = toUtcDate(endDate);
    }
  }
  if (
    normalizedFilter.isActive &&
    normalizedFilter.isActive.length &&
    normalizedFilter.isActive.length != 2
  ) {
    normalizedFilter.isActive = normalizedFilter.isActive.map(
      (activity: any) => activity.value,
    );
  } else {
    delete normalizedFilter.isActive;
  }
  if (
    normalizedFilter.isEmailVerified &&
    normalizedFilter.isEmailVerified.length &&
    normalizedFilter.isEmailVerified.length != 2
  ) {
    normalizedFilter.isEmailVerified = normalizedFilter.isEmailVerified.map(
      (activity: any) => activity.value,
    );
  } else {
    delete normalizedFilter.isEmailVerified;
  }
  if (normalizedFilter.roleIds && normalizedFilter.roleIds.length) {
    normalizedFilter.roleIds = normalizedFilter.roleIds.map(
      (activity: any) => activity.value,
    );
  } else {
    delete normalizedFilter.roleIds;
  }
  if (normalizedFilter.updatedAt) {
    const startDate = normalizedFilter.updatedAt[0];
    const endDate = normalizedFilter.updatedAt[1];
    delete normalizedFilter.updatedAt;
    if (startDate) normalizedFilter.updatedAtStart = toUtcDate(startDate);
    if (endDate) normalizedFilter.updatedAtEnd = toUtcDate(endDate);
  }

  const queryForUrl: Record<string, any> = {
    ...normalizedFilter,
  };

  return queryForUrl;
};

watch(filter, (newVal) => {
  const queryForUrl = normalizeFilter(newVal);

  queryObj.value = truncateQueryObject(queryForUrl);

  debouncedFetchData();
});

watch([editViewMode, editViewId], ([newMode, newId]) => {
  const query = { ...route.query };

  if (newMode == null || newMode === "") {
    delete query.mode;
  } else {
    query.mode = String(newMode);
  }

  if (newId == null || newId === -1) {
    delete query.targetId;
  } else {
    query.targetId = String(newId);
  }

  router.replace({ query });
});

watch(isEditViewOpen, (newVal) => {
  if (!newVal) {
    clearViewEditId();
  }
});
</script>
<style lang="scss" scoped>
.department-content {
  background-color: white;
  min-height: calc(100% - 48px - 8px);
  color: $text-light;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  @include custom-scrollbar;
  height: 100%;

  .table-title {
    margin-bottom: 12px;
  }

  .table-top {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 12px;
    margin-bottom: 20px;

    .button {
      padding: 4px 14px 4px 10px;

      :deep(.button-text) {
        font-size: 14px;
      }
    }
    .add-button {
      background-color: $color-primary-400;
      color: $text-dark;
    }

    .active-btn {
      background-color: white;
      padding: 4px 14px 4px 14px;

      &.disabled {
        border: 1px solid $color-gray-400;
        color: $color-gray-400;
      }
    }

    .active {
      color: $color-success;
      border: 1px solid $color-success;
    }

    .deactive {
      color: $color-primary-400;
      border: 1px solid $color-primary-400;
    }

    .delete-button {
      background-color: white;
      color: $color-primary-400;
      border: 1px solid $color-primary-400;

      &.disabled {
        border: 1px solid $color-gray-400;
        color: $color-gray-400;
      }
    }
  }

  .title {
    font-weight: 700;
    font-size: 16px;
    line-height: 20px;
    margin-bottom: 12px;
  }
  .top-section {
    margin-top: 18px;
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;

    :deep(button[type="button"][disabled]) {
      color: $color-gray-400;
    }

    .record-count {
      color: $color-gray-500;
      font-size: 14px;
      font-style: italic;
    }
  }
  .table-section {
    max-width: 100%;
  }
}
</style>
