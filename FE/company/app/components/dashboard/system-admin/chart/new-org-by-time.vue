<template>
  <div class="new-org-by-time">
    <highchart :options="complexChart" />
  </div>
</template>
<script setup lang="ts">
export type TNewOrgByTimeData = {
  label: string;
  numberOfOrgs: number;
};

type TProps = {
  data: TNewOrgByTimeData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const jobAds = [];
  const categories: string[] = [];

  for (const data of props.data) {
    categories.push(data.label);
    jobAds.push(data.numberOfOrgs);
  }

  const config = {
    title: {
      text: "Số lượng doanh nghiệp mới",
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Số lượng",
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
            s += `${point.series.name}: <b>${point.y} doanh nghiệp</b><br/>`;
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
        name: "Số lượng",
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
