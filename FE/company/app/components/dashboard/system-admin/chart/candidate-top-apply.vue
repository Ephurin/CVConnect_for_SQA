<template>
  <div class="candidate-top-apply">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TTopApplyData = {
  candidateName: string;
  numberOfApplications: number;
};

type TProps = {
  data: TTopApplyData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const numsOfApplications: number[] = [];
  const categories: string[] = [];

  for (const data of props.data) {
    numsOfApplications.push(data.numberOfApplications);
    categories.push(data.candidateName);
  }

  return {
    chart: {
      type: "bar",
    },
    title: {
      text: "Ứng viên ứng tuyển nhiều nhất",
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
        text: "Lượt ứng tuyển",
        align: "high",
      },
      labels: { overflow: "justify" },
      gridLineWidth: 0,
    },
    tooltip: {
      valueSuffix: " tin",
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
        name: "Lượt ứng tuyển",
        data: numsOfApplications,
        color: "#c90a1f", // ✅ ensures series bars are this color
      },
    ],
  };
});
</script>

<style lang="scss" scoped></style>
