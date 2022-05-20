<template>
  <div v-if="!loading" class="flex flex-wrap w-full">
    <template v-if="data.responses.length !== 0">
      <div class="w-full md:w-3/12 flex flex-col print:hidden">
        <multi-select
          v-if="
            data.availableAnswers.length !== 0 &&
            data.question.type !== 'TYPE_IN'
          "
          :original-list="data.availableAnswers"
          :selected-list="selectedList"
          display-field="text"
          @selectedItems="updateChart"
        >
          <template v-slot:title>Available answers</template>
        </multi-select>
      </div>
      <div
        :id="`question_graph_${data.question.code}`"
        class="w-full md:w-9/12 flex flex-col p-5"
      >
        <component
          :is="CHART_TYPE_COMPONENT[data.question.type]"
          :data="data"
          :selected-list="selectedList"
        ></component>
      </div>
    </template>
    <div v-else class="flex justify-center w-full pt-5">No Responses</div>
  </div>
</template>

<script>
import MultiSelect from '@/components/elements/MultiSelect'
import { CHART_TYPE_COMPONENT } from '@/assets/settings/charts-settings'
import ChartMultipleChoice from '@/components/charts/ChartMultipleChoice'
import ChartLikert from '@/components/charts/ChartLikert'
import ChartRanking from '@/components/charts/ChartRanking'
import ChartTypeIn from '@/components/charts/ChartTypeIn'
import ChartRadioGrid from '@/components/charts/ChartRadioGrid'

export default {
  name: 'QuestionElementVue',
  components: {
    ChartRanking,
    ChartLikert,
    MultiSelect,
    ChartMultipleChoice,
    ChartTypeIn,
    ChartRadioGrid,
  },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      selectedList: [],
      loading: true,
      CHART_TYPE_COMPONENT,
    }
  },

  mounted() {
    this.selectedList = this.data.availableAnswers
    this.loading = false
  },
  methods: {
    updateChart(newSelectedList) {
      this.selectedList = newSelectedList.sort((a, b) => {
        return a.code > b.code ? 1 : -1
      })
    },
    updateChartRanking(newList) {
      this.selectedListForRanking = newList
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped></style>
