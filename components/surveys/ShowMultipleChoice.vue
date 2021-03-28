<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="defaultStyle ? null : { color: survey.options.textColour }"
    >
      {{ question.text }}
      <span v-if="question.isMandatory" class="ml-1 text-xs font-medium italic">
        {{ languageText['required'] }}</span
      >
    </div>
    <div class="flex flex-col mt-2">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        class="card-multiple-choice"
        :class="
          defaultStyle
            ? answers.find((el) => {
                return option.value === el.value
              })
              ? 'border-primary bg-primary text-white'
              : 'border-primary'
            : null
        "
        :style="
          defaultStyle
            ? null
            : answers.find((el) => {
                return option.value === el.value
              })
            ? {
                borderColor: survey.options.accentColour,
                backgroundColor: survey.options.accentColour,
                color: survey.options.backgroundColour,
              }
            : {
                borderColor: survey.options.accentColour,
                color: survey.options.textColour,
              }
        "
        @click="addToAnswer(option)"
      >
        <span class="w-8">
          <transition name="fade">
            <i
              v-if="
                answers.find((el) => {
                  return option.value === el.value
                })
              "
              class="fas fa-check-circle"
              :style="
                defaultStyle ? null : { color: survey.options.backgroundColour }
              "
            ></i></transition
        ></span>
        <span class="flex flex-grow">{{ option.text }}</span>
      </button>

      <div
        v-if="question.allowOther"
        class="card-multiple-choice"
        :class="
          defaultStyle
            ? otherAnswer !== ''
              ? 'border-primary bg-primary text-white'
              : 'border-primary'
            : null
        "
        :style="
          defaultStyle
            ? null
            : otherAnswer !== ''
            ? {
                borderColor: survey.options.accentColour,
                backgroundColor: survey.options.accentColour,
                color: survey.options.textColour,
              }
            : {
                borderColor: survey.options.accentColour,
                color: survey.options.textColour,
                backgroundColor: survey.options.backgroundColour,
              }
        "
      >
        <span class="w-8 flex justify-center items-center">
          <transition name="fade">
            <i
              v-if="otherAnswer !== ''"
              class="fas fa-check-circle"
              :style="
                defaultStyle ? null : { color: survey.options.backgroundColour }
              "
            ></i></transition
        ></span>
        <input
          v-model="otherAnswer"
          class="flex flex-grow font-semibold transition duration-300"
          :class="
            defaultStyle
              ? otherAnswer !== ''
                ? 'bg-primary text-white'
                : null
              : null
          "
          :style="
            defaultStyle
              ? null
              : otherAnswer !== ''
              ? {
                  color: survey.options.backgroundColour,
                  backgroundColor: survey.options.accentColour,
                }
              : { backgroundColor: survey.options.backgroundColour }
          "
          placeholder="Other answer..."
          @blur="checkOtherAnswer"
        />
      </div>
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
  name: 'ShowMultipleChoiceVue',
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
      otherAnswer: '',
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
    availableAnswers() {
      return this.question.options.map((el) => {
        return el.value.toLowerCase()
      })
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
      const foundOtherAnswer = this.answers.find((el) => {
        return el.otherAnswer
      })
      if (foundOtherAnswer) {
        this.otherAnswer = foundOtherAnswer.value
      }
    }
  },
  methods: {
    addToAnswer(option) {
      option.code = option.value
      const foundAnswer = this.answers.find((el) => {
        return el.value === option.value
      })
      if (foundAnswer) {
        this.answers = this.answers.filter((el) => {
          return el.value !== option.value
        })
      } else {
        if (!this.question.allowMultiple) {
          this.answers = []
        }
        this.answers.push(option)
      }
    },
    checkOtherAnswer() {
      if (
        this.availableAnswers.includes(this.otherAnswer.toLowerCase().trim())
      ) {
        this.otherAnswer = ''
      } else if (this.otherAnswer === '') {
        this.answers = this.answers.filter((el) => {
          return !el.otherAnswer
        })
      } else {
        this.addToAnswer({
          text: this.otherAnswer,
          value: this.otherAnswer,
          otherAnswer: true,
        })
      }
    },
  },
}
</script>

<style scoped>
.card-multiple-choice {
  @apply border-2 mb-2 w-full md:w-80 flex justify-start px-3 py-2 flex-wrap shadow-sm rounded transition duration-300 font-semibold;
}
</style>
