<template>
  <div class="flex flex-col w-full">
    <div class="w-full flex items-center mb-5">
      <menu-icon-button
        :active="selectedSection === 'details'"
        @click="selectSection('details')"
      >
        Details
        <template v-slot:icon
          ><i class="fas fa-question-circle fa-fw"></i
        ></template>
      </menu-icon-button>
      <menu-icon-button
        :active="selectedSection === 'branching'"
        @click="selectSection('branching')"
      >
        Branching
        <template v-slot:icon
          ><i class="fas fa-code-branch fa-fw"></i
        ></template>
      </menu-icon-button>
      <menu-icon-button
        v-if="questionType === 'SECTION'"
        :active="selectedSection === 'disqualify'"
        @click="selectSection('disqualify')"
        >Disqualify
        <template v-slot:icon>
          <i class="fas fa-eraser fa-fw"></i>
        </template>
      </menu-icon-button>
    </div>

    <div v-if="selectedSection === 'details'" class="space-y-5">
      <l-input
        id="inputNumber"
        v-model="form.questionNumber"
        :error="
          $v.form.questionNumber.$model !== undefined
            ? !$v.form.questionNumber.required
              ? 'required'
              : !$v.form.questionNumber.duplicate
              ? 'duplicate'
              : !$v.form.questionNumber.integer
              ? 'must be a whole number'
              : null
            : null
        "
        @change="$v.form.questionNumber.$touch()"
        ><span class="flex items-center">
          <template v-if="question.flags.includes('SECTION')"
            >Page Number</template
          ><template v-else>Question Number</template>

          <popup-information
            >This is the question number used for internal purposes. The
            respondent will not see this.</popup-information
          >
        </span></l-input
      >

      <l-input
        id="inputName"
        v-model="form.name"
        :error="
          $v.form.name.$model !== undefined
            ? !$v.form.name.required
              ? 'required'
              : null
            : null
        "
        @change="$v.form.name.$touch()"
        ><span class="flex items-center">
          <template v-if="question.flags.includes('SECTION')"
            >Internal Page Name</template
          ><template v-else>Internal Question Name</template>
          <popup-information
            >This is the name of the question used for internal purposes. The
            respondent will not see this.</popup-information
          >
        </span></l-input
      >

      <l-input id="inputDomain" v-model="form.domain"
        ><span class="flex items-center">
          Domain Name
          <popup-information
            >You can assign a label to the question which then can be used for
            reporting.</popup-information
          >
        </span></l-input
      >

      <l-text-area
        id="inputText"
        v-model="form.text"
        :error="
          $v.form.text.$model !== undefined
            ? !$v.form.text.required
              ? 'required'
              : null
            : null
        "
        @change="$v.form.text.$touch()"
        ><span class="flex items-center">
          <template v-if="question.flags.includes('SECTION')"
            >Page Text</template
          ><template v-else>Question Text</template>
          <popup-information
            >This is the question text that will be seen by the
            respondent.</popup-information
          >
        </span></l-text-area
      >

      <l-toggle
        v-if="questionType !== 'SECTION'"
        :checked="form.isMandatory"
        @clicked="form.isMandatory = $event"
      >
        <template v-slot:label>
          Required<popup-information>{{ infoRequired }}</popup-information>
        </template>
        <template v-slot:leftLabel>No</template>
        <template v-slot:rightLabel>Yes</template>
      </l-toggle>

      <component
        :is="questionTypeComponent"
        :form="form"
        @updatedOptions="form.options = $event"
        @updateAllowOther="form.allowOther = $event"
        @updateAllowMultiple="form.allowMultiple = $event"
        @updateMaxChoice="form.maxChoice = $event"
        @isValid="isRemainderOfFormValid = $event"
        @updatedShowWeights="form.showWeights = $event"
      ></component>
    </div>

    <question-branching
      v-else-if="selectedSection === 'branching'"
      :key="selectedSection"
      :existing-conditions="form.branching"
      :question="question"
      @conditions="receiveConditions"
      @isValid="isRemainderOfFormValid = $event"
    ></question-branching>

    <question-branching
      v-else-if="selectedSection === 'disqualify' && questionType === 'SECTION'"
      :key="selectedSection"
      :existing-conditions="form.disqualify"
      :question="question"
      @conditions="receiveDisqualify"
      @isValid="isRemainderOfFormValid = $event"
    ></question-branching>
  </div>
