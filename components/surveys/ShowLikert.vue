<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="defaultStyle ? null : { color: survey.options.textColour }"
    >
      {{ question.text
      }}<span
        v-if="question.isMandatory"
        class="ml-1 text-xs font-medium italic"
      >
        {{ languageText['required'] }}</span
      >
    </div>
    <div
      id="divButtons"
      class="flex flex-col md:flex-row md:flex-wrap items-center w-full justify-between mt-2"
    >
      <span v-if="question.showWeights" class="flex pr-3">{{
        question.options[0].text
      }}</span>
      <span
        class="flex w-full md:flex-1 flex-col flex-wrap md:flex-row md:flex-grow"
      >
        <button
          v-for="(option, index) in question.options"
          :key="index"
          class="card-likert"
          :class="
            defaultStyle
              ? answers.length > 0 && answers[0].value === option.value
                ? 'border-primary bg-primary text-white'
                : 'border-primary'
              : null
          "
          :style="
            defaultStyle
              ? null
              : answers.length > 0 && answers[0].value === option.value
              ? {
                  borderColor: survey.options.accentColour,
                  color: survey.options.backgroundColour,
                  backgroundColor: survey.options.accentColour,
                }
              : {
                  borderColor: survey.options.accentColour,
                  color: survey.options.textColour,
                }
          "
          @click="addAnswer(option)"
        >
          <span v-if="!question.showWeights" class="flex justify-center">{{
            option.text
          }}</span>
          <span v-else class="flex justify-center">{{ option.value }}</span>
        </button>
      </span>
      <span v-if="question.showWeights" class="flex pl-3">{{
        question.options[question.options.length - 1].text
      }}</span>
    </div>
    <div class="flex my-2">
      <button class="btn-link cursor-pointer" @click="answers = []">
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowLikert',
  props: {
    question: {
      required: true,
      type: Object,
    },
    defaultStyle: {
      required: false,
      type: Boolean,
      default: false,
    },
    existingAnswer: {
      required: false,
      type: Array,
      default: null,
    },
    languageText: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      answers: [],
    }
  },
  computed: {
    survey() {
      return parseSurveyToForm(
        this.$store.getters.getItems('surveys').find((el) => {
          return el.code === this.question.surveyCode
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
    if (this.existingAnswer) {
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
    }
  },
  methods: {
    addAnswer(option) {
      option.code = option.value
      this.answers = [option]
    },
  },
}
</script>

<style scoped>
.card-likert {
  @apply w-full md:flex-1 justify-center px-3 py-2 flex-wrap shadow-sm transition duration-300 font-semibold focus:outline-none;
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
