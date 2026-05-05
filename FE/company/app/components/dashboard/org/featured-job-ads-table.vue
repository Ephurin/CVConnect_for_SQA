<template>
  <div class="featured-job-table">
    <div class="filter">
      <div class="title">Tin tuyển dụng được quan tâm nhất</div>
    </div>
    <table>
      <thead>
        <tr>
          <th>Tiêu đề</th>
          <th>
            Lượt ứng tuyển
            <Icon
              class="sort-icon"
              :name="sortIcon('numberOfApplications')"
              @click="handleSort('numberOfApplications')"
            />
          </th>
          <th>
            Lượt xem
            <Icon
              class="sort-icon"
              :name="sortIcon('numberOfViews')"
              @click="handleSort('numberOfViews')"
            />
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-if="featuredJobs?.length == 0 && !isLoading"
          class="no-data-wrapper"
        >
          <td colspan="4">
            <AppNoData />
          </td>
        </tr>
        <tr v-if="isLoading" class="spinner-wrapper">
          <td colspan="4">
            <AppSpinnerHalfCircle class="m-auto flex justify-center" />
          </td>
        </tr>
        <template v-if="!isLoading && featuredJobs?.length != 0">
          <tr v-for="job in featuredJobs" :key="job.id">
            <td class="cell-overflow" :title="job.title">{{ job.title }}</td>
            <td class="cell-overflow" :title="String(job.numberOfApplications)">
              {{ job.numberOfApplications }}
            </td>
            <td class="cell-overflow" :title="String(job.numberOfViews)">
              {{ job.numberOfViews }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import moment from "moment";

export type TFeaturedJobData = {
  id: number;
  title: string;
  orgId: number;
  org: { id: number; name: string };
  numberOfApplications: number;
  numberOfViews: number;
};

export type TProps = {
  timeFrame: any;
};
const props = defineProps<TProps>();

const { getJobAdsFeaturedOrg } = useDashboardApi();

const fetchJobAdsController = ref<AbortController | null>(null);
const featuredJobs = ref<TFeaturedJobData[]>([]);
const isLoading = ref<boolean>(false);
const sort = ref<any>(undefined);

const params = computed(() => {
  return {
    startTime: props.timeFrame[0],
    endTime: props.timeFrame[1],
    sortBy: sort.value?.sortBy,
    sortDirection: sort.value?.sortDirection,
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

async function fetchJobAds(params: any) {
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

  if (fetchJobAdsController.value) {
    fetchJobAdsController.value.abort();
  }
  fetchJobAdsController.value = new AbortController();

  params = {
    ...params,
    startTime: toDateStart(startDate.toDateString()),
    endTime: toDateEnd(endDate.toDateString()),
  };

  const res = await getJobAdsFeaturedOrg(params, fetchJobAdsController.value);
  featuredJobs.value = [...res.data];

  isLoading.value = false;
}

watch(
  params,
  async (newParams) => {
    await fetchJobAds(newParams);
  },
  { deep: true, immediate: true },
);
</script>

<style scoped lang="scss">
.featured-job-table {
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

    .search-select-input {
      max-width: 360px;
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
      width: 50%;
    }
    th:nth-child(2),
    td:nth-child(2) {
      width: 25%;
    }
    th:nth-child(3),
    td:nth-child(3) {
      width: 25%;
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
}
</style>
