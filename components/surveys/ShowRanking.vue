<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div class="flex w-full">
      <draggable class="w-6/12 flex flex-col" :list="options" group="people">
        <div
          v-for="(option, index) in options"
          :key="index"
          class="md:w-7/12 w-11/12 p-3 my-2 rounded shadow-sm cursor-move mx-auto"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
      </draggable>

      <draggable :list="answers" group="people" class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in answers"
          :key="index"
          class="w-11/12 md:w-7/12 p-3 my-2 rounded shadow-sm cursor-move mx-auto"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
      </draggable>
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
    }
  },
  computed: {
    parsedQuestion() {
      return parseQuestionToForm(this.question)
    },
    options() {
      return JSON.parse(JSON.stringify(this.parsedQuestion.options))
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
}
</script>

<style scoped></style>
