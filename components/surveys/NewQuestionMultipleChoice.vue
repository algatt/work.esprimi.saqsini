<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
    <template v-if="!question.flags.includes('SECTION')">
      <label for="inputNumber" class="label-required">Number</label>
      <input
        id="inputNumber"
        v-model="form.questionNumber"
        placeholder="Enter question number"
        class="input"
        @change="$v.form.questionNumber.$touch()"
      />
      <span v-if="!$v.form.questionNumber.$error">&nbsp;</span>
      <span v-else>
        <span v-if="!$v.form.questionNumber.requiredIf" class="error"
          >The question number is required.</span
        >
      </span>
    </template>

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

    <label class="label-required">Options</label>
    <div
      v-for="(option, index) in form.options"
      :key="index"
      class="flex items-center mb-2"
    >
      <input
        :id="'inputOptions' + index"
        v-model="option.text"
        placeholder="Enter option text"
        class="input w-7/12"
      />
      <button
        class="btn-link ml-2"
        :disabled="form.options.length < 3"
        @click="deleteOptionAtIndex(index)"
      >
        Delete
      </button>
    </div>
    <div class="flex justify-start">
      <button class="btn-primary px-3" @click="addNewOption">Add New</button>
    </div>
    <span>&nbsp;</span>

    <toggle-switch
      :checked="form.allowMultiple"
      @clicked="form.allowMultiple = $event"
    >
      <template v-slot:label> Allow Multiple Answers</template>
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>
    <span>&nbsp;</span>

    <toggle-switch
      :checked="form.allowOther"
      @clicked="form.allowOther = $event"
    >
      <template v-slot:label> Allow Other Entry</template>
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
import { required } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'

export default {
  name: 'NewQuestionMultipleChoice',
  components: { ToggleSwitch, EditObjectModalBottomPart },
  mixins: [validationMixin],
  data() {
    return {
      form: null,
    }
  },

  validations: {
    form: {
      questionNumber: {
        requiredIf(value) {
          if (this.form.flags.includes('SECTION')) return true
          if (!this.form.flags.includes('SECTION') && value && value !== '')
            return true
          return false
        },
      },
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

    if (!this.form.options) {
      this.form.options = [
        { ordinalPosition: 1, text: 'Option 1' },
        { ordinalPosition: 2, text: 'Option 2' },
      ]
    }
  },
  methods: {
    addNewOption() {
      this.form.options.push({
        ordinalPosition: this.form.options.length + 1,
        text: 'New Option',
      })
      this.$forceUpdate()
      this.$nextTick(() => {
        const el = document.getElementById(
          'inputOptions' + (this.form.options.length - 1)
        )
        el.focus()
        el.select()
      })
    },
    deleteOptionAtIndex(index) {
      this.form.options.splice(index, 1)
      let position = 1
      this.form.options.forEach((el) => {
        el.ordinalPosition = position++
      })
      this.$forceUpdate()
    },
    test(ev) {
      console.log(ev)
    },
  },
}
</script>
