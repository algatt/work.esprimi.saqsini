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
    <div class="flex flex-col flex-wrap md:flex-row mt-2">
      <select
        v-model="answers"
        class="dropdown-input dropdown-select md:w-6/12 w-full"
        :style="{
          borderColor: displayStyle.accentColour,
          backgroundColor: displayStyle.backgroundColour,
          color: displayStyle.textColour,
        }"
      >
        <option value="" disabled selected>{{ getNotSelected() }}</option>
        <option
          v-for="(option, index) in convertedQuestion.options"
          :key="index"
          :value="option.value"
        >
          <span class="flex flex-grow">{{ option.text }}</span>
        </option>
      </select>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :style="{ color: displayStyle.accentColour }"
        @click="answers = ''"
      >
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowDropdown',
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
      answers: '',
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
      if (this.answers === '') {
        this.$emit('answers', [])
      } else {
        const whichOption = this.convertedQuestion.options.find((el) => {
          return el.value === this.answers
        })

        this.$emit('answers', [whichOption])
      }
    },
  },
  created() {
    if (this.existingAnswer && this.existingAnswer.length > 0) {
      this.answers = this.existingAnswer[0].value
    }
  },
  methods: {
    getNotSelected() {
      return this.languageText.not_selected
        ? this.languageText.not_selected
        : 'Not Selected'
    },
  },
}
</script>

<style scoped>
.dropdown-input {
  @apply border-2 rounded-sm px-3 py-2 transition duration-500 ring-offset-2 focus:outline-none font-medium;
}

.dropdown-select {
  @apply appearance-none;
  background-image: url('/dropdown.svg');
  background-repeat: no-repeat;
  background-position: right 0.5em top 50%;
  background-size: 1em auto;
}
</style>
