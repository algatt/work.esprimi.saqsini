<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2"
      :style="defaultStyle ? null : { color: survey.options.textColour }"
    >
      {{ question.text }}
    </div>
    <div class="flex flex-col flex-wrap md:flex-row">
      <textarea
        v-model="answers[0]"
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
}
</script>

<style scoped></style>
