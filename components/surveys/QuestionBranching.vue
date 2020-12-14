<template>
  <div class="flex flex-col">
    <label class="label">Question</label>
    <select v-model="selectedQuestion" class="input select">
      <option
        v-for="previous in previousQuestionsText"
        :key="previous.code"
        :value="previous.code"
      >
        {{ previous.text }}
      </option>
    </select>
    <label class="label">Answer</label>
    <select v-model="selectedAnswer" class="input select">
      <option
        v-for="answer in previousQuestionAnswers"
        :key="answer"
        :value="answer.value"
      >
        {{ answer.value }}
      </option>
    </select>
    <label class="label">Show</label>
    <select class="input select">
      <option>1</option>
      <option>1</option>
    </select>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'QuestionBranching',
  data() {
    return {
      selectedQuestion: null,
      selectedAnswer: null,
    }
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    questions() {
      return this.$store.getters.getItems('questions').sort((a, b) => {
        return Number(a.ordinalPosition) > Number(b.ordinalPosition) ? 1 : -1
      })
    },
    previousQuestions() {
      return this.questions.filter((el) => {
        return (
          el.ordinalPosition < this.question.ordinalPosition &&
          !el.flags.includes('SECTION')
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
  },
  methods: {
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
  },
}
</script>

<style scoped></style>
