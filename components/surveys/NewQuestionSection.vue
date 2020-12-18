<template>
  <div class="flex flex-col w-full space-y-5">
    <div
      class="w-full flex items-center border-b border-gray-200 space-x-2 mb-1 py-2"
    >
      <button
        class="w-24 text-left font-semibold hover:text-primary focus:outline-none"
        :class="selectedSection === 'details' ? 'text-primary' : null"
        @click="selectedSection = 'details'"
      >
        Details
      </button>
      <button
        class="w-24 text-left font-semibold hover:text-primary focus:outline-none"
        :class="selectedSection === 'branching' ? 'text-primary' : null"
        @click="selectedSection = 'branching'"
      >
        Branching
      </button>
    </div>

    <template v-if="selectedSection === 'details'">
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
    </template>

    <question-branching
      v-else
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
import PopupInfo from '~/components/layouts/PopupInfo'
import questionMixin from '~/helpers/questionMixin'

export default {
  name: 'NewQuestionSection',
  components: { PopupInfo, EditObjectModalBottomPart },
  mixins: [validationMixin, questionMixin],
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
      this.form.branching = ev
    },
  },
}
</script>
