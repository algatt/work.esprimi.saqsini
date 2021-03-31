<template>
  <div class="flex flex-col">
    <bar-chart :chart-data="datasets" :options="options"></bar-chart>
  </div>
</template>

<script>
import BarChart from '~/components/charts/BarChart'
import { getDataAggregate } from '~/helpers/chartHelpers'

export default {
  name: 'ChartMultipleChoice',
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
        maintainAspectRatio: false,
        legend: {
          display: false,
        },

        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
              },
            },
          ],
          yAxes: [
            {
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

      return getDataAggregate(this.legendData, selectedList, this.data)
    },
  },
}
</script>
