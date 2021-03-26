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
      <select
        v-model="answers[0]"
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
          :value="option.value"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </option>
      </select>
    </div>
    <div class="flex my-2">
      <button class="btn-link cursor-pointer" @click="answers = []">
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
// @click="answers = option.value ? [option.value] : []"
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
    options() {
      const x = JSON.parse(JSON.stringify(this.question.options))
      x.unshift({
        ordinalPosition: 0,
        text: this.languageText.not_selected,
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
    if (this.existingAnswer && this.existingAnswer.length !== 0) {
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
    } else {
      this.answers.push(null)
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
