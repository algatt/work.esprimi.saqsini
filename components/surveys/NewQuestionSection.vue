<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <label for="inputName" class="label-required">Name</label>
    <input
      id="inputName"
      v-model="form.name"
      placeholder="Enter question name"
      class="input"
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
      class="input"
      @change="$v.form.text.$touch()"
    />
    <span v-if="!$v.form.text.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.text.required" class="error"
        >The question text is required.</span
      >
    </span>

    <slot name="otherFields"></slot>

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

export default {
  name: 'NewQuestionSection',
  components: { EditObjectModalBottomPart },
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
}
</script>
