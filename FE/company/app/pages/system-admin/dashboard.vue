<template>
  <div class="dashboard-wrapper flex flex-col gap-4">
    <div class="block top-block">
      <!-- <div class="title">Thống kê hệ thống</div> -->
      <div class="top">
        <AppInputMonthpicker
          :label="''"
          :required="false"
          :value="monthInput"
          :error="''"
          :slim-error="true"
          :placeholder="'Chọn khoảng thời gian'"
          :is-range="true"
          @input="handleMonthInput($event)"
        />
      </div>
    </div>
    <div class="line">
      <DashboardSystemAdminOverviewCard
        v-for="(card, index) of overview"
        :key="index"
        :num="card.num"
        :str="card.str"
        :icon="card.icon"
      />
    </div>
    <div v-if="passRate" class="block">
      <DashboardSystemAdminChartPassRate :data="passRate" />
    </div>
    <div class="line line-3">
      <div v-if="candidateMostApply" class="block left">
        <DashboardSystemAdminChartCandidateTopApply
          :data="candidateMostApply"
        />
      </div>
      <div v-if="eliminatedReasons" class="block right">
        <DashboardSystemAdminChartByEliminatedReason
          :data="eliminatedReasons"
        />
      </div>
    </div>
    <div v-if="jobAdsByTime" class="block">
      <DashboardSystemAdminChartJobAdByTime :data="jobAdsByTime" />
    </div>
    <div v-if="jobAdsByCareer" class="block">
      <DashboardSystemAdminChartJobAdByCareer :data="jobAdsByCareer" />
    </div>
    <div class="line line-5">
      <div v-if="jobAdsByLevel" class="block left">
        <DashboardSystemAdminChartJobAdByLevel :data="jobAdsByLevel" />
      </div>
      <div v-if="monthInput" class="block right">
        <DashboardSystemAdminFeaturedJobAdsTable :time-frame="monthInput" />
      </div>
    </div>
    <div v-if="newOrgByTime" class="block">
      <DashboardSystemAdminChartNewOrgByTime :data="newOrgByTime" />
    </div>
    <div class="line line-5">
      <div v-if="staffSize" class="block left">
        <DashboardSystemAdminChartStaffSize :data="staffSize" />
      </div>
      <div v-if="monthInput" class="block right">
        <DashboardSystemAdminNewOrgTable :time-frame="monthInput" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import moment from "moment";
import type { TByEliminatedReasonData } from "~/components/dashboard/system-admin/chart/by-eliminated-reason.vue";
import type { TTopApplyData } from "~/components/dashboard/system-admin/chart/candidate-top-apply.vue";
import type { TJobAdByCareerData } from "~/components/dashboard/system-admin/chart/job-ad-by-career.vue";
import type { TJobAdByLevelData } from "~/components/dashboard/system-admin/chart/job-ad-by-level.vue";
import type { TJobAdByTimeData } from "~/components/dashboard/system-admin/chart/job-ad-by-time.vue";
import type { TNewOrgByTimeData } from "~/components/dashboard/system-admin/chart/new-org-by-time.vue";
import type { TPassRateData } from "~/components/dashboard/system-admin/chart/pass-rate.vue";
import { overviewMap } from "~/const/views/system-admin/dashboard";

definePageMeta({
  layout: "system-admin",
});

const { setLoading } = useLoadingStore();
const {
  getOverview,
  getPassRate,
  getCandidateTopApply,
  getByEliminatedReason,
  getJobAdsByTime,
  getJobAdsByCareer,
  getJobAdsByLevel,
  getNewOrgByTime,
  getStaffSize,
} = useDashboardApi();

const route = useRoute();
const router = useRouter();

const monthInput = ref<any>(undefined);

const overview = ref<any>(undefined);
const passRate = ref<TPassRateData[] | null>(null);
const candidateMostApply = ref<TTopApplyData[] | null>(null);
const eliminatedReasons = ref<TByEliminatedReasonData[] | null>(null);
const jobAdsByTime = ref<TJobAdByTimeData[] | null>(null);
const jobAdsByCareer = ref<TJobAdByCareerData[] | null>(null);
const jobAdsByLevel = ref<TJobAdByLevelData[] | null>(null);
const newOrgByTime = ref<TNewOrgByTimeData[] | null>(null);
const staffSize = ref<any>(null);

