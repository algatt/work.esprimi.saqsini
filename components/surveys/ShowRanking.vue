<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div class="flex w-full">
      <div class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in options"
          :key="'options' + index"
          class="md:w-7/12 w-11/12 p-3 my-2 rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
          @click="moveOptionToAnswers(option, index)"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
      </div>

      <div class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in answers"
          :key="'answers' + index"
          class="w-11/12 md:w-7/12 p-3 my-2 rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
          @click="moveAnswerToOptions(option, index)"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
        <div
          v-for="(option, index) in dummies"
          :key="index"
          class="w-11/12 md:w-7/12 p-3 my-2 rounded shadow-sm cursor-pointer mx-auto bg-gray-100 border-2 border-gray-200 border-dashed"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
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
  name: 'ShowRanking',
  props: {
    question: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      answers: [],
      dummies: [],
      options: [],
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
  },
  watch: {
    answers() {
      this.$emit('answers', this.answers)
    },
  },
  created() {
    this.options = JSON.parse(JSON.stringify(this.parsedQuestion.options))

    let rank = 1
    this.options.forEach(() => {
      this.dummies.push({ code: Math.random(), text: 'Position ' + rank++ })
    })
  },
  methods: {
    moveOptionToAnswers(option, index) {
      this.options.splice(index, 1)
      this.answers.push(option)
      this.dummies = []
      let rank = this.answers.length + 1
      this.options.forEach(() => {
        this.dummies.push({ code: Math.random(), text: 'Position ' + rank++ })
      })
    },
    moveAnswerToOptions(option, index) {
      this.answers.splice(index, 1)
      this.options.push(option)
      this.dummies = []
      let rank = this.answers.length + 1
      this.options.forEach(() => {
        this.dummies.push({ code: Math.random(), text: 'Position ' + rank++ })
      })
    },
  },
}
</script>

<style scoped></style>
