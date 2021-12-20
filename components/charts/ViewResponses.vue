<template>
  <div>
    <div v-for="(response, index) in parsedResponses" :key="index">
      <div v-if="response.question.flags.includes('SECTION')" class="mb-4">
        <h6>{{ response.question.name }}</h6>
      </div>
      <div v-else class="flex flex-col ml-4 mb-4">
        <div class="flex flex-wrap space-x-2">
          <p
            class="font-bold"
            :class="color ? `text-${color}-600` : `text-primary`"
          >
            {{ response.question.questionNumber }}
          </p>
          <p>{{ response.question.name }}</p>
          <l-badge>{{ getQuestionTypeText(response.question.flags) }}</l-badge>
        </div>
        <div class="flex flex-wrap ml-8 mt-2 italic">
          <span
            v-for="(answer, answerIndex) in response.answers"
            :key="answerIndex"
            >{{ answer
            }}<span
              v-if="
                response.answers.length > 1 &&
                answerIndex !== response.answers.length - 1
              "
              >,&nbsp;
            </span></span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestionTypeText } from '~/services/question-helpers'

export default {
  name: 'ViewResponses',
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      getQuestionTypeText,
    }
  },
  computed: {
    surveyData() {
      return this.$store.state.surveys.surveyData
    },
    responsesForInvite() {
      if (!this.dataItem?.token) return []
      const responses = this.surveyData.responses.filter((el) => {
        return el.token === this.dataItem.token
      })

      let data = []
      responses.forEach((response) => {
        const question = this.surveyData.questions.find((el) => {
          return response.questionCode === el.code
        })
        const obj = response
        obj.questionName = question.name
        obj.questionPosition = question.ordinalPosition
        obj.questionNumber = question.questionNumber
        obj.questionFlags = question.flags
        obj.questionCode = question.code
        data.push(obj)
      })
      data = data.sort((a, b) => {
        return a.questionPosition > b.questionPosition ? 1 : -1
      })
      return data
    },
    parsedResponses() {
      const data = {}
      this.surveyData.questions.forEach((el) => {
        const questionCode = el.code
        if (!data[questionCode])
          data[questionCode] = { question: el, answers: [] }

        const question = this.responsesForInvite.filter((response) => {
          return response.questionCode === questionCode
        })

        if (
          el.flags.includes('MULTIPLE_CHOICE') ||
          el.flags.includes('LIKERT') ||
          el.flags.includes('DROPDOWN')
        ) {
          data[questionCode].answers = question.map((value) => {
            return value.value
          })
        } else if (
          el.flags.includes('RANKING') ||
          el.flags.includes('RADIO_GRID')
        ) {
          data[questionCode].answers = question
            .map((value) => {
              return { option: value.option, value: value.value }
            })
            .sort((a, b) => {
              return a.value > b.value ? 1 : -1
            })
            .map((value) => {
              return `${value.option ?? ''}(${value.value})`
            })
        } else if (el.flags.includes('TYPE_IN')) {
          data[questionCode].answers = question.map((value) => {
            return value.value
          })
        }
      })

      let returnData = []
      Object.keys(data).forEach((el) => {
        returnData.push(data[el])
      })
      returnData = returnData.sort((a, b) => {
        return a.question.ordinalPosition > b.question.ordinalPosition ? 1 : -1
      })
      return returnData
    },
  },
}
</script>

<style scoped></style>
