<template>
  <div
    class="flex flex-col items-center"
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
import { getDataAggregate } from '~/services/question-helpers'
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartMultipleChoice',
  components: {},
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
  data() {
    return {
      REPORT_CHART_SETTINGS,
    }
  },
  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    multipleData() {
      const selectedList = this.selectedList.map((el) => {
        return el.code
      })

      return getDataAggregate(this.legendData, selectedList, this.data)
    },
    chartData() {
      return {
        series: [{ name: 'Responses', data: this.multipleData.data }],
        chartOptions: {
          colors: REPORT_CHART_SETTINGS.colors,
          chart: {
            type: 'bar',
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          xaxis: {
            categories: this.multipleData.labels,
          },
        },
        height:
          this.multipleData.labels.length < 4
            ? 175
            : this.multipleData.labels.length *
              REPORT_CHART_SETTINGS.horizontalBar.barHeight,
      }
    },
  },
}
</script>
