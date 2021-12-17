<template>
  <div class="flex flex-col w-full">
    <div class="space-y-5">
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
          Question Name
          <popup-information
            >This is the name of the question used for internal purposes. The
            respondent will not see this.</popup-information
          >
        </span></l-input
      >

      <l-input id="inputDomain" v-model="form.domain"
        ><span class="flex items-center">
          Question Domain
          <popup-information
            >You can assign a label to the question which then can be used for
            reporting.</popup-information
          >
        </span></l-input
      >

      <div class="flex flex-col">
        <label class="font-semibold">Tags</label>
        <div class="flex items-center space-x-3 my-4">
          <span v-if="!form.tags || form.tags.length === 0">No Tags</span>
          <div v-for="(tag, index) in form.tags" :key="index">
            <span
              class="font-medium px-1 py-0.5 bg-gray-100 border border-gray-200 rounded flex items-center"
              >{{ tag
              }}<button
                @click="
                  form.tags = form.tags.filter((el) => {
                    return el !== tag
                  })
                "
              >
                <i class="fas fa-times fa-fw text-gray-400"></i></button
            ></span>
          </div>
        </div>
        <l-input-button
          v-model="tagName"
          placeholder="Tag name"
          :button-disabled="
            tagName.length == 0 ||
            form.tags.includes(tagName.toLowerCase().trim())
          "
          @click="
            form.tags.push(tagName.toLowerCase().trim())
            tagName = ''
          "
          ><i class="fas fa-plus fa-fw"></i
        ></l-input-button>
      </div>

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
          Question Text
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
          Required
          <popup-information>{{ infoRequired }}</popup-information></template
        >
        <template v-slot:leftLabel>No</template>
        <template v-slot:rightLabel>Yes</template>
      </l-toggle>

      <component
        :is="questionTypeComponent"
        :form="form"
        @updatedOptions="form.options = $event"
        @updateAllowOther="form.allowOther = $event"
        @updateAllowMultiple="form.allowMultiple = $event"
        @isValid="isRemainderOfFormValid = $event"
        @updatedShowWeights="form.showWeights = $event"
      ></component>
    </div>
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
import NewQuestionMultipleChoiceImage from '~/components/surveys/NewQuestionMultipleChoiceImage'
import NewQuestionLikert from '~/components/surveys/NewQuestionLikert'
import {
  QUESTION_TYPES,
  QUESTION_HELP,
} from '~/assets/settings/survey-settings'

import QuestionBranching from '~/components/surveys/QuestionBranching'
import NewQuestionRadioGrid from '~/components/surveys/NewQuestionRadioGrid'
import MenuIconButton from '~/components/elements/MenuIconButton'

import { convertQuestionFromApiToForm } from '~/services/question-helpers'

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
      form: {},
      isRemainderOfFormValid: true,
      infoNumber: QUESTION_HELP.NUMBER,
      infoName: QUESTION_HELP.NAME,
      infoText: QUESTION_HELP.TEXT,
      infoRequired: QUESTION_HELP.REQUIRED,
      tagName: '',
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
      const x = this.question.flags

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
  },
  validations: {
    form: {
      name: {
        required,
      },
      text: {
        required,
      },
    },
  },
  created() {
    this.form = convertQuestionFromApiToForm(this.dataItem)
    if (!this.form.tags) this.form.tags = []
  },
  mounted() {
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
}
</script>
