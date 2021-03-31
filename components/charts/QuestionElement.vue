<template>
  <div v-if="!loading" class="flex flex-wrap w-full">
    <template v-if="data.responses.length !== 0">
      <div class="w-full md:w-3/12 flex flex-col">
        <multi-select
          v-if="
            data.availableAnswers.length !== 0 &&
            !data.question.type.flag.includes('TYPE_IN')
          "
          :original-list="data.availableAnswers"
          :selected-list="selectedList"
          display-field="text"
          @selectedItems="updateChart"
        >
          <template v-slot:title>Available answers</template>
        </multi-select>
      </div>
      <div class="w-full md:w-9/12 flex flex-col p-5">
        <chart-multiple-choice
          v-if="
            data.question.type.flag === 'MULTIPLE_CHOICE' ||
            data.question.type.flag === 'DROPDOWN'
          "
          :data="data"
          :selected-list="selectedList"
        ></chart-multiple-choice>
        <chart-likert
          v-else-if="data.question.type.flag === 'LIKERT'"
          :data="data"
          :selected-list="selectedList"
        ></chart-likert>
        <chart-ranking
          v-else-if="data.question.type.flag === 'RANKING'"
          :data="data"
          :selected-list="selectedList"
        ></chart-ranking>
        <chart-type-in
          v-else-if="data.question.type.flag === 'TYPE_IN'"
          :data="data"
          :selected-list="selectedList"
        ></chart-type-in>
        <chart-radio-grid
          v-else-if="data.question.type.flag === 'RADIO_GRID'"
          :data="data"
          :selected-list="selectedList"
        ></chart-radio-grid>
      </div>
    </template>
    <div v-else class="flex justify-center w-full pt-5">No Responses</div>
  </div>
</template>

<script>
import MultiSelect from '~/components/layouts/MultiSelect'
import ChartMultipleChoice from '~/components/charts/ChartMultipleChoice'
import ChartLikert from '~/components/charts/ChartLikert'
import ChartRanking from '~/components/charts/ChartRanking'
import ChartTypeIn from '~/components/charts/ChartTypeIn'
import ChartRadioGrid from '~/components/charts/ChartRadioGrid'

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
      this.$forceUpdate()
    },
    updateChartRanking(newList) {
      this.selectedListForRanking = newList
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped></style>
