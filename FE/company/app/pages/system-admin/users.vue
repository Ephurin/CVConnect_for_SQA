<template>
  <div class="wrapper">
    <AdminUserDetailModal v-model="isViewModalOpen" :user-id="editViewId" />
    <UModal
      :open="isConfirmModalShow"
      title="Ngừng hoạt động"
      :ui="{ content: 'w-[840px] max-w-[840px]' }"
      @update:open="handleDeleteModalOpenUpdate"
      @after:leave="clearDeleteList"
    >
      <template #body>
        <ModalsDeactiveOrgModal :delete-list="deleteListNames">
          <template #footer>
            <AppButton
              :text="'Đồng ý'"
              class="modal-delete-submit"
              :is-loading="isDeleting"
              @click="handleActiveToggle(selectedRows, false)"
            />
          </template>
        </ModalsDeactiveOrgModal>
      </template>
    </UModal>
    <div class="department-content">
      <div class="title">Danh sách người dùng hệ thống</div>
      <div class="table-top">
        <!-- <AppButton -->
        <!--   :text="'Hoạt động'" -->
        <!--   :is-disabled="selectedRows.length == 0" -->
        <!--   class="active-btn active" -->
        <!--   @click="handleActiveToggle(selectedRows, true)" -->
        <!-- > -->
        <!-- </AppButton> -->
        <!-- <AppButton -->
        <!--   :text="'Ngừng hoạt động'" -->
        <!--   :is-disabled="selectedRows.length == 0" -->
        <!--   class="active-btn deactive" -->
        <!--   @click="() => (isConfirmModalShow = true)" -->
        <!-- > -->
        <!-- </AppButton> -->
        <AppButton
          v-if="allowActions.includes(`EXPORT`)"
          :text="'Xuất dữ liệu'"
          class="add-button"
          @click="handleExport"
        >
          <template #icon>
            <Icon name="material-symbols:export-notes-rounded" />
          </template>
        </AppButton>
      </div>
      <AppTableDataTableSystemUser
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
        @view="handleTableActionClick($event, 'view')"
        @revoke="handleTableActionClick($event, 'revoke')"
        @assign="handleTableActionClick($event, 'assign')"
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
  </div>
</template>
<script setup lang="ts">
import type { TTableAction } from "~/components/app/table/data-table-system-user.vue";
import type { TSort } from "~/types/common";
import { cloneDeep, debounce } from "lodash";
import { CELL_TYPE, CHIP_TYPE } from "~/const/common";
import axios from "axios";
import {
  userTableHeaders,
  pageSizeOptions,
} from "~/const/views/system-admin/users";
import moment from "moment";

definePageMeta({
  layout: "system-admin",
});
useHead({
  title: "Người dùng hệ thống",
});

const route = useRoute();
const router = useRouter();

const isConfirmModalShow = ref<boolean>(false);

const isCreateModalOpen = ref<boolean>(false);
const isDeleteModalOpen = ref<boolean>(false);
const isEditViewOpen = ref<boolean>(false);
const editViewId = ref<number | null>(null);
const editViewInitialMode = ref<any>(null);
const editViewMode = ref<any>(null);
const rolesFilterOptions = ref<any[]>([]);
const isFetchingData = ref<boolean>(false);
const controller = ref<AbortController | null>();
const filter = ref<Record<string, any>>({});
const totalItems = ref<number>(0);
const isNoData = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const deleteList = ref<any[]>([]);
const allowActions = computed(() => {
  const url = route.path;
  const menuItem = getMenuItem(url);
  const permissions = Array.from(menuItem?.permissions || []);
  return permissions;
});
const industryList = ref<any[]>([]);
const provinceList = ref<any[]>([]);

const isViewModalOpen = ref<any>(false);

const canEdit = computed(() => {
  if (allowActions.value.includes("UPDATE")) {
    return true;
  } else {
    return false;
  }
});

const { getMenuItem } = useSidebarStore();
const { setLoading } = useLoadingStore();
// TODO: REPLACE THIS APIS
const { getDepartments, deleteDepartment, changeDepartmentStatus } =
  useDepartmentApi();
