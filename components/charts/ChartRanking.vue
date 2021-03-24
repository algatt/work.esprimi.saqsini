<template>
  <div class="flex flex-col">
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
    selectedDemographic: {
      required: true,
    },
  },
  data() {
    return {
      options: {
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

      return getDataAggregateRanking(
        this.legendData,
        selectedList,
        this.data,
        this.selectedDemographic
      )
    },
  },
  watch: {
    selectedDemographic(value) {
      if (value) {
        // this.options.scales.xAxes[0].stacked = true
        // this.options.scales.yAxes[0].stacked = true
        this.options.legend.display = true
      } else {
        // this.options.scales.xAxes[0].stacked = false
        // this.options.scales.yAxes[0].stacked = false
        this.options.legend.display = false
      }
    },
  },
}
</script>

<style scoped></style>
