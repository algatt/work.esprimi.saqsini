<template>
  <g-chart
    type="ColumnChart"
    :data="chartData"
    :options="getOptions(question)"
    class="w-full"
    style="min-height: 400px"
  ></g-chart>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  name: 'QuestionChartElement',
  components: { GChart },
  props: {
    chartData: {
      required: true,
      type: Array,
    },
    question: {
      required: true,
      type: Object,
    },
  },
  methods: {
    getOptions(question) {
      return {
        title: question.text,
        vAxis: {
          format: '###',
          viewWindow: { min: 0 },
          gridlines: { color: 'transparent' },
        },
        hAxis: {
          format: '###',
          viewWindow: { min: 0 },
          gridlines: { color: 'transparent' },
        },
        isStacked: this.chartData.length > 2,
      }
    },
  },
}
</script>

<style scoped></style>
