<template>
  <div class="job-ad-by-time">
    <highchart :options="complexChart" />
  </div>
</template>
<script setup lang="ts">
export type TJobAdByTimeData = {
  label: string;
  numberOfJobAds: number;
};

type TProps = {
  data: TJobAdByTimeData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const jobAds = [];
  const categories: string[] = [];

  for (const data of props.data) {
    categories.push(data.label);
    jobAds.push(data.numberOfJobAds);
  }

  const config = {
    title: {
      text: "Số lượng tin tuyển dụng",
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Lượng tin tuyển dụng",
        },
        min: 0,
        allowDecimals: false, // integer scale
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        let s: any = `<b>${this.x}</b><br/>`;
        this.points.forEach((point: any) => {
          if (point.series.type === "spline") {
            s += `${point.series.name}: <b>${point.y.toFixed(2)}%</b><br/>`;
          } else {
            s += `${point.series.name}: <b>${point.y} tin</b><br/>`;
          }
        });
        return s;
      },
    },
    plotOptions: {
      series: {
        borderRadius: "0%",
      },
      column: {
        pointWidth: 25,
        groupPadding: 0.3,
        pointPadding: 0.1,
      },
    },
    series: [
      {
        name: "Lượng tin tuyển dụng",
        type: "column",
        data: jobAds,
        color: "#c90a1f",
      },
    ],
    credits: {
      enabled: false,
    },
    accessibility: {
      enabled: true,
    },
  };

  return config;
});
</script>
<style lang="scss" scoped></style>
