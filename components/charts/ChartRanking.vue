<template>
  <div class="flex flex-col items-center">
    <bar-chart :chart-data="datasets" :options="options"></bar-chart>
  </div>
</template>

<script>
import { getDataAggregateRanking } from '~/helpers/chartHelpers'
import BarChart from '~/components/charts/BarChart'

export default {
  name: 'ChartRanking',
  components: { BarChart },
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
      options: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: true,
        },

        scales: {
          xAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
              stacked: true,
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true,
                precision: 0,
              },
            },
          ],
        },
      },
    }
  },
  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    datasets() {
      const selectedList = this.selectedList.map((el) => {
        return el.code
      })

      return getDataAggregateRanking(this.legendData, selectedList, this.data)
    },
  },
}
</script>

<style scoped></style>
