<template>
  <div
    class="fixed top-0 left-0 bg-gray-100 bg-opacity-75 w-full h-full z-10 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div class="bg-white flex flex-col shadow-lg rounded w-11/12 md:w-6/12">
      <div class="bg-gray-200 font-semibold p-2 text-gray-700">
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
            item.flags.includes('SECTION') ? null : 'ml-4',
          ]"
          @click="moveCurrentQuestionAfter(item.ordinalPosition)"
        >
          <p :class="item.code === question.code ? 'italic' : null">
            {{ item.name }}
          </p>
        </button>
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

<style scoped></style>
