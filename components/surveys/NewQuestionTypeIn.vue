<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <label for="inputNumber" class="label-optional">Number</label>
    <input
      id="inputNumber"
      v-model="form.questionNumber"
      placeholder="Enter question number"
      class="input"
      @change="$v.form.questionNumber.$touch()"
    />
    <span v-if="!$v.form.questionNumber.$error">&nbsp;</span>
    <span v-else>
      <span v-if="!$v.form.questionNumber.required" class="error"
        >The question number is required.</span
      >
      <span v-else-if="!$v.form.questionNumber.numeric" class="error"
        >The question number must be a number.</span
      >
    </span>

    <label for="inputName" class="label-optional">Name</label>
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

    <label for="inputText" class="label-optional">Text</label>
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

    <toggle-switch
      :checked="form.isMandatory"
      @clicked="form.isMandatory = $event"
    >
      <template v-slot:label> Required</template>
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>
    <span>&nbsp;</span>

    <edit-object-modal-bottom-part
      :form="form"
      which="questions"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'NewQuestionTypeIn',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin],
  data() {
    return {
      form: null,
      options: [],
    }
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    isValid() {
      return !this.$v.$invalid
    },
  },

  validations: {
    form: {
      questionNumber: {
        required,
        numeric,
      },
      name: {
        required,
      },
      text: {
        required,
      },
    },
  },
  created() {
    this.form = parseQuestionToForm(this.question)
  },
}
</script>
