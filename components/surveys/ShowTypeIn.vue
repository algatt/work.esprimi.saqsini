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
    <div class="flex flex-col flex-wrap md:flex-row mt-2">
      <textarea
        v-model="answer"
        class="w-full border-2 rounded-sm p-5"
        :class="[displayStyle.borderColour]"
      ></textarea>
    </div>
    <div class="flex my-2">
      <button
        class="cursor-pointer font-semibold"
        :class="displayStyle.accentText"
        @click="answer = ''"
      >
        {{ languageText['clear'] }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowTypeIn',
  props: {
    question: {
      required: true,
      type: Object,
    },
    displayStyle: {
      type: Object,
      required: true,
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
      answer: '',
    }
  },

  watch: {
    answer() {
      this.$emit('answers', [{ value: this.answer }])
    },
  },
  created() {
    if (this.existingAnswer && this.existingAnswer.length > 0)
      this.answer = this.existingAnswer[0].value
  },
}
</script>