const { getUserDetailAdmin, changeAdminStatus } = useSystemUserApi();

const { getRoles } = useRoleApi();

const { getUsers, getExport } = useSystemUserApi();

const { updateStatus } = useOrgApi();
const userStore = useUserStore();
const { userInfo: currentUserInfo } = storeToRefs(userStore);

// NOTE: From query string to filter
const convertQuery = () => {
  const _query = route.query;
  let restoredFilter: Record<string, any> = {};

  const { mode, targetId, ...query } = _query;

  restoredFilter = {
    ...restoredFilter,
    ...query,
  };

  // NOTE: Reopening modal
  if (mode && targetId) {
    restoredFilter = {
      ...restoredFilter,
      mode,
      targetId,
    };
    isEditViewOpen.value = true;
    editViewInitialMode.value = mode;
    editViewMode.value = mode;
    editViewId.value = +targetId;
  }

  if (targetId) {
    isViewModalOpen.value = true;
    editViewId.value = +targetId;
  }

  const createdAt: (Date | null)[] = [];
  if (query.createdAtStart) {
    const start = new Date(query.createdAtStart as string);
    if (!isNaN(start.getTime())) {
      createdAt.push(start);
    } else {
      createdAt.push(null);
    }
  }
  if (query.createdAtEnd) {
    const end = new Date(query.createdAtEnd as string);
    if (!isNaN(end.getTime())) {
      createdAt.push(end);
    } else {
      createdAt.push(null);
    }
  }
  if (createdAt.length) {
    restoredFilter.createdAt = createdAt;
  }

  if (query.fullName) {
    restoredFilter.info = query.fullName;
  }

  // if (query.isActive) {
  //   const values = (query.isActive as string).split(",");
  //   // console.log(values);
  //   restoredFilter.isActive = values.map((val) =>
  //     filterSelectOption.value.isActive.find((opt: any) => {
  //       const booleanValue = val == "true";
  //       return opt.value == booleanValue;
  //     }),
  //   );
  // }

  if (query.isEmailVerified) {
    const values = (query.isEmailVerified as string).split(",");
    // console.log(values);
    restoredFilter.isEmailVerified = values.map((val) =>
      filterSelectOption.value.isEmailVerified.find((opt: any) => {
        const booleanValue = val == "true";
        return opt.value == booleanValue;
      }),
    );
  }

  if (query.roleIds) {
    const ids = (query.roleIds as string).split(",");
    restoredFilter.roleIds = ids.map((val) =>
      filterSelectOption.value.roleIds.find((opt: any) => opt.value == +val),
    );
  }

  if (query.accessMethod) {
    restoredFilter.accessMethod = {
      label: query.accessMethod,
      value: query.accessMethod,
    };
  }

  const updatedAt: (Date | null)[] = [];
  if (query.updatedAtStart) {
    const start = new Date(query.updatedAtStart as string);
    if (!isNaN(start.getTime())) {
      updatedAt.push(start);
    } else {
      updatedAt.push(null);
    }
  }
  if (query.updatedAtEnd) {
    const end = new Date(query.updatedAtEnd as string);
    if (!isNaN(end.getTime())) {
      updatedAt.push(end);
    } else {
      updatedAt.push(null);
    }
  }
  if (updatedAt.length) {
    restoredFilter.updatedAt = updatedAt;
  }
  const dateOfBirth: (Date | null)[] = [];
  if (query.dateOfBirthStart) {
    const start = new Date(query.dateOfBirthStart as string);
    if (!isNaN(start.getTime())) {
      dateOfBirth.push(start);
    } else {
      dateOfBirth.push(null);
    }
  }
  if (query.dateOfBirthEnd) {
    const end = new Date(query.dateOfBirthEnd as string);
    if (!isNaN(end.getTime())) {
      dateOfBirth.push(end);
    } else {
      dateOfBirth.push(null);
    }
  }
  if (dateOfBirth.length) {
    restoredFilter.dateOfBirth = dateOfBirth;
  }

  delete restoredFilter.createdAtStart;
  delete restoredFilter.createdAtEnd;
  delete restoredFilter.updatedAtStart;
  delete restoredFilter.updatedAtEnd;

  return restoredFilter;
};

