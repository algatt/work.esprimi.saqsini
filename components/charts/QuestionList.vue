<template>
  <div v-if="!loading">
    <div
      v-for="item in processedQuestions"
      :key="item.question.code"
      class="flex flex-col mb-16"
    >
      <div class="flex justify-center items-center w-full space-x-2">
        <h6>{{ item.question.name }}</h6>
        <p class="bg-gray-100 rounded-xl px-2 py-0.5 text-gray-700">
          {{ item.question.questionNumber }}
        </p>

        <span class="text-gray-700 font-semibold"
          >{{ item.question.type.text }}
        </span>
      </div>
      <div class="flex justify-center items-center w-full space-x-2 my-2">
        {{ getQuestionTitle(item.question) }}
      </div>
      <div class="flex flex-wrap w-full">
        <question-element
          :key="item.question.questionCode"
          :data="item"
        ></question-element>
      </div>
    </div>
  </div>

  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import { QUESTION_TYPES } from '~/helpers/constants'
import QuestionElement from '~/components/charts/QuestionElement'
import { getDifferentAnswers } from '~/helpers/chartHelpers'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'QuestionList',
  components: { QuestionElement, Spinner },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      workingData: null,
      processedQuestions: [],
    }
  },
  mounted() {
    this.workingData = JSON.parse(JSON.stringify(this.data))

    let questions = JSON.parse(JSON.stringify(this.data.questions))
    questions = questions
      .sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
      .filter((el) => {
        return !el.flags.includes('SECTION')
      })

    questions.forEach((el) => {
      this.processedQuestions.push(this.processQuestion(el))
    })

    this.loading = false
  },
  methods: {
    getQuestionTitle(question) {
      return parseQuestionToForm(question).text
    },
    getQuestionType(question) {
      let result = ''
      question.flags.forEach((el) => {
        if (Object.keys(QUESTION_TYPES).includes(el))
          result = QUESTION_TYPES[el]
      })
      return result
    },
    processQuestion(question) {
      const data = {}
      const surveyYear = this.workingData.survey.referenceDate.substring(0, 4)
      const responses = this.workingData.responses.filter((el) => {
        return el.questionCode === question.code
      })
      const availableInvitees = responses.map((el) => {
        return el.token
      })
      const invitees = this.workingData.invitations.filter((el) => {
        return availableInvitees.includes(el.token)
      })

      data.surveyYear = surveyYear
      data.question = question
      data.question.type = this.getQuestionType(question)
      data.responses = responses
      data.invitees = invitees
      data.availableAnswers = this.getDifferentAnswers(question, responses)
      data.demographicLabels = this.getDifferentDemographicLabels(invitees)
      data.demographics = this.getDifferentDemographicValues(
        data.demographicLabels,
        invitees
      )

      return data
    },
    getDifferentAnswers(question, responses) {
      return getDifferentAnswers(question, responses)
    },
    getDifferentDemographicLabels(invitees) {
      let data = []
      invitees.forEach((invitee) => {
        Object.keys(invitee).forEach((el) => {
          if (!data.includes(el) && el !== 'code') data.push(el)
        })
      })
      data = data.sort((a, b) => {
        return a > b ? 1 : -1
      })
      return data
    },
    getDifferentDemographicValues(labels, invitees) {
      const data = {}
      labels.forEach((label) => {
        data[label] = []
      })
      invitees.forEach((invitee) => {
        labels.forEach((label) => {
          if (invitee[label] && !data[label].includes(invitee[label]))
            data[label].push(invitee[label])
        })
      })

      Object.keys(data).forEach((el) => {
        data[el] = data[el].sort((a, b) => {
          return a > b ? 1 : -1
        })
      })

      return data
    },
  },
}
</script>

<style scoped></style>
