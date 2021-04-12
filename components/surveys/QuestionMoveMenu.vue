<template>
  <div class="frosted flex items-center justify-center z-20">
    <div
      class="bg-white check-height flex flex-col shadow-lg w-full md:w-6/12 justify-between overflow-y-auto"
    >
      <div class="flex flex-col">
        <h5 class="bg-primary text-white font-semibold p-2 rounded-t">
          Move {{ tempQuestion.name }} after
        </h5>
        <div class="px-5 py-2">
          <button
            v-for="item in questions"
            :key="item.code"
            :disabled="
              item.code === tempQuestion.code ||
              item.ordinalPosition === tempQuestion.ordinalPosition - 1 ||
              item.ordinalPosition < minPosition
            "
            class="flex my-2 p-2 transition duration-300 rounded hover:bg-gray-100"
            :class="[
              item.code === tempQuestion.code ||
              item.ordinalPosition === tempQuestion.ordinalPosition - 1 ||
              item.ordinalPosition < minPosition
                ? 'cursor-not-allowed'
                : 'cursor-pointer',
            ]"
            @click="moveCurrentQuestionAfter(item.ordinalPosition)"
          >
            <p>
              <span
                :class="
                  item.flags.includes('SECTION') ? 'font-semibold' : 'ml-4'
                "
                >{{ item.name }}</span
              >
              <span class="text-primary font-semibold ml-2">{{
                item.questionNumber
              }}</span>
              <badge-base
                v-if="!item.flags.includes('SECTION')"
                class="ml-2"
                bg-colour="gray"
                >{{ getQuestionType(item) }}</badge-base
              >
              <badge-base
                v-if="item.code === tempQuestion.code"
                class="ml-2"
                bg-colour="green"
                >current question</badge-base
              >
              <badge-base
                v-if="item.ordinalPosition <= minPosition"
                bg-colour="red"
                title="Moving it here will cause existing branching not to work anymore."
                >branching problem</badge-base
              >
            </p>
          </button>
        </div>
      </div>
      <div class="w-full p-3 justify-end w-full flex">
        <button-base bg-colour="gray" @click="$emit('close')">
          Close
        </button-base>
      </div>
    </div>
  </div>
</template>

<script>
import { getQuestionType } from '~/helpers/parseSurveyObjects'
import BadgeBase from '~/components/elements/BadgeBase'
import { QUESTION_TYPES } from '~/helpers/constants'
import ButtonBase from '~/components/elements/ButtonBase'

export default {
  name: 'QuestionMoveMenu',
  components: { BadgeBase, ButtonBase },
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
  data() {
    return {
      tempQuestion: null,
    }
  },
  computed: {
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
    this.tempQuestion = JSON.parse(JSON.stringify(this.question))
  },
  mounted() {
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
  },
  methods: {
    getBranchingError(question) {
      let found = false

      const branching = JSON.parse(this.question.surveyOptions)
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
      const tempQuestion = JSON.parse(JSON.stringify(this.question))
      tempQuestion.new = true
      tempQuestions.splice(indexToInsert, 0, tempQuestion)

      tempQuestions = tempQuestions.filter((el) => {
        return el.new === true || el.code !== this.question.code
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
