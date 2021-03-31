<template>
  <div>
    <div
      v-for="invite in data.invitations"
      :key="invite.token"
      class="rounded p-4 my-5 flex flex-col justify-between border border-gray-100 shadow cursor-pointer"
      :class="
        viewResponsesInvitee.token === invite.token ? null : 'hover:bg-gray-100'
      "
      @click="toggleViewResponses(invite)"
    >
      <div class="flex">
        <div class="flex flex-1 items-center">
          <span v-if="invite.flags.includes('KIOSK')" class="mr-3"
            >Kiosk Response</span
          >
          <span
            v-if="invite.flags.includes('SUBMITTED')"
            class="bg-green-100 text-green-700 text-sm font-semibold rounded px-1 py-0.5 border border-green-200 mr-3"
            >finished</span
          >
          <span
            v-else
            class="bg-red-100 text-red-700 text-sm font-semibold rounded px-1 py-0.5 border border-red-200 mr-3"
            >incomplete</span
          >
          <span v-if="invite.flags.includes('SUBMITTED')">
            {{ invite.lastAccessed.substring(0, 10) }}
          </span>
        </div>
        <div class="w-32 btn-link">View Responses</div>
      </div>
      <div v-if="viewResponsesInvitee.token === invite.token">
        <div
          v-for="(response, index) in parsedResponses"
          :key="index"
          class="flex flex-wrap items-center justify-between pb-3"
        >
          <div
            v-if="getQuestionType(response.question.flags).text === 'Page'"
            class="mt-5 mb-1"
          >
            <span class="font-semibold">{{ response.question.name }}</span>
          </div>
          <div v-else class="w-full md:w-6/12 pl-5">
            <span>{{ response.question.name }}</span
            ><span
              class="text-sm text-white bg-primary rounded px-1 py-0.5 mx-2"
              >{{ response.question.questionNumber }}</span
            >
            <span
              class="text-sm text-gray-700 bg-gray-100 rounded px-1 py-0.5"
              >{{ getQuestionType(response.question.flags).text }}</span
            >
          </div>
          <div class="w-full md:w-6/12 pl-10 md:pl-0 pt-3 md:pt-0">
            <span
              v-for="(answer, index) in response.answers"
              :key="index"
              class="mr-3 px-2 py-1 bg-gray-100 rounded text-gray-700 border border-gray-200"
              >{{ answer }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QUESTION_TYPES } from '~/helpers/constants'

export default {
  name: 'InvidualDetailsVue',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewResponsesInvitee: {},
    }
  },
  computed: {
    responsesForInvite() {
      if (!this.viewResponsesInvitee?.token) return []
      const responses = this.data.responses.filter((el) => {
        return el.token === this.viewResponsesInvitee.token
      })
      let data = []
      responses.forEach((response) => {
        const question = this.data.questions.find((el) => {
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
      this.data.questions.forEach((el) => {
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
              return `${value.option} (${value.value})`
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
  methods: {
    toggleViewResponses(invite) {
      if (invite.token === this.viewResponsesInvitee?.token) {
        this.viewResponsesInvitee = {}
      } else this.viewResponsesInvitee = invite
    },
    getQuestionType(flags) {
      let result = ''
      flags.forEach((el) => {
        if (Object.keys(QUESTION_TYPES).includes(el))
          result = QUESTION_TYPES[el]
      })
      return result
    },
  },
}
</script>

<style scoped></style>
