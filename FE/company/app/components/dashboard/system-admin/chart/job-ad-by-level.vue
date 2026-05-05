<template>
  <div class="job-ad-by-level">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TJobAdByLevelData = {
  level: {
    name: string;
  };
  numberOfJobAds: number;
};

type TProps = {
  data: TJobAdByLevelData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const numberOfJobAds: number[] = [];
  const categories: string[] = [];

  for (const data of props.data) {
    numberOfJobAds.push(data.numberOfJobAds);
    categories.push(data.level.name);
  }

  return {
    chart: {
      type: "bar",
    },
    title: {
      text: "Tin tuyển dụng theo cấp bậc",
    },
    xAxis: {
      categories,
      title: { text: null },
      gridLineWidth: 0,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      allowDecimals: false, // ✅ integer scale only
      title: {
        text: "Lượng tin tuyển dụng",
        align: "high",
      },
      labels: { overflow: "justify" },
      gridLineWidth: 0,
    },
    tooltip: {
      valueSuffix: " lượt",
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: { enabled: true },
        groupPadding: 0.25,
        pointWidth: 25,
        color: "#c90a1f", // ✅ set bar color
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "Lượng tin tuyển dụng",
        data: numberOfJobAds,
        color: "#c90a1f", // ✅ ensures series bars are this color
      },
    ],
  };
});
</script>

<style lang="scss" scoped></style>
