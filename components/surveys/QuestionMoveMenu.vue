<template>
  <div class="frosted flex items-center justify-center z-30">
    <div
      class="bg-white flex flex-col shadow-lg rounded w-full h-full md:w-6/12 md:h-auto"
    >
      <div class="bg-primary text-white font-semibold p-2 rounded-t">
        Move {{ question.name }} after
      </div>
      <div class="px-5 py-2">
        <button
          v-for="item in questions"
          :key="item.code"
          :disabled="item.code === question.code"
          class="flex my-2 p-2 transition duration-300 rounded hover:bg-gray-100"
          :class="[
            item.code === question.code
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            item.flags.includes('SECTION') ? 'font-semibold' : 'ml-4',
          ]"
          @click="moveCurrentQuestionAfter(item.ordinalPosition)"
        >
          <p :class="item.code === question.code ? 'italic' : null">
            {{ item.name }}
            <span v-if="item.code === question.code"> (current question)</span>
          </p>
        </button>
      </div>
      <div class="w-full p-3 justify-end w-full flex">
        <button class="btn-primary px-3" @click="$emit('close')">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionMoveMenu',
  props: {
    question: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  methods: {
    moveCurrentQuestionAfter(position) {
      let tempQuestions = JSON.parse(JSON.stringify(this.questions))
      let indexToInsert = 0
      for (const el in tempQuestions) {
        if (tempQuestions[el].ordinalPosition === position) {
          indexToInsert = Number(el) + 1
          break
        }
      }
      const tempQuestion = JSON.parse(JSON.stringify(this.question))
      tempQuestion.new = true
      tempQuestions.splice(indexToInsert, 0, tempQuestion)

      tempQuestions = tempQuestions.filter((el) => {
        return el.new === true || el.code !== this.question.code
      })
      let ordinalPosition = 1
      tempQuestions.forEach((el) => {
        el.ordinalPosition = ordinalPosition++
      })

      tempQuestions = tempQuestions.map((el) => {
        return { question: el.code, position: el.ordinalPosition }
      })

      this.$store
        .dispatch('questions/updateQuestionList', tempQuestions)
        .then(() => {
          this.$toasted.show('Updated Successfully')
        })
        .catch(() => {
          this.$toasted.error('There was a problem updating the list...')
        })
    },
  },
}
</script>

<style scoped>
.frosted {
  @apply flex fixed top-0 left-0 w-full h-screen;
  background: rgba(255, 255, 255, 0.5);
  /*box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);*/
  /*backdrop-filter: blur(2px);*/
  /*-webkit-backdrop-filter: blur(2px);*/
}
</style>
