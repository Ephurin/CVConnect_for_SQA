<template>
  <div class="wrapper">
    <OrgAdminDetailOrgModal
      v-model="isViewModalOpen"
      :org-id="editViewId"
      @refetch="fetchData"
    />
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
      <div class="title">Danh sách doanh nghiệp</div>
      <div class="table-top">
        <AppButton
          :text="'Hoạt động'"
          :is-disabled="selectedRows.length == 0"
          class="active-btn active"
          @click="handleActiveToggle(selectedRows, true)"
        >
        </AppButton>
        <AppButton
          :text="'Ngừng hoạt động'"
          :is-disabled="selectedRows.length == 0"
          class="active-btn deactive"
          @click="() => (isConfirmModalShow = true)"
        >
        </AppButton>
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
      <AppTableDataTableOrg
        :table-data="tableData"
        :columns="tableColumns"
        :allow-actions="allowActions"
        :show-checkbox="true"
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
  </div>
</template>
<script setup lang="ts">
import type { TTableAction } from "~/components/app/table/data-table.vue";
import type { TSort } from "~/types/common";
import { cloneDeep, debounce } from "lodash";
import { CELL_TYPE, CHIP_TYPE } from "~/const/common";
import {
  organizationTableHeaders,
  pageSizeOptions,
} from "~/const/views/system-admin/organizations";
import axios from "axios";

definePageMeta({
  layout: "system-admin",
});
useHead({
  title: "Danh sách doanh nghiệp",
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
const isFetchingData = ref<boolean>(false);
const fetchOrgsController = ref<AbortController | null>();
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

const { getOrgs, getExport, updateStatus } = useOrgApi();
const { getIndustries } = useIndustryApi();

async function fetchIndustries() {
  const res = await getIndustries({ pageSize: 999 });
  if (!res) {
    return null;
  }
  industryList.value = res.data.data;
}

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

  if (query.isActive) {
    const values = (query.isActive as string).split(",");
    // console.log(values);
    restoredFilter.isActive = values.map((val) =>
      filterSelectOption.value.isActive.find((opt: any) => {
        const booleanValue = val == "true";
        return opt.value == booleanValue;
      }),
    );
    // console.log(restoredFilter.isActive);
  }

  if (query.industryIds) {
    const values = (query.industryIds as string).split(",");
    // console.log(values);
    restoredFilter.industryList = values.map((val) =>
      filterSelectOption.value.industryList.find((opt: any) => {
        return opt.value == val;
      }),
    );
  }

  if (query.addresses) {
    const addressLists = (query.addresses as string)
      .split(",")
      .map((a: any) => ({
        label: a,
        value: a,
      }));

    restoredFilter.addresses = addressLists;
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

  delete restoredFilter.createdAtStart;
  delete restoredFilter.createdAtEnd;
  delete restoredFilter.updatedAtStart;
  delete restoredFilter.updatedAtEnd;

  const companySizePair = {
    from: query.staffCountFrom,
    to: query.staffCountTo,
  };

  const companySizeOpt = filterSelectOption.value.companySize.find(
    (s: any) =>
      s.value.from == companySizePair.from && s.value.to == companySizePair.to,
  );
  if (companySizeOpt) {
    restoredFilter.companySize = companySizeOpt;
  }

  return restoredFilter;
};

onBeforeMount(async () => {
  setLoading(true);
  await fetchIndustries();
  const res = await axios.get(`https://provinces.open-api.vn/api/v2/?depth=1`);

  provinceList.value = res.data.map((p: any) => p.name);

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
  if (fetchOrgsController.value) {
    fetchOrgsController.value.abort();
  }

  fetchOrgsController.value = new AbortController();
  isFetchingData.value = true;
  const query = route.query;
  const res = await getOrgs(query, fetchOrgsController.value);
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
    const from = entry.staffCountFrom;
    const to = entry.staffCountTo;

    if (from != undefined && to != undefined) {
      entry.companySize = `Từ ${from} đến ${to}`;
    } else if (from == undefined && to != undefined) {
      entry.companySize = `Dưới ${to}`;
    } else if (from != undefined && to == undefined) {
      entry.companySize = `Trên ${from}`;
    }

    entry.index = index + 1 + (pageIndex.value - 1) * pageSize.value;
    entry.orgName = entry.name;
    entry.createdAt = formatDateTime(entry.createdAt, "DD/MM/YYYY - HH:mm");
    entry.updatedAt = formatDateTime(entry.updatedAt, "DD/MM/YYYY - HH:mm");
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
    entry.canDelete = false;
    entry.website = {
      text: entry.website,
      cellType: "link",
    };
    if (entry.industryList) {
      entry.industryList = {
        cellType: "tagsList",
        list: entry.industryList.map((i: any) => ({
          label: i.code,
          tooltip: i.name,
        })),
      };
    }
    if (entry.addresses) {
      entry.addresses = entry.addresses
        .map((a: any) => a.displayAddress)
        .join(", ");
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

const handleTableActionClick = (id: number, action: TTableAction) => {
  if (action === "view") {
    editViewId.value = id;
    isViewModalOpen.value = true;

    // const link = router.resolve({
    //   path: `/system-admin/organizations/detail/${id}`,
    // });
    // window.open(link.href, "_blank");
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
    industryList: industryList.value.map((i: any) => ({
      label: i.name,
      value: i.id,
    })),
    addresses: provinceList.value.map((p: any) => ({
      label: p,
      value: p,
    })),
    companySize: [
      {
        label: "Từ 1 đến 50",
        value: {
          from: 1,
          to: 50,
        },
      },

      {
        label: "Từ 50 đến 100",
        value: {
          from: 50,
          to: 100,
        },
      },
      {
        label: "Từ 100 đến 200",
        value: {
          from: 100,
          to: 200,
        },
      },
      {
        label: "Từ 200 đến 500",
        value: {
          from: 200,
          to: 500,
        },
      },
      {
        label: "Trên 500",
        value: {
          from: 500,
          to: undefined,
        },
      },
    ],
  };
});

const tableColumns = computed(() => {
  return organizationTableHeaders;
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
  if (normalizedFilter.updatedAt) {
    const startDate = normalizedFilter.updatedAt[0];
    const endDate = normalizedFilter.updatedAt[1];
    delete normalizedFilter.updatedAt;
    if (startDate) normalizedFilter.updatedAtStart = toUtcDate(startDate);
    if (endDate) normalizedFilter.updatedAtEnd = toUtcDate(endDate);
  }

  if (normalizedFilter.companySize) {
    const from = normalizedFilter.companySize.value.from;
    const to = normalizedFilter.companySize.value.to;

    if (from != undefined) {
      normalizedFilter.staffCountFrom = from;
    }
    if (to != undefined) {
      normalizedFilter.staffCountTo = to;
    }

    delete normalizedFilter.companySize;
  }

  if (normalizedFilter.industryList) {
    normalizedFilter.industryIds = normalizedFilter.industryList.map(
      (i: any) => i.value,
    );
    delete normalizedFilter.industryList;
  }

  if (normalizedFilter.addresses) {
    normalizedFilter.addresses = normalizedFilter.addresses.map(
      (i: any) => i.value,
    );
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
