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
    <show-dropdown
      v-else-if="questionType === 'DROPDOWN'"
      :question="question"
    ></show-dropdown>
    <show-type-in
      v-else-if="questionType === 'TYPE_IN'"
      :question="question"
    ></show-type-in>
    <div v-else>
      {{ question }}
    </div>
  </div>
</template>

<script>
import ShowMultipleChoice from '~/components/surveys/ShowMultipleChoice'
import { getQuestionType } from '~/helpers/parseSurveyObjects'
import ShowSection from '~/components/surveys/ShowSection'
import ShowDropdown from '~/components/surveys/ShowDropdown'
import ShowTypeIn from '~/components/surveys/ShowTypeIn'

export default {
  name: 'DisplayQuestion',
  components: { ShowTypeIn, ShowDropdown, ShowSection, ShowMultipleChoice },
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
