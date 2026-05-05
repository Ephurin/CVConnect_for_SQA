<template>
  <div class="wrapper">
    <div class="onboard-content">
      <div class="title">Danh sách onboard</div>
      <!-- <div class="table-top"> -->
      <!--   <AppButton -->
      <!--     :text="'Xóa bỏ'" -->
      <!--     :is-disabled="isDeleteAllDisabled" -->
      <!--     class="delete-button" -->
      <!--     @click="handleDeleteClick(selectedRows)" -->
      <!--   > -->
      <!--     <template #icon> -->
      <!--       <Icon name="material-symbols:delete-outline-rounded" /> -->
      <!--     </template> -->
      <!--   </AppButton> -->
      <!---->
      <!--   <UModal -->
      <!--     :open="isDeleteModalOpen" -->
      <!--     title="Xóa ngành nghề" -->
      <!--     :ui="{ content: 'w-[600px] max-w-[600px]' }" -->
      <!--     @update:open="handleDeleteModalOpenUpdate" -->
      <!--     @after:leave="clearDeleteList" -->
      <!--   > -->
      <!--     <template #body> -->
      <!--       <ModalsDeleteConfirm :delete-list="deleteListNames"> -->
      <!--         <template #footer> -->
      <!--           <AppButton -->
      <!--             :text="'Đồng ý'" -->
      <!--             class="modal-delete-submit" -->
      <!--             :is-loading="isDeleting" -->
      <!--             @click="handleDelete" -->
      <!--           /> -->
      <!--         </template> -->
      <!--       </ModalsDeleteConfirm> -->
      <!--     </template> -->
      <!--   </UModal> -->
      <!---->
      <!--   <AppButton :text="'Thêm mới'" class="add-button" @click="handleAddNew"> -->
      <!--     <template #icon> -->
      <!--       <Icon name="material-symbols:add-2-rounded" /> -->
      <!--     </template> -->
      <!--   </AppButton> -->
      <!-- </div> -->
      <AppTableDataTableOnboardList
        :table-data="tableData"
        :columns="tableColumns"
        :allow-actions="allowActions as TPermission[]"
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
import {
  candidateOnboardTableHeaders,
  pageSizeOptions,
} from "~/const/views/org/onboard";
import { CANDIDATE_STATUS } from "~/const/views/org/candidates";

definePageMeta({
  layout: "org",
});
useHead({
  title: "Danh sách onboard",
});

const route = useRoute();
const router = useRouter();
const isCreateModalOpen = ref<boolean>(false);
const isDeleteModalOpen = ref<boolean>(false);
const hrList = ref<any>([]);
const levelList = ref<any>([]);
const isEditViewOpen = ref<boolean>(false);
const editViewId = ref<number | null>(null);
const editViewInitialMode = ref<any>(null);
const editViewMode = ref<any>(null);
const isFetchingData = ref<boolean>(false);
const fetchOnboardListController = ref<AbortController | null>();
const filter = ref<Record<string, any>>({});
const totalItems = ref<number>(0);
const isNoData = ref<boolean>(false);
const isDeleting = ref<boolean>(false);
const deleteList = ref<any[]>([]);
const allowActions = computed(() => {
  return ["VIEW"];
  const url = route.path;
  const menuItem = getMenuItem(url);
  const permissions = Array.from(menuItem?.permissions || []);
  return permissions;
});

const canEdit = computed(() => {
  if (allowActions.value.includes("UPDATE")) {
    return true;
  } else {
    return false;
  }
});

