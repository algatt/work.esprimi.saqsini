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
    <div class="flex flex-wrap mt-2">
      <button
        v-for="(option, index) in question.options"
        :key="index"
        :style="{
          borderColor: displayStyle.accentColour,
          backgroundColor: answerPresent(option.value)
            ? displayStyle.accentColour
            : 'white',
          color: answerPresent(option.value)
            ? 'white'
            : displayStyle.textColour,
        }"
        class="card-multiple-choice relative ml-2"
        @click="addToAnswer(option)"
      >
        <transition name="fade">
          <span
            v-if="answerPresent(option.value)"
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-white bg-opacity-50"
          >
            <i
              class="fas fa-check-circle fa-2x bg-white rounded-full"
              :style="{ color: displayStyle.accentColour }"
            ></i></span
        ></transition>
        <img
          :src="option.surveyOptions.image"
          class="rounded md:w-80 h-full object-cover"
        />
      </button>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :style="{ color: displayStyle.accentColour }"
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
  name: 'ShowMultipleChoiceImage',
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
  @apply border-2 mb-2 w-full md:w-80 flex justify-start p-1 flex-wrap shadow-sm rounded transition duration-300 font-semibold;
}

.otherInput::placeholder {
  @apply text-gray-700;
}
</style>
