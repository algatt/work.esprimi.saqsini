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
    <div class="flex flex-col flex-wrap md:flex-row mt-2">
      <textarea
        v-model="answer"
        class="input w-full"
        :style="
          defaultStyle
            ? null
            : {
                backgroundColor: survey.options.backgroundColour,
                color: survey.options.textColour,
                borderColor: survey.options.accentColour,
              }
        "
      ></textarea>
    </div>
    <div class="flex my-2">
      <button class="btn-link cursor-pointer" @click="answer = ''">
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowTypeIn',
  props: {
    question: {
      required: true,
      type: Object,
    },
    defaultStyle: {
      type: Boolean,
      required: false,
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
      answer: '',
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
    answer() {
      this.$emit('answers', [{ code: this.answer, value: this.answer }])
    },
  },
  created() {
    if (
      this.existingAnswer &&
      this.existingAnswer.length > 0 &&
      this.existingAnswer[0].value
    ) {
      this.answer = JSON.parse(JSON.stringify(this.existingAnswer)).value
    }
  },
}
</script>

<style scoped></style>
