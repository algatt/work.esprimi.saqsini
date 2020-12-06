<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="{ color: survey.options.textColour }"
    >
      {{ parsedQuestion.text }}
    </div>
    <div id="divButtons" class="flex flex-col flex-wrap md:flex-row">
      <button
        v-for="(option, index) in parsedQuestion.options"
        :key="index"
        class="card-likert"
        :style="
          answers.includes(option.value)
            ? {
                borderColor: survey.options.accentColour,
                color: survey.options.backgroundColour,
                backgroundColor: survey.options.accentColour,
              }
            : { borderColor: survey.options.accentColour }
        "
        @click="answers = [option.value]"
      >
        <span class="flex flex-grow">{{ option.text }}</span>
      </button>
    </div>
  </div>
</template>

<script>
import {
  parseQuestionToForm,
  parseSurveyToForm,
} from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowLikert',
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

<style scoped>
.card-likert {
  @apply flex-1 justify-center px-3 py-2 flex-wrap shadow-sm transition duration-300 font-semibold focus:outline-none;
}

.card-likert:first-child {
  @apply md:border-2 md:rounded-l border-2 rounded-t md:rounded-none;
}

.card-likert:last-child {
  @apply md:border-t-2 md:border-b-2 md:border-r-2  md:border-l-0 md:rounded-r border-l-2 border-r-2 border-b-2 rounded-b md:rounded-none;
}

.card-likert:not(:first-child):not(:last-child) {
  @apply md:border-t-2 md:border-b-2 md:border-r-2 md:border-l-0 border-l-2 border-r-2 border-b-2;
}
</style>
