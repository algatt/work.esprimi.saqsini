<template>
  <div class="mt-3">
    <div class="my-5 flex flex-col xl:flex-row">
      <div class="w-auto xl:mr-10">
        <select-base v-model="typeOfResponses">
          Type of Responses
          <template v-slot:options>
            <option value="all">All Types</option>
            <option value="kiosk">Kiosk</option>
            <option value="invites">Invites</option>
          </template>
        </select-base>
      </div>
      <div class="w-auto mt-2 xl:mt-0">
        <select-base v-model="isComplete">
          Status
          <template v-slot:options>
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="incomplete">Incomplete</option>
          </template>
        </select-base>
      </div>
    </div>
    <div
      v-for="invite in invitations"
      :key="invite.token"
      class="p-4 flex flex-col justify-between border border-gray-200 cursor-pointer"
      :class="
        viewResponsesInvitee.token === invite.token
          ? 'bg-gray-100'
          : 'hover:bg-gray-100'
      "
      @click="toggleViewResponses(invite)"
    >
      <div class="flex flex-wrap">
        <div class="flex w-full xl:flex-1 items-center">
          <span v-if="invite.flags.includes('KIOSK')" class="mr-3"
            >Kiosk Response</span
          ><span v-else class="mr-3">Invitee Response</span>
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
        </div>
        <div>
          {{ invite.lastAccessed.substring(0, 16) }}
        </div>
      </div>
      <div
        v-if="viewResponsesInvitee.token === invite.token"
        class="bg-gray-50 my-2 rounded border-2 border-gray-200"
      >
        <div
          v-for="(response, index) in parsedResponses"
          :key="index"
          class="flex flex-col"
        >
          <div
            v-if="getQuestionType(response.question.flags).text === 'Page'"
            class="bg-gray-100 py-2 px-2 border-b border-gray-200"
            :class="index !== 0 ? 'border-t' : null"
          >
            <span class="font-semibold">{{ response.question.name }}</span>
          </div>
          <div v-else class="flex flex-wrap">
            <div class="w-full md:w-6/12 pl-5 py-2">
              <badge-base bg-colour="blue">{{
                response.question.questionNumber
              }}</badge-base>
              <span>{{ response.question.name }}</span>
              <badge-base bg-colour="gray">{{
                getQuestionType(response.question.flags).text
              }}</badge-base>
            </div>
            <div class="w-full md:w-6/12 py-2 px-5 xl:px-0 space-x-2">
              <badge-base
                v-for="(answer, answerIndex) in response.answers"
                :key="answerIndex"
                class="mt-2 xl:my-0"
                >{{ answer }}</badge-base
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { QUESTION_TYPES } from '~/helpers/constants'
import BadgeBase from '~/components/elements/BadgeBase'
import SelectBase from '~/components/elements/SelectBase'

export default {
  name: 'InvidualDetailsVue',
  components: { SelectBase, BadgeBase },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      viewResponsesInvitee: {},
      typeOfResponses: 'all',
      isComplete: 'all',
    }
  },

  computed: {
    invitations() {
      let temp = JSON.parse(JSON.stringify(this.data.invitations))
      if (this.typeOfResponses === 'kiosk')
        temp = temp.filter((el) => {
          return el.flags.includes('KIOSK')
        })
      else if (this.typeOfResponses === 'invites')
        temp = temp.filter((el) => {
          return !el.flags.includes('KIOSK')
        })

      if (this.isComplete === 'completed')
        temp = temp.filter((el) => {
          return el.flags.includes('SUBMITTED')
        })
      else if (this.isComplete === 'incomplete')
        temp = temp.filter((el) => {
          return !el.flags.includes('SUBMITTED')
        })

      return temp.sort((a, b) => {
        return a.lastModified < b.lastModified ? 1 : -1
      })
    },
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
