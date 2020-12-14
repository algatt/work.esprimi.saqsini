<template>
  <div class="flex flex-col mt-2">
    <div v-if="conditions.length !== 0" class="mb-3">
      <h6 class="mb-1">Existing Branching</h6>
      <toggle-switch
        class="mb-3"
        :checked="allMustBeMet"
        :change-colour="false"
        @clicked="allMustBeMet = $event"
      >
        <template v-slot:leftLabel>Match any</template>
        <template v-slot:rightLabel>Match all</template>
      </toggle-switch>
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
    </div>

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
      class="flex flex-wrap items-center w-full"
    >
      <div class="w-full md:w-6/12 flex items-center pr-2">
        <select
          v-model="selectedQuestion"
          class="input select w-full"
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
      </div>
      <div class="flex items-center w-10/12 md:w-5/12 pr-2 mt-2 md:mt-0">
        <select v-model="selectedAnswer" class="input select w-full">
          <option
            v-for="(answer, index) in previousQuestionAnswers"
            :key="answer + index"
            :value="answer.value"
          >
            {{ answer.value }}
          </option>
        </select>
      </div>
      <div
        class="flex w-2/12 md:w-1/12 justify-center items-center mt-2 md:mt-0"
      >
        <button
          class="btn-link-rounded-primary"
          :disabled="checkIfDisabled()"
          @click="addCondition"
        >
          <i class="fas fa-check fa-sm fa-fw"></i>
        </button>
      </div>
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
  props: {
    existingConditions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedQuestion: null,
      selectedAnswer: null,
      isDemographicBranching: false,
      allMustBeMet: false,
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
      if (!question) return null
      return question.options.map((el) => {
        return { value: el.value }
      })
    },
  },
  watch: {
    conditions(ev) {
      this.$emit('conditions', { rules: ev, allMustBeMet: this.allMustBeMet })
    },
    allMustBeMet(ev) {
      this.$emit('conditions', {
        rules: this.conditions,
        allMustBeMet: ev,
      })
    },
  },
  created() {
    if (this.previousQuestionsText && this.previousQuestionsText.length > 0) {
      this.selectedQuestion = this.previousQuestionsText[0].code
      this.selectedAnswer = this.previousQuestionAnswers[0].value
    }
    this.conditions = this.existingConditions.rules
    this.allMustBeMet = this.existingConditions.allMustBeMet
  },
  methods: {
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
    updateSelectAnswers() {
      this.selectedAnswer = this.previousQuestionAnswers[0].value
    },
    checkIfDisabled() {
      return (
        this.conditions.filter((el) => {
          return (
            el.questionCode === this.selectedQuestion &&
            el.answer === this.selectedAnswer
          )
        }).length > 0
      )
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