onBeforeMount(async () => {
  setLoading(true);

  const rolesRes = await getRoles({ pageSize: 999 });
  rolesFilterOptions.value = rolesRes.data.data;

  filter.value = convertQuery();
  setLoading(false);
});

const handleCreated = () => {
  isCreateModalOpen.value = false;
  fetchData();
};

const handleUpdated = () => {
  isEditViewOpen.value = false;
  fetchData();
};

const handleSwitchEditViewMode = (mode: any) => {
  editViewMode.value = mode;
};

const handleDeleteClick = (items: any[]) => {
  deleteList.value = items;
  isDeleteModalOpen.value = true;
};

const clearDeleteList = () => {
  deleteList.value = [];
};

const clearViewEditId = () => {
  editViewId.value = null;
  editViewInitialMode.value = null;
  editViewMode.value = null;
};

const handleDeleteModalOpenUpdate = (event: boolean) => {
  if (!event) {
    isConfirmModalShow.value = false;
  }
};

const handleDelete = async () => {
  isDeleting.value = true;
  // TODO: REPLACE THIS API
  const isSuccess = await deleteDepartment({ ids: deleteList.value });
  selectedRows.value = selectedRows.value.filter(
    (selected) => !deleteList.value.includes(selected),
  );
  isDeleting.value = false;
  if (isSuccess) {
    selectedRows.value = [];
    handleDeleteModalOpenUpdate(false);
    fetchData();
  }
};

const handleAddNew = () => {
  isCreateModalOpen.value = true;
};

const deleteListNames = computed(() => {
  // console.log({ deleteList: deleteList.value, tableData: tableData.value });
  return tableData.value
    .filter((data: any) => selectedRows.value.includes(data.id))
    .map((data: any) => data.name);
});

const isDeleteAllDisabled = computed(() => {
  const selectedRowsId = selectedRows.value;
  if (selectedRowsId.length == 0) {
    return true;
  }
  const rowData: any[] = [];
  for (const row of tableData.value) {
    if (selectedRowsId.includes((row as any).id)) {
      rowData.push(row);
    }
  }
  return rowData.some((row) => !row.canDelete);
});
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

async function handleExport() {
  setLoading(true);
  const query = route.query;
  const res = await getExport(query);
  setLoading(false);
}

