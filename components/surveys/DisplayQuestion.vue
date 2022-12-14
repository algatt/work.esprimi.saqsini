<template>
  <div class="mx-auto p-5 flex flex-col">
    <show-section
      v-if="questionType === 'SECTION'"
      :question="parsedQuestion"
      :display-style="displayStyle"
    ></show-section>
    <show-multiple-choice
      v-else-if="
        questionType === 'MULTIPLE_CHOICE' &&
        !parsedQuestion.isMultipleChoiceImage
      "
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-multiple-choice>
    <show-multiple-choice-image
      v-else-if="
        questionType === 'MULTIPLE_CHOICE' &&
        parsedQuestion.isMultipleChoiceImage
      "
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-multiple-choice-image>
    <show-likert
      v-else-if="questionType === 'LIKERT'"
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-likert>
    <show-dropdown
      v-else-if="questionType === 'DROPDOWN'"
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-dropdown>
    <show-type-in
      v-else-if="questionType === 'TYPE_IN'"
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-type-in>
    <show-ranking
      v-else-if="questionType === 'RANKING'"
      :key="question.code + ' ' + language"
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-ranking>
    <show-radio-grid
      v-else-if="questionType === 'RADIO_GRID'"
      :key="question.code + ' ' + language"
      :question="parsedQuestion"
      :display-style="displayStyle"
      :existing-answer="existingAnswer"
      :language-text="languageText"
      @answers="$emit('answers', $event)"
    ></show-radio-grid>
  </div>
</template>

<script>
import ShowMultipleChoice from '@/components/surveys/ShowMultipleChoice'

import ShowSection from '@/components/surveys/ShowSection'
import ShowDropdown from '@/components/surveys/ShowDropdown'
import ShowTypeIn from '@/components/surveys/ShowTypeIn'
import ShowRanking from '@/components/surveys/ShowRanking'
import ShowLikert from '@/components/surveys/ShowLikert'
import ShowRadioGrid from '@/components/surveys/ShowRadioGrid'
import ShowMultipleChoiceImage from '@/components/surveys/ShowMultipleChoiceImage'
import { SURVEY_OPTIONS } from '@/assets/settings/survey-settings'
import {
  convertQuestionFromApiToForm,
  getQuestionType,
} from '~/services/question-helpers'

export default {
  name: 'DisplayQuestion',
  components: {
    ShowRadioGrid,
    ShowRanking,
    ShowTypeIn,
    ShowDropdown,
    ShowSection,
    ShowMultipleChoice,
    ShowLikert,
    ShowMultipleChoiceImage,
  },
  props: {
    question: {
      type: Object,
      required: true,
    },
    displayStyle: {
      type: Object,
      required: false,
      default: () => {
        return SURVEY_OPTIONS.theme
      },
    },
    language: {
      type: String,
      required: false,
      default: 'en',
    },
    existingAnswer: {
      type: Array,
      required: false,
      default: null,
    },
    languageText: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
  },

  computed: {
    parsedQuestion() {
      return convertQuestionFromApiToForm(this.question, this.language)
    },
    questionType() {
      return getQuestionType(this.question)
    },
  },
  mounted() {
    this.answer = JSON.parse(JSON.stringify(this.existingAnswer))
  },
}
</script>

<style scoped></style>
