<template>
  <div class="flex flex-wrap w-full">
    <div class="w-full lg:w-4/12 px-3">
      <div class="flex space-x-3 mb-3">
        <div
          v-if="selectedList.length !== optionsAndAnswers.length"
          class="flex items-center space-x-2 border-2 border-gray-200 p-1 rounded"
        >
          <span class="font-semibold">Filtered Base</span>
          <span
            class="font-semibold bg-blue-600 text-white rounded px-1 py-0"
            >{{ filteredBaseCount }}</span
          >
        </div>
        <div
          class="flex items-center space-x-2 border-2 border-gray-200 p-1 rounded"
        >
          <span class="font-semibold">Base</span>
          <span
            class="font-semibold bg-blue-600 text-white rounded px-1 py-0"
            >{{ baseCount }}</span
          >
        </div>
      </div>
      <multi-select
        :original-list="optionsAndAnswers"
        display-field="text"
        :selected-list="selectedList"
        key-field="value"
        @selectedItems="updateSelectedItems"
        ><template #title>Select Values</template></multi-select
      >
    </div>
    <div class="w-full lg:w-8/12 px-3">
      <component
        :is="chartTypeComponent"
        :elements="processedSelectedList"
        :responses="filteredResponses"
      ></component>
    </div>
  </div>
</template>

<script>
import ChartMultipleChoice from '@/components/charts/ChartMultipleChoice'
import ChartLikert from '@/components/charts/ChartLikert'
import ChartRanking from '@/components/charts/ChartRanking'
import ChartTypeIn from '@/components/charts/ChartTypeIn'
import ChartRadioGrid from '@/components/charts/ChartRadioGrid'
import {
  getQuestionOptionsAndOtherAnswers,
  getQuestionType,
} from '@/services/question-helpers'
import MultiSelect from '@/components/elements/MultiSelect'
import { CHART_TYPE_COMPONENT } from '@/assets/settings/charts-settings'

export default {
  name: 'QuestionElement',
  components: {
    MultiSelect,
    ChartRanking,
    ChartLikert,
    ChartMultipleChoice,
    ChartRadioGrid,
    ChartTypeIn,
  },
  props: {
    question: {
      required: true,
      type: Object,
    },
    responses: {
      type: Array,
      default: () => {
        return []
      },
    },
  },
  data() {
    return {
      getQuestionOptionsAndOtherAnswers,
      getQuestionType,
      CHART_TYPE_COMPONENT,
      selectedList: [],
    }
  },
  computed: {
    isRadioQuestion() {
      return getQuestionType(this.question) === 'RADIO_GRID'
    },
    isRankingQuestion() {
      return getQuestionType(this.question) === 'RANKING'
    },
    processedSelectedList() {
      const x = JSON.parse(JSON.stringify(this.selectedList))
      if (this.isRadioQuestion)
        x.push(
          ...this.getQuestionOptionsAndOtherAnswers(
            this.question,
            this.responses
          ).filter((el) => {
            return el.flags && el.flags.includes('COLUMN')
          })
        )
      return x
    },
    baseOptionsAndAnswers() {
      return this.getQuestionOptionsAndOtherAnswers(
        this.question,
        this.responses
      )
    },
    optionsAndAnswers() {
      let x = this.baseOptionsAndAnswers
      if (this.isRadioQuestion)
        x = x.filter((el) => {
          return el.flags && el.flags.includes('ROW')
        })
      return x
    },

    filteredResponses() {
      const resp = JSON.parse(JSON.stringify(this.responses))

      const availableValues = this.processedSelectedList.map((el) => {
        return el.value
      })

      return resp.filter((el) => {
        if (this.isRankingQuestion) {
          const regex = /(\(\d*\))$/
          return availableValues.includes(el.value.replace(regex, '').trim())
        } else return availableValues.includes(el.value)
      })
    },
    baseCount() {
      return new Set(
        this.responses.map((el) => {
          return el.token
        })
      ).size
    },
    filteredBaseCount() {
      return new Set(
        this.filteredResponses.map((el) => {
          return el.token
        })
      ).size
    },
    chartTypeComponent() {
      return CHART_TYPE_COMPONENT[getQuestionType(this.question)]
    },
  },

  beforeMount() {
    this.selectedList = this.optionsAndAnswers
    // this.selectedList = this.data.availableAnswers
    // this.loading = false
  },
  methods: {
    updateSelectedItems(list) {
      this.selectedList = list
    },
  },
}
</script>

<style scoped></style>
