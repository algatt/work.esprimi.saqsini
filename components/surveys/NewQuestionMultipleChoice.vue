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

      <div class="flex flex-col">
        <div class="flex items-center">
          <label class="label">Options</label>
          <span v-if="$v.options.$error">
            <span class="error">all options must be filled in</span>
          </span>
        </div>
        <div
          v-for="(option, index) in options"
          :key="option.ordinalPosition"
          class="flex items-center mb-2"
        >
          <input
            :id="'inputOptions' + index"
            v-model="option.text"
            placeholder="Enter option text"
            class="input w-7/12"
            @keyup="updateValues"
            @change="$v.options.$touch()"
          />
          <button
            class="btn-link ml-2"
            :disabled="form.options.length < 3"
            @click="deleteOptionAtIndex(index)"
          >
            Delete
          </button>
        </div>

        <div class="flex justify-start mt-2">
          <button class="btn-primary px-3" @click="addNewOption">
            Add New
          </button>
        </div>
      </div>

      <toggle-switch
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

      <toggle-switch
        :checked="form.allowMultiple"
        @clicked="form.allowMultiple = $event"
      >
        <template v-slot:label>
          Allow Multiple Answers<popup-info
            ><template v-slot:text
              >Allows the respondent to choose more than one option.</template
            ></popup-info
          ></template
        >
        <template v-slot:leftLabel>No</template>
        <template v-slot:rightLabel>Yes</template>
      </toggle-switch>

      <toggle-switch
        :checked="form.allowOther"
        @clicked="form.allowOther = $event"
      >
        <template v-slot:label>
          Allow Other Entry<popup-info
            ><template v-slot:text
              >Allow the respondent to input another answer not present in the
              given options.</template
            ></popup-info
          ></template
        >
        <template v-slot:leftLabel>No</template>
        <template v-slot:rightLabel>Yes</template>
      </toggle-switch>
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
import questionMixin from '@/helpers/questionMixin'
import { required, numeric } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionMultipleChoice',
  components: { PopupInfo, ToggleSwitch, EditObjectModalBottomPart },
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
  watch: {
    options(data) {
      this.form.options = data
      this.updateValues()
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
    options: {
      $each: {
        text: {
          required,
        },
      },
    },
  },
  created() {
    this.form = parseQuestionToForm(this.question)

    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Option 1' },
        { ordinalPosition: 2, text: 'Option 2' },
      ]
      this.form.options = this.options
    } else {
      this.options = this.form.options
    }

    if (!this.form.branching)
      this.form.branching = {
        rules: [],
        allMustBeMet: false,
      }
  },
  methods: {
    addNewOption() {
      this.options.push({
        ordinalPosition: this.options.length + 1,
        text: 'New Option',
      })

      this.$nextTick(() => {
        const el = document.getElementById(
          'inputOptions' + (this.options.length - 1)
        )
        el.focus()
        el.select()
      })
    },
    deleteOptionAtIndex(index) {
      this.options.splice(index, 1)
      let position = 1
      this.options.forEach((el) => {
        el.ordinalPosition = position++
      })
    },
    updateValues() {
      this.form.options.forEach((item) => {
        item.value = item.text
      })
    },
    receiveConditions(ev) {
      this.form.branching = ev
    },
  },
}
</script>
