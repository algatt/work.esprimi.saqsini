<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="{ color: displayStyle.textColour }"
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
          displayStyle.accentColour
            ? answers.find((el) => {
                return option.value === el.value
              })
              ? 'border-primary bg-primary text-white'
              : 'border-primary'
            : null
        "
        :style="
          displayStyle.accentColour
            ? null
            : answers.find((el) => {
                return option.value === el.value
              })
            ? {
                borderColor: displayStyle.accentColour,
                backgroundColor: displayStyle.accentColour,
                color: displayStyle.backgroundColour,
              }
            : {
                borderColor: displayStyle.accentColour,
                color: displayStyle.textColour,
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
                displayStyle.backgroundColour
                  ? null
                  : { color: displayStyle.backgroundColour }
              "
            ></i></transition
        ></span>
        <span class="flex flex-grow">{{ option.text }}</span>
      </button>

      <div
        v-if="question.allowOther"
        class="card-multiple-choice"
        :class="
          displayStyle.accentColour
            ? otherAnswer !== ''
              ? 'border-primary bg-primary text-white'
              : 'border-primary'
            : null
        "
        :style="
          displayStyle.accentColour
            ? null
            : otherAnswer !== ''
            ? {
                borderColor: displayStyle.accentColour,
                backgroundColor: displayStyle.accentColour,
                color: displayStyle.textColour,
              }
            : {
                borderColor: displayStyle.accentColour,
                color: displayStyle.textColour,
                backgroundColor: displayStyle.backgroundColour,
              }
        "
      >
        <span class="w-8 flex justify-center items-center">
          <transition name="fade">
            <i
              v-if="otherAnswer !== ''"
              class="fas fa-check-circle"
              :style="
                displayStyle.backgroundColour
                  ? null
                  : { color: displayStyle.backgroundColour }
              "
            ></i></transition
        ></span>
        <input
          v-model="otherAnswer"
          class="flex flex-grow font-semibold transition duration-300"
          :class="
            displayStyle.accentColour
              ? otherAnswer !== ''
                ? 'bg-primary text-white'
                : null
              : null
          "
          :style="
            displayStyle.accentColour
              ? null
              : otherAnswer !== ''
              ? {
                  color: displayStyle.backgroundColour,
                  backgroundColor: displayStyle.accentColour,
                }
              : { backgroundColor: displayStyle.backgroundColour }
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
export default {
  name: 'ShowMultipleChoiceVue',
  props: {
    question: {
      required: true,
      type: Object,
    },
    displayStyle: {
      required: true,
      type: Object,
      default: () => {
        return {}
      },
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
