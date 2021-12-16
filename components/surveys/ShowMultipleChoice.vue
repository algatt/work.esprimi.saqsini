<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :class="displayStyle.textColour"
    >
      {{ question.text }}
      <span v-if="question.isMandatory" class="ml-1 text-xs font-medium italic">
        {{ languageText['required'] }}</span
      >
    </div>
    <div class="flex flex-col mt-2 max-w-max min-w-48">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        :class="[
          displayStyle.borderColour,
          answerPresent(option.value)
            ? `${displayStyle.accentBackground} text-white`
            : `${displayStyle.accentText}`,
        ]"
        class="card-multiple-choice"
        @click="addToAnswer(option)"
      >
        <span class="w-10 min-w-10">
          <transition name="fade">
            <i
              v-if="answerPresent(option.value)"
              class="fas fa-check-circle fa-fw"
            ></i></transition
        ></span>
        <span class="text-left pl-2 pr-12">{{ option.text }}</span>
      </button>

      <div
        v-if="question.allowOther"
        class="flex items-center border-2 mb-2 shadow-sm transition duration-300 font-semibold rounded pr-12"
        :class="[
          displayStyle.borderColour,
          otherAnswer !== ''
            ? `${displayStyle.accentBackground} text-white`
            : `${displayStyle.accentText}`,
        ]"
      >
        <span
          class="w-10 min-w-10 flex justify-center items-center cursor-pointer"
          @click="removeOther"
        >
          <transition name="fade">
            <i
              v-if="otherAnswer !== ''"
              class="fas fa-check-circle"
            ></i></transition
        ></span>
        <input
          v-model="otherAnswer"
          :class="[
            displayStyle.borderColour,
            otherAnswer !== ''
              ? `${displayStyle.accentBackground} text-white`
              : `${displayStyle.accentText}`,
          ]"
          class="focus:outline-none py-2 pl-2 font-semibold transition duration-300"
          placeholder="Other answer..."
          @blur="checkOtherAnswer"
        />
      </div>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :class="displayStyle.accentText"
        @click="
          answers = []
          otherAnswer = ''
        "
      >
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
        return el.questionOption === 'Other'
      })
      if (foundOtherAnswer) {
        this.otherAnswer = foundOtherAnswer.value
      }
    }
  },
  methods: {
    addToAnswer(option) {
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
          return el.questionOption !== 'Other'
        })
      } else {
        this.addToAnswer({
          questionOption: 'Other',
          value: this.otherAnswer,
        })
      }
    },
    removeOther() {
      this.answers = this.answers.filter((el) => {
        return el.questionOption !== 'Other'
      })
      this.otherAnswer = ''
    },
    answerPresent(value) {
      return this.answers.find((el) => {
        return el.value === value
      })
    },
  },
}
</script>

<style scoped>
.card-multiple-choice {
  @apply flex items-center border-2 mb-2 py-2 shadow-sm transition duration-300 font-semibold rounded;
}

.otherInput::placeholder {
  @apply text-gray-900;
}
</style>
