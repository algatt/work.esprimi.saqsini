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
      class="flex w-full"
      :style="defaultStyle ? null : { color: survey.options.textColour }"
    >
      <i>{{ languageText['ranking_instructions'] }}</i>
    </div>
    <div class="flex w-full mt-2">
      <div class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in options"
          :key="'options' + index"
          class="md:w-7/12 w-11/12 p-3 my-2 rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
          :class="defaultStyle ? 'bg-primary' : null"
          :style="
            defaultStyle
              ? { color: '#FFFFFF' }
              : {
                  backgroundColor: survey.options.accentColour,
                  color: survey.options.backgroundColour,
                }
          "
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
          :class="defaultStyle ? 'bg-primary text-white' : null"
          :style="
            defaultStyle
              ? null
              : {
                  backgroundColor: survey.options.accentColour,
                  color: survey.options.backgroundColour,
                }
          "
          @click="moveAnswerToOptions(option, index)"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
        <div
          v-for="(option, index) in dummies"
          :key="index"
          class="w-11/12 md:w-7/12 p-3 my-2 rounded shadow-sm mx-auto border-2 border-dashed cursor-default"
          :class="
            defaultStyle
              ? 'bg-gray-100 border-gray-200'
              : survey.options.backgroundColour === '#000000'
              ? 'bg-gray-700 border-gray-800'
              : 'bg-gray-100 border-gray-200'
          "
          :style="defaultStyle ? null : { color: survey.options.textColour }"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
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
  name: 'ShowRanking',
  props: {
    question: {
      required: true,
      type: Object,
    },
    defaultStyle: {
      required: false,
      default: false,
      type: Boolean,
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
      dummies: [],
      options: [],
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
    this.options = JSON.parse(JSON.stringify(this.question.options))

    if (this.existingAnswer) {
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
    }

    if (!this.answers) this.answers = []

    this.answers.forEach((elAnswer) => {
      this.options = this.options.filter((elOption) => {
        return elAnswer.value !== elOption.value
      })
    })

    for (let i = 1; i <= this.options.length; i++)
      this.dummies.push({
        code: Math.random(),
        text: this.languageText.position + ' ' + i,
      })
  },
  methods: {
    moveOptionToAnswers(option, index) {
      this.options.splice(index, 1)
      let rank = this.answers.length + 1
      option.code = `${option.value} (${rank})`
      this.answers.push(option)
      this.dummies = []

      this.options.forEach(() => {
        this.dummies.push({
          code: Math.random(),
          text: this.languageText.position + ' ' + rank++,
        })
      })
    },
    moveAnswerToOptions(option, index) {
      this.answers.splice(index, 1)
      this.options.push(option)
      this.dummies = []
      let rank = this.answers.length + 1
      this.options.forEach(() => {
        this.dummies.push({
          code: Math.random(),
          text: this.languageText.position + ' ' + rank++,
        })
      })
    },
  },
}
</script>
