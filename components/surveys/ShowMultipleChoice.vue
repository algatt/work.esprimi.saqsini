<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div class="flex flex-col">
      <button
        v-for="(option, index) in parsedQuestion.options"
        :key="index"
        class="card-multiple-choice"
        :style="
          answers.includes(option.value)
            ? {
                borderColor: survey.options.accentColour,
                backgroundColor: survey.options.accentColour,
                color: 'white',
              }
            : {
                borderColor: survey.options.accentColour,
                color: survey.options.accentColour,
              }
        "
        @click="addToAnswer(option.value)"
      >
        <span class="w-8">
          <transition name="fade">
            <i
              v-if="answers.includes(option.value)"
              class="fas fa-check-circle"
              :style="{ color: survey.options.backgroundColour }"
            ></i></transition
        ></span>
        <span class="flex flex-grow">{{ option.text }}</span>
      </button>

      <div
        v-if="parsedQuestion.allowOther"
        class="card-multiple-choice"
        :style="
          otherAnswer !== ''
            ? {
                borderColor: survey.options.accentColour,
                backgroundColor: survey.options.accentColour,
                color: 'white',
              }
            : {
                borderColor: survey.options.accentColour,
                color: survey.options.accentColour,
              }
        "
      >
        <span class="w-8 flex justify-center items-center">
          <transition name="fade">
            <i
              v-if="otherAnswer !== ''"
              class="fas fa-check-circle"
              :style="{ color: survey.options.backgroundColour }"
            ></i></transition
        ></span>
        <input
          v-model="otherAnswer"
          class="flex flex-grow font-semibold transition duration-300"
          :style="
            otherAnswer !== ''
              ? {
                  backgroundColor: survey.options.accentColour,
                }
              : null
          "
          placeholder="Other answer..."
          @blur="checkOtherAnswer"
        />
      </div>
    </div>
  </div>
</template>

<script>
import {
  parseQuestionToForm,
  parseSurveyToForm,
} from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowMultipleChoiceVue',
  props: {
    question: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      answers: [],
      otherAnswer: '',
    }
  },
  computed: {
    parsedQuestion() {
      return parseQuestionToForm(this.question)
    },
    survey() {
      return parseSurveyToForm(
        this.$store.getters.getItems('surveys').find((el) => {
          return el.code === this.parsedQuestion.surveyCode
        })
      )
    },
    availableAnswers() {
      return this.parsedQuestion.options.map((el) => {
        return el.text.toLowerCase()
      })
    },
  },
  methods: {
    addToAnswer(value) {
      if (this.parsedQuestion.allowMultiple === true) {
        if (!this.answers.includes(value)) this.answers.push(value)
        else
          this.answers = this.answers.filter((el) => {
            return el !== value
          })
      } else {
        this.answers = [value]
      }
    },
    checkOtherAnswer() {
      if (
        this.availableAnswers.includes(this.otherAnswer.toLowerCase().trim())
      ) {
        this.otherAnswer = ''
      } else if (this.parsedQuestion.allowMultiple === true) {
        const previousAnswers = []
        this.answers.forEach((el) => {
          if (this.availableAnswers.includes(el.toLowerCase().trim())) {
            previousAnswers.push(el)
          }
        })

        this.answers = previousAnswers
        if (this.otherAnswer !== '') this.answers.push(this.otherAnswer)
      } else if (this.otherAnswer !== '') this.answers = this.otherAnswer
    },
  },
}
</script>

<style scoped>
.card-multiple-choice {
  @apply border-2 mb-2 w-80 flex justify-start px-3 py-2 flex-wrap shadow-sm rounded transition duration-300 font-semibold;
}
</style>
