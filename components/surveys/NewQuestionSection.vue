<template>
  <div class="flex flex-col w-full pb-32">
    <label for="inputName" class="label-required">Name</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter question name"
      class="input w-full md:w-10/12"
      @change="$v.form.name.$touch()"
    />
    <span v-if="!$v.form.name.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.name.required" class="error"
        >The name is required.</span
      >
    </span>

    <label for="inputText" class="label-required">Text</label>
    <input
      id="inputText"
      v-model="form.text"
      placeholder="Enter question text"
      class="input w-full md:w-10/12"
      @change="$v.form.text.$touch()"
    />
    <span v-if="!$v.form.text.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.text.required" class="error"
        >The question text is required.</span
      >
    </span>

    <question-branching
      v-if="question.ordinalPosition !== 1"
      :existing-conditions="form.branching"
      @conditions="receiveConditions"
    ></question-branching>

    <edit-object-modal-bottom-part
      :form="form"
      which="questions"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import QuestionBranching from '~/components/surveys/QuestionBranching'

export default {
  name: 'NewQuestionSection',
  components: { QuestionBranching, EditObjectModalBottomPart },
  mixins: [validationMixin],
  data() {
    return {
      form: null,
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
    },
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    isValid() {
      return !this.$v.$invalid
    },
  },
  created() {
    this.form = parseQuestionToForm(this.question)
  },
  methods: {
    receiveConditions(ev) {
      console.log(ev)
      this.form.branching = ev
    },
  },
}
</script>
