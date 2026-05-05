<template>
  <div class="job-ad-by-hr">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TJobAdByHrData = {
  hrName: string;
  jobAdCount: number;
  totalApplications: number;
  totalOnboarded: number;
};

type TProps = {
  data: TJobAdByHrData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const jobAdCounts: number[] = [];
  const categories: string[] = [];
  const extraTooltipData: {
    totalApplications: number;
    totalOnboarded: number;
  }[] = [];

  for (const item of props.data) {
    categories.push(item.hrName);
    jobAdCounts.push(item.jobAdCount);
    extraTooltipData.push({
      totalApplications: item.totalApplications,
      totalOnboarded: item.totalOnboarded,
    });
  }

  return {
    chart: {
      type: "bar",
    },
    title: {
      text: "Tin tuyển dụng theo HR",
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
          Lượt ứng tuyển: <b>${detail.totalApplications}</b><br/>
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
