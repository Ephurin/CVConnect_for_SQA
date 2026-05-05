<template>
  <div class="job-ad-by-dept">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TJobAdByDeptData = {
  departmentCode: string;
  departmentName: string;
  jobAdCount: number;
  totalOnboarded: number;
};

type TProps = {
  data: TJobAdByDeptData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const jobAdCounts: number[] = [];
  const categories: string[] = [];
  const extraTooltipData: { totalOnboarded: number }[] = [];

  for (const item of props.data) {
    categories.push(item.departmentName);
    jobAdCounts.push(item.jobAdCount); 
    extraTooltipData.push({
      totalOnboarded: item.totalOnboarded,
    });
  }

  return {
    chart: {
      type: "bar",
    },
    title: {
      text: "Tin tuyển dụng theo phòng ban",
    },
    xAxis: {
      categories,
      title: { text: null },
      gridLineWidth: 0,
      lineWidth: 0,
    },
    yAxis: {
      min: 0,
      allowDecimals: false,
      title: {
        text: "Số tin tuyển dụng",
        align: "high",
      },
      labels: { overflow: "justify" },
      gridLineWidth: 0,
    },
    tooltip: {
      formatter: function () {
        const idx = this.point.index;
        const detail = extraTooltipData[idx];

        return `
          <b>${this.point.category}</b><br/>
          Tin tuyển dụng: <b>${this.y}</b><br/>
          Số đã onboard: <b>${detail.totalOnboarded}</b>
        `;
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 0,
        dataLabels: { enabled: true },
        groupPadding: 0.25,
        pointWidth: 25,
        color: "#c90a1f",
      },
    },
    credits: { enabled: false },
    series: [
      {
        name: "Tin tuyển dụng",
        data: jobAdCounts,
        color: "#c90a1f",
      },
    ],
  };
});
</script>

<style lang="scss" scoped></style>
