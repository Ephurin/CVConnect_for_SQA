<template>
  <div class="staff-size">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TStaffSizeData = {
  staffSize: string;
  numberOfOrgs: number;
};

type TProps = {
  data: TStaffSizeData[];
};

const props = defineProps<TProps>();

const PALETTE = [
  "#1f77b4", // blue
  "#ff7f0e", // orange
  "#2ca02c", // green
  "#d62728", // red
  "#9467bd", // purple
  "#8c564b", // brown
  "#e377c2", // pink
  "#7f7f7f", // gray
  "#bcbd22", // lime
  "#17becf", // cyan
  "#393b79", // dark blue
  "#ff9896", // light red
  "#98df8a", // light green
  "#c5b0d5", // light purple
  "#c49c94", // light brown
];

const CENTER_TEXT_COLOR = "#2E2E2E"; // dark neutral
const DATA_LABEL_COLOR = "#374151"; // gray-700

const complexChart = computed(() => {
  const seriesData = props.data.map((item, index) => ({
    name: item.staffSize,
    y: item.numberOfOrgs,
    color: PALETTE[index % PALETTE.length], // cycle 10 colors safely
  }));

  let total = 0;
  for (const data of seriesData) {
    total += data.y;
  }

  return {
    chart: {
      type: "pie",
      custom: {},
      events: {
        render() {
          const chart = this;
          const series = chart.series[0];

          let customLabel = chart.options.chart.custom.label;

          if (!customLabel) {
            customLabel = chart.options.chart.custom.label = chart.renderer
              .label(`Tổng<br/><strong>${total}</strong><br/>doanh nghiệp`)
              .css({
                color: CENTER_TEXT_COLOR,
                textAnchor: "middle",
              })
              .add();
          }

          const x = series.center[0] + chart.plotLeft;
          const y =
            series.center[1] + chart.plotTop - customLabel.attr("height") / 2 - 24;

          customLabel.attr({ x, y });

          customLabel.css({
            fontSize: `${series.center[2] / 12}px`,
          });
        },
      },
    },

    title: {
      text: "Quy mô nhân sự",
      align: "center",
      style: {
        color: "#111827",
        fontWeight: "600",
      },
    },

    tooltip: {
      pointFormat: "{point.name}: <b>{point.percentage:.1f}%</b>",
    },

    legend: {
      enabled: false,
    },

    plotOptions: {
      series: {
        allowPointSelect: true,
        cursor: "pointer",
        borderRadius: 8,
        dataLabels: [
          {
            enabled: true,
            distance: 20,
            formatter() {
              return `${this.point.name}`;
            },
            style: {
              color: DATA_LABEL_COLOR,
              fontWeight: "normal",
            },
          },
          {
            enabled: true,
            distance: -20,
            formatter() {
              return `${this.point.y}`;
            },
            style: {
              color: DATA_LABEL_COLOR,
              fontSize: "0.9em",
              fontWeight: "normal",
            },
          },
        ],
      },
    },

    series: [
      {
        name: "Số lượng",
        innerSize: "75%",
        colorByPoint: false,
        data: seriesData,
      },
    ],

    credits: { enabled: false },
  };
});
</script>

<style scoped lang="scss"></style>
