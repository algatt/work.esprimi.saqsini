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
        >required</span
      >
    </div>
    <div class="flex flex-col flex-wrap md:flex-row mt-2">
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
    existingAnswer: {
      required: false,
      type: Array,
      default: null,
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
}
</script>

<style scoped></style>
