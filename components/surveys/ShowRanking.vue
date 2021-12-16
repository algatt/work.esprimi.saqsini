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
          v-for="(option, index) in options"
          :key="'options' + index"
          class="md:w-7/12 w-11/12 p-3 my-2 text-white rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
          :class="displayStyle.accentBackground"
          @click="moveOptionToAnswers(option, index)"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </div>
      </div>

      <div class="w-6/12 flex flex-col">
        <div
          v-for="(option, index) in answers"
          :key="`${index} ${languageText.title}`"
          class="w-11/12 md:w-7/12 p-3 my-2 text-white rounded shadow-sm cursor-pointer mx-auto border-2 border-transparent"
          :class="displayStyle.accentBackground"
          @click="moveAnswerToOptions(option, index)"
        >
          <span class="flex flex-grow">{{ getOptionText(option) }}</span>
        </div>
        <div
          v-for="(option, index) in dummies"
          :key="index"
          class="w-11/12 md:w-7/12 bg-gray-100 border-gray-20 p-3 my-2 rounded shadow-sm mx-auto border-2 border-dashed cursor-default"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
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
      dummies: [],
      options: [],
    }
  },
  computed: {
    convertedQuestion() {
      const temp = JSON.parse(JSON.stringify(this.question))

      temp.options.forEach((option) => {
        option.questionOption = option.value
      })

      return temp
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

    if (!this.answers) this.answers = []

    this.answers.forEach((elAnswer) => {
      this.options = this.options.filter((elOption) => {
        return (
          elOption.questionOption !== elAnswer.questionOption &&
          elAnswer.value !== elOption.value
        )
      })
    })

    let position = this.languageText.position
    if (position === undefined) position = 'Position'
    for (let i = this.answers.length + 1; i <= this.question.maxChoice; i++)
      this.dummies.push({
        code: Math.random(),
        text: `${position} ${i}`,
      })
  },
  methods: {
    moveOptionToAnswers(option, index) {
      if (this.answers.length === this.question.maxChoice) return
      this.options.splice(index, 1)
      const tempOption = JSON.parse(JSON.stringify(option))
      tempOption.value = `${tempOption.value} (${this.answers.length + 1})`
      this.answers.push(tempOption)
      this.dummies.splice(0, 1)
    },
    moveAnswerToOptions(option, index) {
      this.answers.splice(index, 1)
      this.options.push(
        this.convertedQuestion.options.find((el) => {
          return el.value === option.questionOption
        })
      )
      this.options = this.options.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
      const rank = this.answers.length + 1
      let position = this.languageText.position
      if (position === undefined) position = 'Position'
      this.dummies.splice(index, 0, {
        code: Math.random(),
        text: `${position} ${rank}`,
      })
    },
    clearAnswers() {
      this.answers = []
      this.options = JSON.parse(JSON.stringify(this.convertedQuestion.options))
      this.dummies = []
      for (let i = 1; i <= this.options.length; i++)
        this.dummies.push({
          code: Math.random(),
          text: this.languageText.position
            ? this.languageText.position
            : 'Position' + ' ' + i,
        })
    },
    getOptionText(option) {
      return this.convertedQuestion.options.find((el) => {
        return el.questionOption === option.questionOption
      }).text
    },
  },
}
</script>