onBeforeMount(async () => {
  const res = await getStaffSize();
  staffSize.value = res.data;

  const qStart = route.query.start as string | undefined; // "2025-11"
  const qEnd = route.query.end as string | undefined;

  const isValidYM = (m?: string) => m && moment(m, "YYYY-MM", true).isValid();

  if (isValidYM(qStart) && isValidYM(qEnd)) {
    const mStart = moment(qStart, "YYYY-MM");
    const mEnd = moment(qEnd, "YYYY-MM");

    monthInput.value = [
      { month: mStart.month(), year: mStart.year() },
      { month: mEnd.month(), year: mEnd.year() },
    ];

    return;
  }

  const now = moment();
  monthInput.value = [
    { month: 0, year: now.year() },
    { month: now.month(), year: now.year() },
  ];
});

function handleMonthInput(value: any) {
  monthInput.value = value;
}

async function fetchOverview(payload: any) {
  const res = await getOverview(payload);
  const arr = [];
  // console.log({ res });
  for (const key of Object.keys(res.data)) {
    arr.push({
      str: overviewMap[key as keyof typeof overviewMap].text,
      num: res.data[key],
      icon: overviewMap[key as keyof typeof overviewMap].icon,
    });
  }
  overview.value = arr;
}

async function fetchPassRate(payload: any) {
  const res = await getPassRate(payload);
  passRate.value = res.data;
}

async function fetchCandidateTopApply(payload: any) {
  const res = await getCandidateTopApply(payload);
  candidateMostApply.value = res.data;
}

async function fetchByEliminatedReasons(payload: any) {
  const res = await getByEliminatedReason(payload);
  eliminatedReasons.value = res.data;
}

async function fetchJobAdsByTime(payload: any) {
  const res = await getJobAdsByTime(payload);
  jobAdsByTime.value = res.data;
}

async function fetchJobAdsByCareer(payload: any) {
  const res = await getJobAdsByCareer(payload);
  jobAdsByCareer.value = res.data;
}

async function fetchJobAdsByLevel(payload: any) {
  const res = await getJobAdsByLevel(payload);
  jobAdsByLevel.value = res.data;
}

async function fetchNewOrgByTime(payload: any) {
  const res = await getNewOrgByTime(payload);
  newOrgByTime.value = res.data;
}

watch(
  monthInput,
  async (newVal) => {
    if (!newVal || !newVal[0] || !newVal[1]) return;

    const s = newVal[0];
    const e = newVal[1];

    router.replace({
      query: {
        ...route.query,
        start: moment({ year: s.year, month: s.month }).format("YYYY-MM"),
        end: moment({ year: e.year, month: e.month }).format("YYYY-MM"),
      },
    });

    const startDate = moment({ year: s.year, month: s.month })
      .startOf("month")
      .toDate();
    const endDate = moment({ year: e.year, month: e.month })
      .endOf("month")
      .toDate();

    const payload = {
      startTime: toDateStart(startDate.toDateString()),
      endTime: toDateEnd(endDate.toDateString()),
    };

    setLoading(true);
    await Promise.allSettled([
      fetchOverview(payload),
      fetchPassRate(payload),
      fetchCandidateTopApply(payload),
      fetchByEliminatedReasons(payload),
      fetchJobAdsByTime(payload),
      fetchJobAdsByCareer(payload),
      fetchJobAdsByLevel(payload),
      fetchNewOrgByTime(payload),
    ]);
    setLoading(false);
  },
  { immediate: true },
);
</script>
<style lang="scss" scoped>
.block {
  @include box-shadow;
  background-color: white;
  padding: 12px;
  border-radius: 8px;

  &.top-block {
    margin-top: 8px;
    position: sticky;
    top: 0px;
    z-index: 1;
    border: 1px solid $color-gray-300;
  }
}

.title {
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  margin-bottom: 6px;
}

.top {
  display: flex;
  flex-direction: row;

  :deep(.monthpicker-input) {
    max-width: 240px;
  }
}

.line {
  display: flex;
  flex-direction: row;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.line-3 {
  .left {
    width: calc((100% - 16px) * 0.6);
  }
  .right {
    width: calc((100% - 16px) * 0.4);
  }

  @media (max-width: 1350px) {
    flex-direction: column;

    .left,
    .right {
      width: 100%;
    }
  }
}

.line-5 {
  .left {
    width: calc((100% - 16px) * 0.4);
  }
  .right {
    width: calc((100% - 16px) * 0.6);
  }

  @media (max-width: 1350px) {
    flex-direction: column;

    .left,
    .right {
      width: 100%;
    }
  }
}
</style>
