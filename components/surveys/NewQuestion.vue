<template>
  <div class="flex flex-col space-y-5">
    <div class="w-full flex items-center mb-1">
      <button
        class="w-24 text-center font-semibold hover:text-primary focus:outline-none py-2 border-b-2"
        :class="
          selectedSection === 'details'
            ? 'text-primary border-primary'
            : 'border-gray-200'
        "
        @click="selectedSection = 'details'"
      >
        Details
      </button>
      <button
        class="w-24 text-center font-semibold hover:text-primary focus:outline-none py-2 border-b-2"
        :class="
          selectedSection === 'branching'
            ? 'text-primary border-primary'
            : 'border-gray-200'
        "
        @click="selectedSection = 'branching'"
      >
        Branching
      </button>
    </div>

    <template v-if="selectedSection === 'details'">
      <div class="flex flex-col">
        <div class="flex items-center">
          <label for="inputNumber" class="label">Question Number</label>
          <span v-if="$v.form.questionNumber.$error">
            <span v-if="!$v.form.questionNumber.required" class="error"
              >required</span
            >
            <span v-if="!$v.form.questionNumber.duplicate" class="error"
              >already used</span
            >
          </span>
          <popup-info
            ><template v-slot:text
              >This is the question number used for internal purposes. The
              respondent will not see this.
            </template></popup-info
          >
        </div>
        <input
          id="inputNumber"
          v-model="form.questionNumber"
          placeholder="Enter question number"
          class="input w-full md:w-10/12"
          @change="$v.form.questionNumber.$touch()"
        />
      </div>

      <div class="flex flex-col">
        <div class="flex items-center">
          <label for="inputName" class="label">Name</label>
          <span v-if="$v.form.name.$error">
            <span v-if="!$v.form.name.required" class="error">required</span>
          </span>
          <popup-info
            ><template v-slot:text
              >This is the name of the section used for internal purposes. The
              respondent will not see this.
            </template></popup-info
          >
        </div>
        <input
          id="inputName"
          v-model="form.name"
          placeholder="Enter question name"
          class="input w-full md:w-10/12"
          @change="$v.form.name.$touch()"
        />
      </div>

      <div class="flex flex-col">
        <div class="flex items-center">
          <label for="inputText" class="label">Text</label>
          <span v-if="$v.form.text.$error">
            <span v-if="!$v.form.text.required" class="error">required</span>
          </span>
          <popup-info
            ><template v-slot:text
              >This page text will be seen by the respondent.</template
            ></popup-info
          >
        </div>
        <input
          id="inputText"
          v-model="form.text"
          placeholder="Enter question text"
          class="input w-full md:w-10/12"
          @change="$v.form.text.$touch()"
        />
      </div>

      <toggle-switch
        v-if="questionType !== 'SECTION'"
        :checked="form.isMandatory"
        @clicked="form.isMandatory = $event"
      >
        <template v-slot:label>
          Required
          <popup-info
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
    </template>

    <question-branching
      v-else
      :existing-conditions="form.branching"
      @conditions="receiveConditions"
    ></question-branching>
    <edit-object-modal-bottom-part
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

export default {
  name: 'NewQuestion',
  components: {
    EditObjectModalBottomPart,
    QuestionBranching,
    NewQuestionRanking,
    NewQuestionTypeIn,
    NewQuestionDropDown,
    NewQuestionSection,
    NewQuestionLikert,
    NewQuestionMultipleChoice,
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
  methods: {
    receiveConditions(ev) {
      this.form.branching = ev
    },
  },
}
</script>
