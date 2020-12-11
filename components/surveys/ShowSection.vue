<template>
  <div class="flex flex-col">
    <div
      class="flex"
      :style="defaultStyle ? null : { color: survey.options.textColour }"
    >
      <p>{{ question.text }}</p>
    </div>
  </div>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowSection',
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
  methods: {
    addToAnswer(value) {},
  },
}
</script>

<style scoped></style>
