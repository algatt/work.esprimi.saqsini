<template>
  <div class="flex flex-col items-center">
    <bar-chart :chart-data="datasets"></bar-chart>
  </div>
</template>

<script>
import BarChart from '~/components/charts/BarChart'
import { getDataAggregate } from '~/services/question-helpers'

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
