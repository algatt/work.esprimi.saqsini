<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div class="flex flex-col flex-wrap md:flex-row">
      <select class="input select w-full md:w-44">
        <option
          v-for="(option, index) in options"
          :key="index"
          @click="answers = option.value ? [option.value] : []"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import {
  parseQuestionToForm,
  parseSurveyToForm,
} from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowDropdown',
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
      const x = JSON.parse(JSON.stringify(this.parsedQuestion.options))
      x.unshift({
        ordinalPosition: 0,
        text: 'Not Selected',
        value: null,
      })
      return x
    },
    survey() {
      return parseSurveyToForm(
        this.$store.getters.getItems('surveys').find((el) => {
          return el.code === this.parsedQuestion.surveyCode
        })
      )
    },
  },
}
</script>

<style scoped></style>
