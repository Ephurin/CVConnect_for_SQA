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
      <DashboardOrgOverviewCard
        v-for="(card, index) of overview"
        :key="index"
        :num="card.num"
        :str="card.str"
        :icon="card.icon"
        :diff-string="card.diffString"
      />
    </div>
    <div v-if="passRate" class="block">
      <DashboardOrgChartPassRate :data="passRate" />
    </div>
    <div class="line line-3">
      <div v-if="jobAdsByHr" class="block left">
        <DashboardOrgChartJobAdByHr :data="jobAdsByHr" />
      </div>
      <div v-if="jobAdsByDept" class="block right">
        <DashboardOrgChartJobAdByDept :data="jobAdsByDept" />
      </div>
    </div>
    <div class="line line-4">
      <div v-if="passedByLevel" class="block left">
        <DashboardOrgChartPassedByLevel :data="passedByLevel" />
      </div>
      <div v-if="eliminatedByReason" class="block middle">
        <DashboardOrgChartEliminatedByReason :data="eliminatedByReason" />
      </div>
      <div v-if="eliminatedByReason" class="block right">
        <DashboardOrgFeaturedJobAdsTable :time-frame="monthInput" />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { toUpper } from "lodash";
import moment from "moment";
import type { TPassRateData } from "~/components/dashboard/org/chart/pass-rate.vue";
import { overviewMap } from "~/const/views/org/dashboard";
import type { TJobAdByHrData } from "~/components/dashboard/org/chart/job-ad-by-hr.vue";
import type { TJobAdByDeptData } from "~/components/dashboard/org/chart/job-ad-by-dept.vue";
import type { TPassedByLevel } from "~/components/dashboard/org/chart/passed-by-level.vue";
import type { TByEliminatedReasonData } from "~/components/dashboard/org/chart/eliminated-by-reason.vue";
import type { TPermissionCheckType } from "~/types/permision";
import { PERMISSION_CHECK_TYPE } from "~/const/permission";

definePageMeta({
  layout: "org-admin",
});

const { setLoading } = useLoadingStore();
const {
  getOverviewOrg,
  getPassRateOrg,
  getJobAdsByHr,
  getJobAdsByDept,
  getPassedByLevelOrg,
  getEliminatedByReasonOrg,
} = useDashboardApi();

const route = useRoute();
const router = useRouter();

const monthInput = ref<any>(undefined);

const overview = ref<any>(undefined);
const passRate = ref<TPassRateData[] | null>(null);
const jobAdsByHr = ref<TJobAdByHrData[] | null>(null);
const jobAdsByDept = ref<TJobAdByDeptData[] | null>(null);
const passedByLevel = ref<TPassedByLevel[] | null>(null);
const eliminatedByReason = ref<TByEliminatedReasonData[] | null>(null);

onBeforeMount(async () => {
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
    { month: now.month(), year: now.year() },
    { month: now.month(), year: now.year() },
  ];
});

function handleMonthInput(value: any) {
  monthInput.value = value;
}

async function fetchOverview(payload: any) {
  const res = await getOverviewOrg(payload);
  const arr = [];
  for (const key of Object.keys(res.data)) {
    if (key.slice(0, 4) == "inde") {
      continue;
    }
    const mapped: any = {
      str: overviewMap[key as keyof typeof overviewMap].text,
      num: res.data[key],
      icon: overviewMap[key as keyof typeof overviewMap].icon,
    };

    if (key == "percentPassed") {
      mapped.num += "%";
    }

    let diffKey = key;
    diffKey = "inde" + toUpper(diffKey[0]) + diffKey.slice(1);
    if (res.data[diffKey]) {
      mapped.diffString = res.data[diffKey];
    }

    arr.push(mapped);
  }
  overview.value = arr;
}

async function fetchPassRate(payload: any) {
  const res = await getPassRateOrg(payload);
  passRate.value = res.data;
}

async function fetchJobAdsByHr(payload: any) {
  const res = await getJobAdsByHr(payload);
  jobAdsByHr.value = res.data;
}

async function fetchJobAdsByDept(payload: any) {
  const res = await getJobAdsByDept(payload);
  jobAdsByDept.value = res.data;
}

async function fetchPassedByLevel(payload: any) {
  const res = await getPassedByLevelOrg(payload);
  passedByLevel.value = res.data;
}

async function fetchEliminatedByReason(payload: any) {
  const res = await getEliminatedByReasonOrg(payload);
  eliminatedByReason.value = res.data;
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
      fetchJobAdsByHr(payload),
      fetchJobAdsByDept(payload),
      fetchPassedByLevel(payload),
      fetchEliminatedByReason(payload),
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
    width: calc((100% - 16px) * 0.5);
  }
  .right {
    width: calc((100% - 16px) * 0.5);
  }

  @media (max-width: 1350px) {
    flex-direction: column;

    .left,
    .right {
      width: 100%;
    }
  }
}

.line-4 {
  .left {
    width: calc(((100% - 16px) * 0.5 - 16px) * 0.5);
  }
  .middle {
    width: calc(((100% - 16px) * 0.5 - 16px) * 0.5);
  }
  .right {
    width: calc((100% - 16px) * 0.5);
  }

  @media (max-width: 1350px) {
    flex-direction: column;

    .left,
    .right,
    .middle {
      width: 100%;
    }
  }
}
</style>
