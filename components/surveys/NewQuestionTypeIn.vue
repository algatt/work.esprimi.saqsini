<template>
  <div class="flex flex-col w-full space-y-5">
    <!--    <div class="flex flex-col">-->
    <!--      <div class="flex items-center">-->
    <!--        <label for="inputNumber" class="label">Number</label>-->
    <!--        <span v-if="$v.form.questionNumber.$error">-->
    <!--          <span v-if="!$v.form.questionNumber.required" class="error"-->
    <!--            >required</span-->
    <!--          >-->
    <!--          <span v-else-if="!$v.form.questionNumber.numeric" class="error"-->
    <!--            >must be a number</span-->
    <!--          >-->
    <!--        </span>-->
    <!--        <popup-info-->
    <!--          ><template v-slot:text>{{ infoNumber }}</template></popup-info-->
    <!--        >-->
    <!--      </div>-->
    <!--      <input-->
    <!--        id="inputNumber"-->
    <!--        v-model="form.questionNumber"-->
    <!--        placeholder="Enter question number"-->
    <!--        class="input"-->
    <!--        @change="$v.form.questionNumber.$touch()"-->
    <!--      />-->
    <!--    </div>-->

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputName" class="label">Name</label
        ><span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error">required</span>
        </span>
        <popup-info
          ><template v-slot:text>{{ infoName }}</template></popup-info
        >
      </div>
      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter question name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputText" class="label">Text</label>
        <span v-if="$v.form.text.$error">
          <span v-if="!$v.form.text.required" class="error"
            >The question text is required.</span
          >
        </span>
        <popup-info
          ><template v-slot:text>{{ infoText }}</template></popup-info
        >
      </div>
      <input
        id="inputText"
        v-model="form.text"
        placeholder="Enter question text"
        class="input"
        @change="$v.form.text.$touch()"
      />
    </div>

    <toggle-switch
      :checked="form.isMandatory"
      @clicked="form.isMandatory = $event"
    >
      <template v-slot:label
        >Required<popup-info
          ><template v-slot:text>{{ infoRequired }}</template></popup-info
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>

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
import questionMixin from '~/helpers/questionMixin'

export default {
  name: 'NewQuestionTypeIn',
  components: { EditObjectModalBottomPart },
  mixins: [validationMixin, questionMixin],
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
