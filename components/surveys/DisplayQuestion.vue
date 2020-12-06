<template>
  <div
    class="w-full md:w-8/12 mx-auto"
    @click="$emit('selectQuestion', question)"
  >
    <show-section
      v-if="questionType === 'SECTION'"
      :question="question"
    ></show-section>
    <show-multiple-choice
      v-else-if="questionType === 'MULTIPLE_CHOICE'"
      :question="question"
    ></show-multiple-choice>
    <show-likert
      v-else-if="questionType === 'LIKERT'"
      :question="question"
    ></show-likert>
    <div v-else>
      {{ question }}
    </div>
  </div>
</template>

<script>
import ShowMultipleChoice from '~/components/surveys/ShowMultipleChoice'
import { getQuestionType } from '~/helpers/parseSurveyObjects'
import ShowSection from '~/components/surveys/ShowSection'

export default {
  name: 'DisplayQuestion',
  components: { ShowSection, ShowMultipleChoice },
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
  computed: {
    questionType() {
      return getQuestionType(this.question)
    },
  },
}
</script>

<style scoped></style>
