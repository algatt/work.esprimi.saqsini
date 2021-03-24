<template>
  <div class="flex flex-col">
    <bar-chart :chart-data="datasets" :options="options"></bar-chart>
  </div>
</template>

<script>
import BarChart from '~/components/charts/BarChart'
import {
  getDataAggregateByDemographic,
  getDataAggregate,
} from '~/helpers/chartHelpers'

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
    selectedDemographic: {
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

      if (this.selectedDemographic) {
        return getDataAggregateByDemographic(
          selectedList,
          this.selectedDemographic,
          this.data
        )
      } else {
        return getDataAggregate(this.legendData, selectedList, this.data)
      }
    },
  },
  watch: {
    selectedDemographic(value) {
      if (value) {
        this.options.scales.xAxes[0].stacked = true
        this.options.scales.yAxes[0].stacked = true
        this.options.legend.display = true
      } else {
        this.options.scales.xAxes[0].stacked = false
        this.options.scales.yAxes[0].stacked = false
        this.options.legend.display = false
      }
    },
  },
}
</script>
