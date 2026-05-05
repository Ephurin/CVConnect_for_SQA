<template>
  <div class="new-org-table">
    <div class="filter">
      <div class="title">Doanh nghiệp hoạt động tích cực</div>
      <AppInputText
        :label="''"
        :required="false"
        :error="''"
        :placeholder="'Tìm theo tên'"
        :value="searchString"
        :is-disabled="false"
        :slim-error="true"
        :title="''"
        class="text-input"
        @input="($event) => debounceInput($event)"
      />
    </div>
    <table>
      <thead>
        <tr>
          <th>Doanh nghiệp</th>
          <th>
            Số lượng tin
            <Icon
              class="sort-icon"
              :name="sortIcon('numberOfJobAds')"
              @click="handleSort('numberOfJobAds')"
            />
          </th>
          <th>
            Số lượng ứng viên
            <Icon
              class="sort-icon"
              :name="sortIcon('numberOfApplications')"
              @click="handleSort('numberOfApplications')"
            />
          </th>
          <th>
            Số lượng onboard
            <Icon
              class="sort-icon"
              :name="sortIcon('numberOfOnboarded')"
              @click="handleSort('numberOfOnboarded')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="tableData?.length == 0 && !isLoading" class="no-data-wrapper">
          <td colspan="4">
            <AppNoData />
          </td>
        </tr>
        <tr v-if="isLoading" class="spinner-wrapper">
          <td colspan="4">
            <AppSpinnerHalfCircle class="m-auto flex justify-center" />
          </td>
        </tr>
        <template v-if="!isLoading && tableData?.length != 0">
          <tr v-for="org in tableData" :key="org.orgId">
            <td class="cell-overflow" :title="org.orgName">
              <!-- <div class="logo"> -->
              <!--   <img :src="org?.orgLogo ?? '/blankuser.jpg'" alt="" /> -->
              <!-- </div> -->
              {{ org.orgName }}
            </td>
            <td class="cell-overflow" :title="String(org.numberOfJobAds)">
              {{ org.numberOfJobAds }}
            </td>
            <td class="cell-overflow" :title="String(org.numberOfApplications)">
              {{ org.numberOfApplications }}
            </td>
            <td class="cell-overflow" :title="String(org.numberOfOnboarded)">
              {{ org.numberOfOnboarded }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
    <div class="pagination">
      <div class="record-count">{{ `${totalItems} bản ghi` }}</div>
      <UPagination
        :show-edges="true"
        :sibling-count="1"
        :variant="'ghost'"
        active-variant="subtle"
        :items-per-page="10"
        :page="pageIndex"
        :total="totalItems"
        @update:page="($event) => (pageIndex = $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import debounce from "lodash/debounce";
import moment from "moment";

export type TFeaturedOrg = {
  orgId: number;
  orgName: string;
  orgLogo: string;
  numberOfJobAds: number;
  numberOfApplications: number;
  numberOfOnboarded: number;
};

export type TProps = {
  timeFrame: any;
};
const props = defineProps<TProps>();

const { getOrgFeatured } = useDashboardApi();
const { getOrgs } = useOrgApi();

const fetchController = ref<AbortController | null>(null);
const tableData = ref<TFeaturedOrg[]>([]);
const isLoading = ref<boolean>(false);
const searchString = ref<string>("");
const sort = ref<any>(undefined);
const totalItems = ref<any>(0);
const pageIndex = ref<number>(1);

const params = computed(() => {
  return {
    startTime: props.timeFrame[0],
    endTime: props.timeFrame[1],
    orgName: searchString.value.trim(),
    sortBy: sort.value?.sortBy,
    sortDirection: sort.value?.sortDirection,
    pageSize: 10,
    pageIndex: pageIndex.value - 1,
  };
});

const sortIcon = computed(() => {
  return (colKey: string) => {
    if (colKey != sort.value?.sortBy) {
      return "mdi:sort";
    }
    if (sort.value?.sortDirection == "ASC") {
      return "mdi:sort-ascending";
    } else if (sort.value?.sortDirection == "DESC") {
      return "mdi:sort-descending";
    } else {
      return "mdi:sort";
    }
  };
});

function handleSort(colKey: string) {
  pageIndex.value = 1;
  if (!sort.value || sort.value?.sortBy != colKey) {
    sort.value = {
      sortDirection: "ASC",
      sortBy: colKey,
    };
    return;
  }

  if (sort.value.sortDirection == "ASC") {
    sort.value.sortDirection = "DESC";
    return;
  }

  if (sort.value.sortDirection == "DESC") {
    sort.value = undefined;
  }

  return;
}

async function fetchTableData(params: any) {
  isLoading.value = true;

  if (!props.timeFrame || !props.timeFrame[0] || !props.timeFrame[1]) return;

  const s = props.timeFrame[0];
  const e = props.timeFrame[1];

  const startDate = moment({ year: s.year, month: s.month })
    .startOf("month")
    .toDate();
  const endDate = moment({ year: e.year, month: e.month })
    .endOf("month")
    .toDate();

  if (fetchController.value) {
    fetchController.value.abort();
  }
  fetchController.value = new AbortController();

  params = {
    ...params,
    startTime: toDateStart(startDate.toDateString()),
    endTime: toDateEnd(endDate.toDateString()),
  };

  const res = await getOrgFeatured(params, fetchController.value);
  if (res) {
    tableData.value = [...res.data.data];
    totalItems.value = res.data.pageInfo.totalElements;
  }

  isLoading.value = false;
}

function onSearch(value: string) {
  pageIndex.value = 1;
  searchString.value = value;
}

const debounceInput = debounce((value: string) => {
  onSearch(value);
}, 300);

watch(
  params,
  async (newParams) => {
    await fetchTableData(newParams);
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.new-org-table {
  .filter {
    margin-bottom: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;

    .title {
      font-size: 19px;
      font-weight: 600;
      color: #333333;
    }

    .text-input {
      max-width: 360px;
      width: 360px;
      :deep(.input) {
        padding: 4px 6px;

        input {
          font-size: 14px;
        }
      }
    }
  }

  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    font-family: "Inter", sans-serif;
    font-size: 13px;

    th,
    td {
      padding: 12px 16px;
      text-align: left;
    }

    /* Column widths */
    th:nth-child(1),
    td:nth-child(1) {
      width: 40%;
    }
    th:nth-child(2),
    td:nth-child(2) {
      width: 20%;
    }
    th:nth-child(3),
    td:nth-child(3) {
      width: 20%;
    }
    th:nth-child(4),
    td:nth-child(4) {
      width: 20%;
    }

    th {
      background-color: #f9fafb;
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    tbody tr {
      background-color: #ffffff;
      transition: background-color 0.2s;
    }

    tbody tr:hover {
      background-color: #f3f4f6;
    }

    tbody tr + tr {
      border-top: 1px solid #e5e7eb;
    }

    /* Text overflow handling for all cells */
    .cell-overflow {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 0; /* Forces ellipsis in table cells with fixed width */
    }
  }

  .no-data-wrapper,
  .spinner-wrapper {
    width: 100%;
  }

  .spinner-wrapper {
    height: 64px;
  }

  .sort-icon {
    font-size: 20px;
    margin-left: 2px;
    vertical-align: middle;
    cursor: pointer;
    color: $color-primary-500;
  }

  .pagination {
    margin-top: 12px;

    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;

    .record-count {
      font-size: 14px;
    }
  }

  .logo {
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 4px;
    overflow: hidden;
    position: relative;

    display: inline-block;

    img {
      object-fit: cover;
      width: 100%;
      height: 100%;
      min-width: 100%;
    }
  }
}
</style>