const { getMenuItem } = useSidebarStore();
// TODO: REPLACE THIS APIS
const { getJobAdCandidatesOnboardList } = useCandidateApi();
const { getByRoleCode } = useUserApi();
const { getLevels } = useLevelApi();

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

  const onboardDate: (Date | null)[] = [];
  if (query.onboardDateStart) {
    const start = new Date(query.onboardDateStart as string);
    if (!isNaN(start.getTime())) {
      onboardDate.push(start);
    } else {
      onboardDate.push(null);
    }
  }
  if (query.onboardDateEnd) {
    const end = new Date(query.onboardDateEnd as string);
    if (!isNaN(end.getTime())) {
      onboardDate.push(end);
    } else {
      onboardDate.push(null);
    }
  }
  if (onboardDate.length) {
    restoredFilter.onboardDate = onboardDate;
  }

  const applyDate: (Date | null)[] = [];
  if (query.applyDateStart) {
    const start = new Date(query.applyDateStart as string);
    if (!isNaN(start.getTime())) {
      applyDate.push(start);
    } else {
      applyDate.push(null);
    }
  }
  if (query.applyDateEnd) {
    const end = new Date(query.applyDateEnd as string);
    if (!isNaN(end.getTime())) {
      applyDate.push(end);
    } else {
      applyDate.push(null);
    }
  }
  if (applyDate.length) {
    restoredFilter.updatedAt = applyDate;
  }

  delete restoredFilter.onboardDateStart;
  delete restoredFilter.onboardDateEnd;
  delete restoredFilter.applyDateStart;
  delete restoredFilter.applyDateEnd;

  if (query.status) {
    const statusOpt = filterSelectOption.value.status.find(
      (s: any) => s.value == query.status,
    );
    if (statusOpt) {
      restoredFilter.status = statusOpt;
    }
  }

  if (query.hrContactId) {
    const hr = filterSelectOption.value.hrContact.find(
      (h: any) => h.value == query.hrContactId,
    );

    if (hr) {
      restoredFilter.hrContact = hr;
    }
  }

  if (query.levelId) {
    const lvl = filterSelectOption.value.level.find(
      (l: any) => l.value == query.levelId,
    );

    if (lvl) {
      restoredFilter.level = lvl;
    }
  }

  return restoredFilter;
};

async function fetchHr(params: any, controller?: AbortController) {
  const res = await getByRoleCode("HR");
  if (!res) {
    return null;
  }

  hrList.value = res.data;
}

async function fetchLevels() {
  const res = await getLevels({ pageSize: 999 });
  if (!res) {
    return null;
  }

  levelList.value = res.data.data;
}

onBeforeMount(async () => {
  await fetchHr({ pageSize: 999 });
  await fetchLevels();
  filter.value = convertQuery();
});

// const handleCreated = () => {
//   isCreateModalOpen.value = false;
//   fetchData();
// };
//
// const handleUpdated = () => {
//   isEditViewOpen.value = false;
//   fetchData();
// };
//
// const handleSwitchEditViewMode = (mode: any) => {
//   editViewMode.value = mode;
// };
//
// const handleDeleteClick = (items: any[]) => {
//   deleteList.value = items;
//   isDeleteModalOpen.value = true;
// };

// const clearDeleteList = () => {
//   deleteList.value = [];
// };

// const clearViewEditId = () => {
//   editViewId.value = null;
//   editViewInitialMode.value = null;
//   editViewMode.value = null;
// };

// const handleDeleteModalOpenUpdate = (event: boolean) => {
//   if (!event) {
//     isDeleteModalOpen.value = false;
//   }
// };

// const handleDelete = async () => {
//   isDeleting.value = true;
//   // TODO: REPLACE THIS API
//   const isSuccess = await deleteCareer({ ids: deleteList.value });
//   isDeleting.value = false;
//   if (isSuccess) {
//     handleDeleteModalOpenUpdate(false);
//     fetchData();
//   }
// };

// const handleAddNew = () => {
//   isCreateModalOpen.value = true;
// };
//
// const deleteListNames = computed(() => {
//   return tableData.value
//     .filter((data: any) => deleteList.value.includes(data.id))
//     .map((data: any) => data.name);
// });
//
// const isDeleteAllDisabled = computed(() => {
//   const selectedRowsId = selectedRows.value;
//   if (selectedRowsId.length == 0) {
//     return true;
//   }
//   const rowData: any[] = [];
//   for (const row of tableData.value) {
//     if (selectedRowsId.includes((row as any).id)) {
//       rowData.push(row);
//     }
//   }
//   return rowData.some((row) => !row.canDelete);
// });

