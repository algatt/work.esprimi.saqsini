<template>
  <div class="flex flex-col" :style="`min-height: ${dataChart.height}px`">
    <apexchart
      :options="dataChart.chartOptions"
      :series="dataChart.series"
      height="100%"
      class="w-full"
    ></apexchart>
  </div>
</template>

<script>
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartMultipleChoice',
  components: {},
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
  data() {
    return {
      REPORT_CHART_SETTINGS,
    }
  },
  computed: {
    dataChart() {
      const categories = this.elements.map((el) => {
        return el.value
      })

      const data = []
      for (const el of categories) {
        const foundItems = this.responses.filter((res) => {
          return res.value === el
        }).length
        data.push(foundItems)
      }

      let height =
        categories.length * REPORT_CHART_SETTINGS.horizontalBar.barHeight

      height =
        height < REPORT_CHART_SETTINGS.minQuestionHeight
          ? REPORT_CHART_SETTINGS.minQuestionHeight
          : height

      this.$emit('emitHeight', height)

      return {
        series: [{ name: 'Responses', data }],
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
            categories,
          },
        },
        height,
      }
    },
  },
}
</script>
