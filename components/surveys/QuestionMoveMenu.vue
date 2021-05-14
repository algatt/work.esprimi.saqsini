<template>
  <div class="flex flex-col">
    <button
      v-for="item in questions"
      :key="item.code"
      :disabled="
        item.code === tempQuestion.code ||
        item.ordinalPosition === tempQuestion.ordinalPosition - 1 ||
        item.ordinalPosition < minPosition
      "
      class="flex mb-4 py-2 px-4 transition duration-300 rounded hover:bg-gray-100 border border-gray-200"
      :class="[
        item.code === tempQuestion.code ||
        item.ordinalPosition === tempQuestion.ordinalPosition - 1 ||
        item.ordinalPosition < minPosition
          ? 'cursor-not-allowed'
          : 'cursor-pointer',
        ,
        { 'ml-4': !item.flags.includes('SECTION') },
        { 'bg-gray-50': item.flags.includes('SECTION') },
      ]"
      @click="moveCurrentQuestionAfter(item.ordinalPosition)"
    >
      <p class="flex items-center space-x-3">
        <span
          :class="item.flags.includes('SECTION') ? 'font-semibold' : 'ml-4'"
          >{{ item.name }}</span
        >
        <span class="text-primary font-semibold">{{
          item.questionNumber
        }}</span>
        <l-badge v-if="!item.flags.includes('SECTION')">{{
          getQuestionType(item)
        }}</l-badge>
        <l-badge v-if="item.code === tempQuestion.code" color="green"
          >current question</l-badge
        >

        <l-badge
          v-if="item.ordinalPosition <= minPosition"
          color="red"
          title="Moving it here will cause existing branching not to work anymore."
          >branching problem</l-badge
        >
      </p>
    </button>
  </div>
</template>

<script>
import { getQuestionType } from '~/helpers/parseSurveyObjects'
import { QUESTION_TYPES } from '~/helpers/constants'

export default {
  name: 'QuestionMoveMenu',

  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      tempQuestion: null,
    }
  },
  computed: {
    questions() {
      return this.$store.getters['questions/sortedQuestions']
    },
    minPosition() {
      let whichPosition = null
      this.questions.forEach((el) => {
        if (this.getBranchingError(el)) {
          if (whichPosition && whichPosition < el.ordinalPosition)
            whichPosition = el.ordinalPosition
          else whichPosition = el.ordinalPosition
        }
      })
      return whichPosition
    },
  },
  created() {
    this.tempQuestion = JSON.parse(JSON.stringify(this.dataItem))
  },

  methods: {
    getBranchingError(question) {
      let found = false

      const branching = JSON.parse(this.dataItem.surveyOptions)
      if (branching.branching) {
        branching.branching.rules.forEach((rule) => {
          rule.ruleList.forEach((rl) => {
            if (rl.questionNumber === question.questionNumber) {
              found = true
            }
          })
        })
      }

      return found
    },
    getQuestionType(question) {
      return QUESTION_TYPES[getQuestionType(question)].text
    },
    moveCurrentQuestionAfter(position) {
      let tempQuestions = JSON.parse(JSON.stringify(this.questions))
      let indexToInsert = 0
      for (const el in tempQuestions) {
        if (tempQuestions[el].ordinalPosition === position) {
          indexToInsert = Number(el) + 1
          break
        }
      }
      const tempQuestion = JSON.parse(JSON.stringify(this.dataItem))
      tempQuestion.new = true
      tempQuestions.splice(indexToInsert, 0, tempQuestion)

      tempQuestions = tempQuestions.filter((el) => {
        return el.new === true || el.code !== this.dataItem.code
      })
      let ordinalPosition = 1
      tempQuestions.forEach((el) => {
        if (el.code === this.tempQuestion.code)
          this.tempQuestion.ordinalPosition = ordinalPosition
        el.ordinalPosition = ordinalPosition++
      })

      tempQuestions = tempQuestions.map((el) => {
        return { question: el.code, position: el.ordinalPosition }
      })

      this.$store
        .dispatch('questions/updateQuestionNumbers', tempQuestions)
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
