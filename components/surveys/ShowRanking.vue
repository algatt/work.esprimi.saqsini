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
    <div class="flex w-full">
      <i>{{ languageText['ranking_instructions'] }}</i>
    </div>
    <div class="flex w-full mt-2">
      <div class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in questionOptions"
          :key="'options' + index"
        >
          <div
            v-if="!answersText.includes(option.text)"
            class="md:w-7/12 w-11/12 p-3 my-2 text-white rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
            :class="displayStyle.accentBackground"
            @click="moveOptionToAnswers(option, index)"
          >
            <span class="flex flex-grow">{{ option.text }}</span>
          </div>
        </div>
      </div>

      <div class="w-6/12 flex flex-col">
        <div v-for="n in question.maxChoice" :key="n">
          <!--          {{ n }} {{ question.maxChoice }} {{ answers.length }}-->
          <div v-if="n <= answers.length">
            <div
              :key="`${index} ${languageText.title}`"
              class="w-11/12 md:w-7/12 p-3 my-2 text-white rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
              :class="displayStyle.accentBackground"
              @click="moveAnswerToOptions(answers[n - 1])"
            >
              <span class="flex flex-grow">{{ answers[n - 1].text }}</span>
            </div>
          </div>
          <div v-else>
            <div
              class="w-11/12 md:w-7/12 bg-gray-100 border-gray-20 p-3 my-2 rounded shadow-sm mx-auto border-2 border-dashed cursor-default"
            >
              <span class="flex flex-grow">{{ getDummy(n) }}</span>
            </div>
          </div>
        </div>
        <div v-if="false">
          <div
            v-for="(option, index) in answers"
            :key="`${index} ${languageText.title}`"
            class="w-11/12 md:w-7/12 p-3 my-2 text-white rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
            :class="displayStyle.accentBackground"
            @click="moveAnswerToOptions(option, index)"
          >
            <span class="flex flex-grow">{{ option.text }}</span>
          </div>

          <div
            v-for="n in question.maxChoice - answers.length"
            :key="dummies[n - 1].code"
            class="w-11/12 md:w-7/12 bg-gray-100 border-gray-20 p-3 my-2 rounded shadow-sm mx-auto border-2 border-dashed cursor-default"
          >
            <span class="flex flex-grow">{{ dummies[n - 1].text }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :class="displayStyle.accentText"
        @click="clearAnswers"
      >
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowRanking',
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
    }
  },
  computed: {
    convertedQuestion() {
      return JSON.parse(JSON.stringify(this.question))
    },
    questionOptions() {
      return this.convertedQuestion.options
    },
    answersText() {
      return this.answers.map((el) => {
        return el.text
      })
    },
  },
  watch: {
    answers() {
      this.$emit('answers', this.answers)
    },
  },
  created() {
    this.options = JSON.parse(JSON.stringify(this.convertedQuestion.options))

    if (this.existingAnswer) {
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
      this.answers = this.answers.sort((a, b) => {
        return a.value > b.value ? 1 : -1
      })
    }

    this.answers.forEach((elAnswer) => {
      this.options = this.options.filter((elOption) => {
        return (
          elOption.questionOption !== elAnswer.questionOption &&
          elAnswer.value !== elOption.value
        )
      })
    })
  },
  methods: {
    getDummy(n) {
      return `${this.languageText.position ?? 'Position'} ${n}`
    },
    moveOptionToAnswers(option) {
      if (this.answers.length === this.question.maxChoice) return
      const tempOption = JSON.parse(JSON.stringify(option))
      tempOption.value = `${tempOption.value} (${this.answers.length + 1})`
      this.answers.push(tempOption)
    },
    moveAnswerToOptions(option, index) {
      this.answers = this.answers.filter((el) => {
        return el.text !== option.text
      })
    },
    clearAnswers() {
      this.answers = []
    },
    getOptionText(option) {
      return this.convertedQuestion.options.find((el) => {
        return el.questionOption === option.questionOption
      }).text
    },
  },
}
</script>
