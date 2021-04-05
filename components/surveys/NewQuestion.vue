<template>
  <div class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
      <div class="w-full flex items-center mb-5">
        <menu-icon-button
          :active="selectedSection === 'details'"
          @click="selectedSection = 'details'"
        >
          Details
          <template v-slot:icon
            ><i class="fas fa-question-circle fa-fw"></i
          ></template>
        </menu-icon-button>
        <menu-icon-button
          :active="selectedSection === 'branching'"
          @click="selectedSection = 'branching'"
        >
          Branching
          <template v-slot:icon
            ><i class="fas fa-code-branch fa-fw"></i
          ></template>
        </menu-icon-button>
      </div>

      <template v-if="selectedSection === 'details'">
        <div class="flex flex-wrap">
          <input-base
            id="inputNumber"
            v-model="form.questionNumber"
            class="w-full md:w-2/12"
            :error="
              $v.form.questionNumber.$model !== undefined
                ? !$v.form.questionNumber.required
                  ? 'required'
                  : !$v.form.questionNumber.duplicate
                  ? 'duplicate'
                  : null
                : null
            "
            @change="$v.form.questionNumber.$touch()"
            ><span class="flex items-center">
              Question Number
              <popup-base class="ml-1 font-normal"
                >This is the question number used for internal purposes. The
                respondent will not see this.</popup-base
              >
            </span></input-base
          >

          <input-base
            id="inputName"
            v-model="form.name"
            class="w-full md:w-10/12 pl-5"
            :error="
              $v.form.name.$model !== undefined
                ? !$v.form.name.required
                  ? 'required'
                  : null
                : null
            "
            @change="$v.form.name.$touch()"
            ><span class="flex items-center">
              Question Name
              <popup-base class="ml-1 font-normal"
                >This is the name of the question used for internal purposes.
                The respondent will not see this.</popup-base
              >
            </span></input-base
          >
        </div>

        <text-area-base
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
            Question Text
            <popup-base class="ml-1 font-normal"
              >This is the question text that will be seen by the
              respondent.</popup-base
            >
          </span></text-area-base
        >

        <toggle-switch
          v-if="questionType !== 'SECTION'"
          :checked="form.isMandatory"
          @clicked="form.isMandatory = $event"
        >
          <template v-slot:label>
            Required
            <popup-info class="font-normal"
              ><template v-slot:text>{{ infoRequired }}</template></popup-info
            ></template
          >
          <template v-slot:leftLabel>No</template>
          <template v-slot:rightLabel>Yes</template>
        </toggle-switch>

        <new-question-section
          v-if="questionType === 'SECTION'"
          :form="form"
        ></new-question-section>
        <new-question-multiple-choice
          v-else-if="questionType === 'MULTIPLE_CHOICE'"
          :form="form"
          @updatedOptions="form.options = $event"
          @updateAllowOther="form.allowOther = $event"
          @updateAllowMultiple="form.allowMultiple = $event"
          @isValid="isRemainderOfFormValid = $event"
        ></new-question-multiple-choice>
        <new-question-likert
          v-else-if="questionType === 'LIKERT'"
          :form="form"
          @updatedOptions="form.options = $event"
          @updatedShowWeights="form.showWeights = $event"
          @isValid="isRemainderOfFormValid = $event"
        ></new-question-likert>
        <new-question-drop-down
          v-else-if="questionType === 'DROPDOWN'"
          :form="form"
          @updatedOptions="form.options = $event"
          @isValid="isRemainderOfFormValid = $event"
        ></new-question-drop-down>
        <new-question-type-in
          v-else-if="questionType === 'TYPE_IN'"
          :form="form"
        ></new-question-type-in>
        <new-question-ranking
          v-else-if="questionType === 'RANKING'"
          :form="form"
          @updatedOptions="form.options = $event"
          @isValid="isRemainderOfFormValid = $event"
        ></new-question-ranking>
        <new-question-radio-grid
          v-else-if="questionType === 'RADIO_GRID'"
          :form="form"
          @updatedOptions="form.options = $event"
          @isValid="isRemainderOfFormValid = $event"
        ></new-question-radio-grid>
      </template>

      <question-branching
        v-else
        :existing-conditions="form.branching"
        @conditions="receiveConditions"
      ></question-branching>
    </div>
    <edit-object-modal-bottom-part
      class="pt-10 pb-2"
      :form="form"
      which="questions"
      :is-valid="!$v.$invalid && isRemainderOfFormValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { required } from 'vuelidate/lib/validators'
import { validationMixin } from 'vuelidate'
import NewQuestionSection from '~/components/surveys/NewQuestionSection'
import NewQuestionDropDown from '~/components/surveys/NewQuestionDropDown'
import NewQuestionTypeIn from '~/components/surveys/NewQuestionTypeIn'
import NewQuestionRanking from '~/components/surveys/NewQuestionRanking'
import NewQuestionMultipleChoice from '~/components/surveys/NewQuestionMultipleChoice'
import NewQuestionLikert from '~/components/surveys/NewQuestionLikert'
import { QUESTION_TYPES } from '~/helpers/constants'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import QuestionBranching from '~/components/surveys/QuestionBranching'
import questionMixin from '~/helpers/questionMixin'
import PopupInfo from '~/components/layouts/PopupInfo'
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import NewQuestionRadioGrid from '~/components/surveys/NewQuestionRadioGrid'
import MenuIconButton from '~/components/layouts/MenuIconButton'
import InputBase from '~/components/elements/InputBase'
import PopupBase from '~/components/elements/PopupBase'
import TextAreaBase from '~/components/elements/TextAreaBase'

export default {
  name: 'NewQuestion',
  components: {
    TextAreaBase,
    PopupBase,
    InputBase,
    MenuIconButton,
    NewQuestionRadioGrid,
    EditObjectModalBottomPart,
    QuestionBranching,
    NewQuestionRanking,
    NewQuestionTypeIn,
    NewQuestionDropDown,
    NewQuestionSection,
    NewQuestionLikert,
    NewQuestionMultipleChoice,
    PopupInfo,
    ToggleSwitch,
  },
  mixins: [validationMixin, questionMixin],
  data() {
    return {
      selectedSection: 'details',
      form: {},
      isRemainderOfFormValid: true,
    }
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
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    questions() {
      return this.$store.getters.getItems('questions')
    },
    questionType() {
      const x = this.question.flags

      let questionType = null
      Object.keys(QUESTION_TYPES).forEach((el) => {
        if (x.includes(el)) questionType = el
      })
      return questionType
    },
  },
  created() {
    this.form = parseQuestionToForm(this.question)
  },
  mounted() {
    this.$v.form.questionNumber.$touch()
  },
  methods: {
    receiveConditions(ev) {
      this.form.branching = ev
    },
  },
}
</script>
