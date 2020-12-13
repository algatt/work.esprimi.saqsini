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
    <div class="flex flex-col flex-wrap md:flex-row">
      <select
        class="dropdown-input dropdown-select md:w-6/12 w-full"
        :class="defaultStyle ? 'focus:border-primary' : null"
        :style="
          defaultStyle
            ? null
            : {
                borderColor: survey.options.accentColour,
                backgroundColor: survey.options.backgroundColour,
                color: survey.options.textColour,
              }
        "
      >
        <option
          v-for="(option, index) in options"
          :key="index"
          :selected="answers ? answers[0] : null"
          @click="answers = option.value ? [option.value] : []"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </option>
      </select>
    </div>
  </div>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'ShowDropdown',
  props: {
    question: {
      required: true,
      type: Object,
    },
    defaultStyle: {
      required: true,
      type: Boolean,
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
    options() {
      const x = JSON.parse(JSON.stringify(this.question.options))
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
