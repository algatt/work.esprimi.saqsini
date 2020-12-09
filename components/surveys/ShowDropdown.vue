<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div class="flex flex-col flex-wrap md:flex-row">
      <select
        class="dropdown-input dropdown-select md:w-6/12 w-full"
        :style="{ borderColor: survey.options.accentColour }"
      >
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
  watch: {
    answers() {
      this.$emit('answers', this.answers)
    },
  },
}
</script>

<style scoped>
.dropdown-input {
  @apply border-2 rounded-sm px-3 py-2 transition duration-500 ring-offset-2 focus:outline-none;
}

.dropdown-select {
  @apply appearance-none;
  background-image: url('/dropdown.svg');
  background-repeat: no-repeat;
  background-position: right 0.5em top 50%;
  background-size: 1em auto;
}
</style>