const fetchData = async () => {
  if (controller.value) {
    controller.value.abort();
  }

  controller.value = new AbortController();
  isFetchingData.value = true;
  const query = route.query;
  const res = await getUsers(query, controller.value);
  if (!res) {
    isFetchingData.value = false;
    return;
  }
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

    const isAdmin = !!entry.roles.find((r: any) => r.code == "SYSTEM_ADMIN");
    const isSelf = entry.id == currentUserInfo.value?.id;
    const isEmailVerified = entry.isEmailVerified;

    entry.isRevokable = isAdmin && !isSelf;
    entry.isAssignable = !isAdmin && isEmailVerified;

    if (entry.dateOfBirth) {
      const arr = entry.dateOfBirth;
      entry.dateOfBirth = moment([arr[0], arr[1] - 1, arr[2]]).format(
        "DD/MM/YYYY",
      );
    }

    entry.info = {
      cellType: "avatar",
      data: {
        fullName: entry.fullName,
        avatarUrl: entry.avatarUrl,
        id: entry.id,
      },
    };
    // entry.isActive = entry.isActive
    //   ? {
    //       text: "Đang hoạt động",
    //       type: CHIP_TYPE.SUCCESS,
    //       cellType: CELL_TYPE.TAG,
    //     }
    //   : {
    //       text: "Ngừng hoạt động",
    //       type: CHIP_TYPE.ERROR,
    //       cellType: CELL_TYPE.TAG,
    //     };
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

    if (entry.accessMethods) {
      entry.accessMethod = {
        cellType: "tagsList",
        list: entry.accessMethods.map((i: any) => ({
          label: i.label,
          tooltip: i.label,
        })),
      };
    }
  }
  tableData.value = data;
};
const debouncedFetchData = debounce(fetchData, 500);
const selectedRows = ref<number[]>([]);
const handleSelectionsUpdate = (selectionList: number[]) => {
  // console.log({ selectionList });
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

const handleActiveToggle = async (ids: number[], state: boolean) => {
  const payload = {
    ids,
    active: state,
  };

  setLoading(true);
  const res = await updateStatus(payload.ids, payload.active);
  if (res) {
    selectedRows.value = [];
    isConfirmModalShow.value = false;
    fetchData();
  }
  setLoading(false);
};

const handleTableActionClick = async (id: number, action: TTableAction) => {
  if (action === "view") {
    editViewId.value = id;
    isViewModalOpen.value = true;

    // const link = router.resolve({
    //   path: `/system-admin/organizations/detail/${id}`,
    // });
    // window.open(link.href, "_blank");
  } else if (action === "revoke") {
    setLoading(true);
    const res = await changeAdminStatus(id, false);
    if (res) {
      await fetchData();
    }
    setLoading(false);
  } else if (action === "assign") {
    setLoading(true);
    const res = await changeAdminStatus(id, true);
    if (res) {
      await fetchData();
    }
    setLoading(false);
  }
};

const tableData = ref([]);
const filterSelectOption = computed(() => {
  return {
    // isActive: [
    //   {
    //     label: "Ngừng hoạt động",
    //     value: false,
    //   },
    //   {
    //     label: "Đang hoạt động",
    //     value: true,
    //   },
    // ],
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
    accessMethod: [
      {
        label: "LOCAL",
        value: "LOCAL",
      },
      {
        label: "GOOGLE",
        value: "GOOGLE",
      },
    ],
  };
});

const tableColumns = computed(() => {
  return userTableHeaders;
});
const pageSizeOpts = computed(() => {
  return pageSizeOptions;
});

// NOTE: From filter to query string
const normalizeFilter = (filter: any) => {
  const normalizedFilter = cloneDeep(filter);
  if (normalizedFilter.info) {
    normalizedFilter.fullName = normalizedFilter.info;
    delete normalizedFilter.info;
  }
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

  if (normalizedFilter.updatedAt) {
    const startDate = normalizedFilter.updatedAt[0];
    const endDate = normalizedFilter.updatedAt[1];
    delete normalizedFilter.updatedAt;
    if (startDate) {
      normalizedFilter.updatedAtStart = toUtcDate(startDate);
    }
    if (endDate) {
      normalizedFilter.updatedAtEnd = toUtcDate(endDate);
    }
  }

  if (normalizedFilter.dateOfBirth) {
    const startDate = normalizedFilter.dateOfBirth[0];
    const endDate = normalizedFilter.dateOfBirth[1];
    delete normalizedFilter.dateOfBirth;
    if (startDate) {
      normalizedFilter.dateOfBirthStart = toUtcDate(startDate, "yyyy-MM-DD");
    }
    if (endDate) {
      normalizedFilter.dateOfBirthEnd = toUtcDate(endDate, "yyyy-MM-DD");
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

  if (normalizedFilter.accessMethod) {
    normalizedFilter.accessMethod = normalizedFilter.accessMethod.value;
  }

  const queryForUrl: Record<string, any> = {
    ...normalizedFilter,
  };

  return queryForUrl;
};

watch(filter, (newVal) => {
  const queryForUrl = normalizeFilter(newVal);

  router.replace({
    query: {
      ...truncateQueryObject(queryForUrl),
    },
  });
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

watch(isViewModalOpen, (newVal) => {
  if (!newVal) {
    editViewId.value = null;
    const query = { ...route.query };
    delete query.targetId;
    router.replace({ query });
  }
});
</script>
<style lang="scss" scoped>
.wrapper {
  overflow: hidden;
  min-height: 0;
  flex: 1;
  border-radius: 8px;
  margin-top: 8px;
  @include box-shadow;
}
.department-content {
  background-color: white;
  min-height: calc(100% - 48px - 8px);
  @include box-shadow;
  color: $text-light;
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  @include custom-scrollbar;
  height: 100%;

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
