<template>
  <div class="flex flex-col items-center">
    <bar-chart :chart-data="datasets"></bar-chart>
  </div>
</template>

<script>
import { getDataAggregateRanking } from '~/services/question-helpers'
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
