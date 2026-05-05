<template>
  <div class="job-ad-by-career">
    <highchart :options="complexChart" />
  </div>
</template>

<script setup lang="ts">
export type TJobAdByCareerData = {
  career: {
    name: string;
  };
  numberOfJobAds: number;
  avgSalary: number;
  avgSalaryStr: string;
};

type TProps = {
  data: TJobAdByCareerData[];
};

const props = defineProps<TProps>();

const complexChart = computed(() => {
  const jobAds: number[] = [];
  const avgSalaries: number[] = [];
  const avgSalariesStr: string[] = [];
  const categories: string[] = [];

  for (const data of props.data) {
    jobAds.push(data.numberOfJobAds);
    avgSalaries.push(data.avgSalary);
    avgSalariesStr.push(data.avgSalaryStr);
    categories.push(data.career.name);
  }

  // Y-axis calculations
  const AXIS_PADDING = 1;
  const yMinJobAds =
    Math.min(...jobAds) - AXIS_PADDING >= 0
      ? Math.min(...jobAds) - AXIS_PADDING
      : 0;
  const yMaxJobAds = Math.max(...jobAds) + AXIS_PADDING;

  const yMinSalary =
    Math.min(...avgSalaries) - AXIS_PADDING >= 0
      ? Math.min(...avgSalaries) - AXIS_PADDING
      : 0;
  const yMaxSalary = Math.max(...avgSalaries) + AXIS_PADDING;

  return {
    title: {
      text: "Tin tuyển dụng theo nghề nghiệp",
    },
    xAxis: {
      categories,
      crosshair: true,
    },
    yAxis: [
      {
        title: {
          text: "Số lượng tin tuyển dụng",
        },
        min: yMinJobAds,
        max: yMaxJobAds,
        allowDecimals: false, // integer scale
      },
      {
        title: {
          text: "Mức lương trung bình (triệu VND)",
        },
        min: yMinSalary,
        max: yMaxSalary,
        opposite: true,
        allowDecimals: false,
      },
    ],
    tooltip: {
      shared: true,
      formatter: function () {
        let s: any = `<b>${this.x}</b><br/>`;
        this.points.forEach((point: any) => {
          if (point.series.type === "line") {
            // show string value instead of numeric
            s += `${point.series.name}: <b>${avgSalariesStr[point.point.index]}</b><br/>`;
          } else {
            s += `${point.series.name}: <b>${point.y}</b><br/>`;
          }
        });
        return s;
      },
    },
    plotOptions: {
      column: {
        borderRadius: 0,
        pointWidth: 25,
        groupPadding: 0.3,
        pointPadding: 0.1,
      },
      series: {
        borderRadius: 0,
      },
    },
    series: [
      {
        name: "Số lượng tin tuyển dụng",
        type: "column",
        data: jobAds,
        color: "#c90a1f",
        yAxis: 0,
      },
      {
        name: "Mức lương trung bình",
        type: "spline",
        data: avgSalaries, // numeric for proper scaling
        color: "#007BC3",
        yAxis: 1,
        marker: {
          lineWidth: 1,
          lineColor: "#007BC3",
          fillColor: "#007BC3",
        },
      },
    ],
    credits: { enabled: false },
  };
});
</script>

<style lang="scss" scoped></style>
