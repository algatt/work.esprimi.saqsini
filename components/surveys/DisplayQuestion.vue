<template>
  <div
    class="w-full md:w-8/12 mx-auto"
    @click="$emit('selectQuestion', question)"
  >
    <show-multiple-choice
      v-if="questionType === 'MULTIPLE_CHOICE'"
      :question="question"
    ></show-multiple-choice>
    <div v-else>
      {{ question }}
    </div>
  </div>
</template>

<script>
import ShowMultipleChoice from '~/components/surveys/ShowMultipleChoice'
import { getQuestionType } from '~/helpers/parseSurveyObjects'

export default {
  name: 'DisplayQuestion',
  components: { ShowMultipleChoice },
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
