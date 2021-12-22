<template>
  <div>
    <div class="flex flex-col" :style="`min-height: ${dataChart.height}px`">
      <apexchart
        :options="dataChart.chartOptions"
        :series="dataChart.series"
        height="100%"
        class="w-full"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartRanking',

  props: {
    elements: {
      type: Array,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    },
  },

  computed: {
    dataChart() {
      const categories = this.elements.map((el) => {
        return el.value
      })

      const regex = /(\(\d*\))$/
      const allValues = new Set(
        this.responses.map((el) => {
          return el.value.match(regex)[0].replace('(', '').replace(')', '')
        })
      ).size

      const series = []

      for (let i = 1; i <= allValues; i++) {
        const data = []
        categories.forEach((category) => {
          const searchString = `${category} (${i})`
          data.push(
            this.responses.filter((el) => {
              return el.value === searchString
            }).length
          )
        })

        series.push({ name: i, data })
      }

      let height =
        categories.length * REPORT_CHART_SETTINGS.horizontalBar.barHeight

      height =
        height < REPORT_CHART_SETTINGS.minQuestionHeight
          ? REPORT_CHART_SETTINGS.minQuestionHeight
          : height

      return {
        series,
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
            categories,
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
        },
        height,
      }
    },
  },
}
</script>

<style scoped></style>