const filterSelectOption = computed(() => {
  const statusOptions = [
    {
      label: "Chờ onboard",
      value: "WAITING_ONBOARDING",
    },
    {
      label: "Đã onboard",
      value: "ONBOARDED",
    },
  ];

  const hrOptions = hrList.value.map((hr: any) => ({
    label: hr.fullName,
    value: hr.id,
  }));

  const levelOptions = levelList.value.map((level: any) => ({
    label: level.name,
    value: level.id,
  }));

  // console.log({ levelOptions });

  return {
    status: statusOptions,
    hrContact: hrOptions,
    level: levelOptions,
  };
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

const fetchData = async () => {
  if (fetchOnboardListController.value) {
    fetchOnboardListController.value.abort();
  }

  fetchOnboardListController.value = new AbortController();
  isFetchingData.value = true;
  const query = route.query;
  const res = await getJobAdCandidatesOnboardList(
    query,
    fetchOnboardListController.value,
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

    entry.onboardDate = formatDateTime(entry.onboardDate, "DD/MM/YYYY");
    entry.applyDate = formatDateTime(entry.applyDate, "DD/MM/YYYY - HH:mm");
    entry.fullName = entry.candidateInfo.fullName;
    entry.email = entry.candidateInfo.email;
    entry.phone = entry.candidateInfo.phone;
    entry.status = {
      text: entry.candidateStatusDto.label,
      key: entry.candidateStatusDto.name,
      cellType: "candidateStatusChip",
    };
    entry.id = entry.candidateInfo.id;
    entry.hrContact = entry.jobAd.hrContact.fullName;
    entry.level = entry.level.levelName;

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
  // if (action === "delete") {
  //   handleDeleteClick([id]);
  // }
  if (action === "view") {
    // editViewId.value = id;
    // editViewInitialMode.value = "view";
    // editViewMode.value = "view";
    // isEditViewOpen.value = true;
    const link = router.resolve({ path: `/org/candidate/detail/${id}` });
    window.open(link.href, "_blank");
  }
  // if (action === "edit") {
  //   editViewId.value = id;
  //   editViewInitialMode.value = "edit";
  //   editViewMode.value = "edit";
  //   isEditViewOpen.value = true;
  // }
};

const tableData = ref([]);
const tableColumns = computed(() => {
  return candidateOnboardTableHeaders;
});
const pageSizeOpts = computed(() => {
  return pageSizeOptions;
});

// NOTE: From filter to query string
const normalizeFilter = (filter: any) => {
  const normalizedFilter = cloneDeep(filter);
  if (normalizedFilter.applyDate) {
    const startDate = normalizedFilter.applyDate[0];
    const endDate = normalizedFilter.applyDate[1];
    delete normalizedFilter.applyDate;
    if (startDate) {
      normalizedFilter.applyDateStart = toUtcDate(startDate);
    }
    if (endDate) {
      normalizedFilter.applyDateEnd = toUtcDate(endDate);
    }
  }
  if (normalizedFilter.onboardDate) {
    const startDate = normalizedFilter.onboardDate[0];
    const endDate = normalizedFilter.onboardDate[1];
    delete normalizedFilter.onboardDate;
    if (startDate) normalizedFilter.onboardDateStart = toUtcDate(startDate);
    if (endDate) normalizedFilter.onboardDateEnd = toUtcDate(endDate);
  }
  if (normalizedFilter.status) {
    normalizedFilter.status = normalizedFilter.status.value;
  }

  if (normalizedFilter.hrContact) {
    normalizedFilter.hrContactId = normalizedFilter.hrContact.value;
    delete normalizedFilter.hrContact;
  }

  if (normalizedFilter.level) {
    normalizedFilter.levelId = normalizedFilter.level.value;
    delete normalizedFilter.level;
  }

  // console.log({ filter });

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

// watch(isEditViewOpen, (newVal) => {
//   if (!newVal) {
//     clearViewEditId();
//   }
// });
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
.onboard-content {
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
    flex-direction: row;
    gap: 8px;
    justify-content: flex-end;

    :deep(button[type="button"][disabled]) {
      color: $color-gray-400;
    }
  }
  .table-section {
    max-width: 100%;
  }
}

:deep(.header-cell) {
  .filter {
    min-width: 100% !important;
    width: 100% !important;
    max-width: 100% !important;
    button.select-input {
      min-width: 100% !important;
      width: 100% !important;
      max-width: 100% !important;
    }
  }
}
</style>
