<template>
  <div class="flex flex-col w-full space-y-5">
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

    <!--    <question-branching-->
    <!--      v-if="question.ordinalPosition !== 1"-->
    <!--      :existing-conditions="form.branching"-->
    <!--      @conditions="receiveConditions"-->
    <!--    ></question-branching>-->

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
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionSection',
  components: { PopupInfo, EditObjectModalBottomPart },
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
    if (!this.form.branching)
      this.form.branching = {
        rules: [],
        allMustBeMet: false,
      }
  },
  methods: {
    receiveConditions(ev) {
      console.log(ev)
      this.form.branching = ev
    },
  },
}
</script>
