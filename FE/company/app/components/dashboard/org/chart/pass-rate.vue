<template>
  <div class="pass-rate">
    <highchart :options="complexChart" />
  </div>
</template>
<script setup lang="ts">
export type TPassRateData = {
  label: string;
  numberOfApplications: number;
  numberOfPassed: number;
  percent: number;
};

type TProps = {
  data: TPassRateData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const numsOfApplications = [];
  const numsOfPassedApplications = [];
  const passRate = [];
  const categories = [];

  for (const data of props.data) {
    numsOfApplications.push(data.numberOfApplications);
    numsOfPassedApplications.push(data.numberOfPassed);
    passRate.push(data.percent);
    categories.push(data.label);
  }

  const AXIS_PADDING = 5;
  const yMin = Math.min(...numsOfApplications, ...numsOfPassedApplications);
  const yMax =
    Math.max(...numsOfApplications, ...numsOfPassedApplications) + AXIS_PADDING;

  const config = {
    title: {
      text: "Tỉ lệ trúng tuyển",
    },
    xAxis: {
      categories: categories,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Lượng ứng tuyển",
        },
        min: 0,
        max: yMax,
      },
      {
        title: {
          text: "Tỉ lệ trúng tuyển (%)",
        },
        min: 0,
        max: 100,
        opposite: true, // Place this axis on the right side
      },
    ],
    tooltip: {
      shared: true, // Show tooltip for all series
      formatter: function () {
        let s: any = `<b>${this.x}</b><br/>`;
        this.points.forEach((point: any) => {
          if (point.series.type === "spline") {
            s += `${point.series.name}: <b>${point.y.toFixed(2)}%</b><br/>`; // Append % for pass rate
          } else {
            s += `${point.series.name}: <b>${point.y}</b><br/>`;
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
        name: "Lượng ứng tuyển",
        type: "column",
        data: numsOfApplications,
        color: "#c90a1f",
        yAxis: 0, // Link to the first yAxis
      },
      {
        name: "Lượng trúng tuyển",
        type: "column",
        data: numsOfPassedApplications,
        color: "#10b981",
        yAxis: 0, // Link to the first yAxis
      },
      {
        type: "spline",
        step: "center",
        name: "Tỉ lệ trúng tuyển",
        data: passRate,
        color: "#007BC3",
        marker: {
          lineWidth: 1,
          lineColor: "#007BC3",
          fillColor: "#007BC3",
        },
        yAxis: 1, // Link to the second yAxis for pass rate
      },
    ],
    credits: {
      enabled: false, // Disable the credits label
    },
    accessibility: {
      enabled: true,
    },
  };

  return config;
});
</script>
<style lang="scss" scoped></style>