</template>

<script>
import { required, integer } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import NewQuestionSection from '@/components/surveys/NewQuestionSection'
import NewQuestionDropDown from '@/components/surveys/NewQuestionDropDown'
import NewQuestionTypeIn from '@/components/surveys/NewQuestionTypeIn'
import NewQuestionRanking from '@/components/surveys/NewQuestionRanking'
import NewQuestionMultipleChoice from '@/components/surveys/NewQuestionMultipleChoice'
import NewQuestionMultipleChoiceImage from '@/components/surveys/NewQuestionMultipleChoiceImage'
import NewQuestionLikert from '@/components/surveys/NewQuestionLikert'
import {
  QUESTION_TYPES,
  QUESTION_HELP,
} from '@/assets/settings/survey-settings'

import QuestionBranching from '@/components/surveys/QuestionBranching'
import NewQuestionRadioGrid from '@/components/surveys/NewQuestionRadioGrid'
import MenuIconButton from '@/components/elements/MenuIconButton'

import { convertQuestionFromApiToForm } from '@/services/question-helpers'

export default {
  name: 'NewQuestion',
  components: {
    MenuIconButton,
    NewQuestionRadioGrid,
    QuestionBranching,
    NewQuestionRanking,
    NewQuestionTypeIn,
    NewQuestionDropDown,
    NewQuestionSection,
    NewQuestionLikert,
    NewQuestionMultipleChoice,
    NewQuestionMultipleChoiceImage,
  },
  mixins: [validationMixin],
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedSection: 'details',
      form: {},
      isRemainderOfFormValid: true,
      infoNumber: QUESTION_HELP.NUMBER,
      infoName: QUESTION_HELP.NAME,
      infoText: QUESTION_HELP.TEXT,
      infoRequired: QUESTION_HELP.REQUIRED,
    }
  },
  computed: {
    question() {
      return this.dataItem
    },
    questions() {
      return this.$store.state.questions.items
    },
    questionType() {
      let x = this.question.flags
      if (this.question.isMultipleChoiceImage) x = 'MULTIPLE_CHOICE_IMAGE'

      let questionType = null
      Object.keys(QUESTION_TYPES).forEach((el) => {
        if (x.includes(el)) questionType = el
      })
      return questionType
    },
    questionTypeComponent() {
      return QUESTION_TYPES[this.questionType].component
    },
  },
  watch: {
    form: {
      handler(value) {
        this.$emit('update', value)
      },
      deep: true,
    },
    isRemainderOfFormValid(ev) {
      this.$emit('valid', ev)
    },
  },
  validations: {
    form: {
      name: {
        required,
      },
      text: {
        required,
      },
      questionNumber: {
        required,
        integer,
        duplicate(value) {
          const questions = JSON.parse(JSON.stringify(this.questions))

          return !questions
            .map((el) => {
              if (el.code !== this.form.code)
                return String(el.questionNumber).toLowerCase()
            })
            .includes(String(value).toLowerCase().trim())
        },
      },
    },
  },
  created() {
    if (JSON.parse(this.dataItem.surveyOptions).isMultipleChoiceImage) {
      this.dataItem.flags = this.dataItem.flags.filter((el) => {
        return el !== 'MULTIPLE_CHOICE'
      })
      this.dataItem.flags.push('MULTIPLE_CHOICE_IMAGE')
    }
    this.form = convertQuestionFromApiToForm(this.dataItem)
    if (!this.form.isMandatory) this.form.isMandatory = true
  },
  mounted() {
    this.$v.form.questionNumber.$touch()

    document.getElementById('inputName').focus()
    this.$watch(
      '$v',
      (val) => {
        if (typeof val !== 'undefined') {
          this.$emit('valid', !this.$v.$invalid && this.isRemainderOfFormValid)
        }
      },
      { deep: true, immediate: true }
    )
  },
  methods: {
    selectSection(which) {
      this.selectedSection = which
    },
    receiveConditions(ev) {
      this.form.branching = ev
    },
    receiveDisqualify(ev) {
      this.form.disqualify = ev
    },
  },
}
</script>
