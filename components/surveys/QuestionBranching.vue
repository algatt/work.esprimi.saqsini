<template>
  <div class="flex flex-col mt-2">
    <template v-if="conditions.length !== 0">
      <h6 class="mb-1">Existing Branching</h6>
      <div
        v-for="(condition, index) in conditions"
        :key="index"
        class="flex items-center justify-between px-3 py-2 border border-gray-100 my-1 rounded w-full md:w-10/12 shadow"
      >
        <div class="flex flex-grow flex-col">
          <p>{{ condition.questionText }}</p>
          <p>{{ condition.answer }}</p>
        </div>
        <div class="flex items-center">
          <button class="btn-link-rounded" @click="deleteCondition(index)">
            <i class="far fa-trash-alt fa-sm fa-fw"></i>
          </button>
        </div>
      </div>
    </template>

    <h6 class="mt-2 mb-3">New Branching</h6>
    <toggle-switch
      class="mb-3"
      :checked="isDemographicBranching"
      :change-colour="false"
      @clicked="isDemographicBranching = $event"
    >
      <template v-slot:leftLabel>Question</template>
      <template v-slot:rightLabel>Demographics</template>
    </toggle-switch>
    <div
      v-if="!isDemographicBranching"
      class="flex items-center w-full justify-between space-x-3"
    >
      <select
        v-model="selectedQuestion"
        class="input select w-6/12"
        @change="updateSelectAnswers"
      >
        <option
          v-for="previous in previousQuestionsText"
          :key="previous.code"
          :value="previous.code"
        >
          {{ previous.text }}
        </option>
      </select>
      <select v-model="selectedAnswer" class="input select w-6/12">
        <option
          v-for="(answer, index) in previousQuestionAnswers"
          :key="answer + index"
          :value="answer.value"
        >
          {{ answer.value }}
        </option>
      </select>
      <button class="btn-round-primary" @click="addCondition">
        <i class="fas fa-check fa-sm fa-fw"></i>
      </button>
    </div>
    <template v-else>demogs..</template>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'

export default {
  name: 'QuestionBranching',
  components: { ToggleSwitch },
  data() {
    return {
      selectedQuestion: null,
      selectedAnswer: null,
      isDemographicBranching: false,
      conditions: [],
    }
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    questions() {
      return JSON.parse(
        JSON.stringify(this.$store.getters.getItems('questions'))
      ).sort((a, b) => {
        return Number(a.ordinalPosition) > Number(b.ordinalPosition) ? 1 : -1
      })
    },
    previousQuestions() {
      return this.questions.filter((el) => {
        return (
          el.ordinalPosition < this.question.ordinalPosition &&
          !el.flags.includes('SECTION') &&
          el.options.length !== 0
        )
      })
    },
    previousQuestionsText() {
      return this.previousQuestions.map((el) => {
        const text = this.getQuestionText(el)
        return { code: el.code, text: text.name + ' - ' + text.text }
      })
    },
    previousQuestionAnswers() {
      const question = this.questions.find((el) => {
        return el.code === this.selectedQuestion
      })
      return question.options.map((el) => {
        return { value: el.value }
      })
    },
  },
  created() {
    this.selectedQuestion = this.previousQuestionsText[0].code
    this.selectedAnswer = this.previousQuestionAnswers[0].value
  },
  methods: {
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
    updateSelectAnswers() {
      this.selectedAnswer = this.previousQuestionAnswers[0].value
    },
    addCondition() {
      const questionText = this.getQuestionText(
        this.questions.find((el) => {
          return el.code === this.selectedQuestion
        })
      ).text
      this.conditions.push({
        questionCode: this.selectedQuestion,
        questionText,
        answer: this.selectedAnswer,
      })
    },
    deleteCondition(index) {
      this.conditions.splice(index, 1)
    },
  },
}
</script>

<style scoped></style>
