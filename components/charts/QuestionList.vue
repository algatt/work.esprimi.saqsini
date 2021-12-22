<template>
  <div class="flex flex-col space-y-5 px-1 lg:px-10">
    <template>
      <div
        v-for="item in processedQuestions"
        :key="item.code"
        class="flex flex-col"
      >
        <div v-if="getQuestionTypeText(item.flags) === 'Page'" class="flex">
          <span class="text-lg font-bold">{{ item.name }}</span>
        </div>
        <div
          v-else
          class="flex flex-col items-start border-2 border-gray-200 rounded p-5"
        >
          <div class="flex space-x-3 mb-2">
            <div class="flex flex-col items-start">
              <span class="font-semibold px-2 py-0.5 bg-gray-100 rounded">{{
                item.questionNumber
              }}</span>
            </div>
            <div class="flex flex-col items-start">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-lg">{{ item.name }}</span>
                <span class="text-sm bg-gray-100 rounded px-1 py-0.5">{{
                  getQuestionTypeText(item.flags)
                }}</span>
              </div>
              <span class="italic">{{ getQuestionTitle(item) }}</span>
            </div>
          </div>

          <question-element
            :question="item"
            :responses="getResponses(item)"
          ></question-element>
        </div></div
    ></template>
  </div>
</template>

<script>
import {
  convertQuestionFromApiToForm,
  getQuestionTypeText,
} from '~/services/question-helpers'
import QuestionElement from '~/components/charts/QuestionElement'

export default {
  name: 'ChartsQuestionList',
  components: { QuestionElement },
  data() {
    return {
      getQuestionTypeText,
    }
  },
  computed: {
    surveyData() {
      return JSON.parse(JSON.stringify(this.$store.state.surveys.surveyData))
    },
    processedQuestions() {
      return JSON.parse(JSON.stringify(this.surveyData)).questions.sort(
        (a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        }
      )
    },
  },

  methods: {
    getResponses(question) {
      return this.surveyData.responses
        .filter((response) => {
          return response.questionCode === question.code
        })
        .map((response) => {
          return {
            questionCode: response.questionCode,
            token: response.token,
            option: response.option,
            value: response.value,
          }
        })
    },
    getQuestionTitle(question) {
      return convertQuestionFromApiToForm(question).text
    },
  },
}
</script>
