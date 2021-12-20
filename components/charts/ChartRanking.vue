<template>
  <div
    class="flex flex-col items-center w-full"
    :style="`height: ${chartData.height}px`"
  >
    <div class="flex space-x-2 items-center">
      <span>Base</span
      ><span class="font-semibold bg-gray-100 rounded px-1 py-0.5">
        {{
          chartData.series[0].data.reduce((acc, val) => {
            return (acc += val)
          })
        }}</span
      >
    </div>
    <apexchart
      :options="chartData.chartOptions"
      :series="chartData.series"
      height="100%"
      class="w-full"
    ></apexchart>
  </div>
</template>

<script>
import { getDataAggregateRanking } from '~/services/question-helpers'
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartRanking',

  props: {
    data: {
      type: Object,
      required: true,
    },
    selectedList: {
      type: Array,
      required: true,
    },
  },

  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    rankingData() {
      const selectedList = this.selectedList.map((el) => {
        return el.code
      })
      return getDataAggregateRanking(this.legendData, selectedList, this.data)
    },
    chartData() {
      return {
        series: this.rankingData.series,
        chartOptions: {
          colors: REPORT_CHART_SETTINGS.colors,
          chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: this.rankingData.categories,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
        height:
          this.rankingData.categories.length < 6
            ? 300
            : this.rankingData.categories.length *
              REPORT_CHART_SETTINGS.horizontalBar.barHeight,
      }
    },
  },
}
</script>

<style scoped></style>
