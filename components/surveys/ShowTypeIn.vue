<template>
  <div class="flex flex-col">
    <div
      class="flex font-semibold mb-2 items-center"
      :style="
        displayStyle.textColour ? null : { color: displayStyle.textColour }
      "
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
      <textarea
        v-model="answer"
        class="input w-full"
        :style="
          displayStyle.backgroundColour
            ? null
            : {
                backgroundColor: displayStyle.backgroundColour,
                color: displayStyle.textColour,
                borderColor: displayStyle.accentColour,
              }
        "
      ></textarea>
    </div>
    <div class="flex my-2">
      <button class="btn-link cursor-pointer" @click="answer = ''">
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
      answer: '',
    }
  },

  watch: {
    answer() {
      this.$emit('answers', [{ code: this.answer, value: this.answer }])
    },
  },
  created() {
    if (
      this.existingAnswer &&
      this.existingAnswer.length > 0 &&
      this.existingAnswer[0].value
    ) {
      this.answer = JSON.parse(JSON.stringify(this.existingAnswer)).value
    }
  },
}
</script>

<style scoped></style>
