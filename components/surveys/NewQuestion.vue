<template>
  <new-question-section
    v-if="questionType === 'SECTION'"
  ></new-question-section>
  <new-question-multiple-choice
    v-else-if="questionType === 'MULTIPLE_CHOICE'"
  ></new-question-multiple-choice>
  <new-question-likert
    v-else-if="questionType === 'LIKERT'"
  ></new-question-likert>
  <new-question-drop-down
    v-else-if="questionType === 'DROPDOWN'"
  ></new-question-drop-down>
  <new-question-type-in
    v-else-if="questionType === 'TYPE_IN'"
  ></new-question-type-in>
  <new-question-ranking
    v-else-if="questionType === 'RANKING'"
  ></new-question-ranking>
</template>

<script>
import { QUESTION_TYPES } from '~/helpers/constants'
import NewQuestionMultipleChoice from '~/components/surveys/NewQuestionMultipleChoice'
import NewQuestionLikert from '~/components/surveys/NewQuestionLikert'
import NewQuestionSection from '~/components/surveys/NewQuestionSection'
import NewQuestionDropDown from '~/components/surveys/NewQuestionDropDown'
import NewQuestionTypeIn from '~/components/surveys/NewQuestionTypeIn'
import NewQuestionRanking from '~/components/surveys/NewQuestionRanking'

export default {
  name: 'NewQuestion',
  components: {
    NewQuestionRanking,
    NewQuestionTypeIn,
    NewQuestionDropDown,
    NewQuestionSection,
    NewQuestionLikert,
    NewQuestionMultipleChoice,
  },
  computed: {
    questionType() {
      const x = this.$store.state.currentItemToBeEdited.flags
      if (x.includes('SECTION')) return 'SECTION'
      let questionType = null
      Object.keys(QUESTION_TYPES).forEach((el) => {
        if (x.includes(el)) questionType = el
      })
      return questionType
    },
  },
}
</script>

<style scoped></style>
