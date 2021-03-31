<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="{ color: displayStyle.textColour }"
    >
      {{ question.text }}
      <span v-if="question.isMandatory" class="ml-1 text-xs font-medium italic">
        {{ languageText['required'] }}
      </span>
    </div>
    <div
      id="divButtons"
      class="flex flex-col md:flex-row md:flex-wrap items-center w-full justify-between mt-2"
    >
      <span
        class="flex w-full md:flex-1 flex-col flex-wrap md:flex-row md:flex-grow"
      >
        <button
          v-for="(option, index) in convertedQuestion.options"
          :key="index"
          class="card-likert"
          :style="{
            borderColor: displayStyle.accentColour,
            backgroundColor: answerPresent(option.value)
              ? displayStyle.accentColour
              : displayStyle.backgroundColour,
            color: answerPresent(option.value)
              ? displayStyle.backgroundColour
              : displayStyle.textColour,
          }"
          @click="addAnswer(option)"
        >
          <span v-if="!question.showWeights" class="flex justify-center">{{
            option.text
          }}</span>
          <span v-else class="flex justify-center">{{ option.value }}</span>
        </button>
      </span>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :style="{ color: displayStyle.accentColour }"
        @click="answers = []"
      >
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowLikert',
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
    if (this.existingAnswer) {
      this.answers = JSON.parse(JSON.stringify(this.existingAnswer))
    }
  },
  methods: {
    addAnswer(option) {
      option.code = option.value
      this.answers = [option]
    },
    answerPresent(value) {
      return (
        this.answers.length > 0 &&
        String(this.answers[0].value) === String(value)
      )
    },
  },
}
</script>

<style scoped>
.card-likert {
  @apply w-full md:flex-1 justify-center px-3 py-2 flex-wrap shadow-sm transition duration-300 font-semibold focus:outline-none;
}

.card-likert:first-child {
  @apply md:border-2 md:rounded-l border-2 rounded-t md:rounded-none;
}

.card-likert:last-child {
  @apply md:border-t-2 md:border-b-2 md:border-r-2  md:border-l-0 md:rounded-r border-l-2 border-r-2 border-b-2 rounded-b md:rounded-none;
}

.card-likert:not(:first-child):not(:last-child) {
  @apply md:border-t-2 md:border-b-2 md:border-r-2 md:border-l-0 border-l-2 border-r-2 border-b-2;
}
</style>
