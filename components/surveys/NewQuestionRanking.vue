<template>
  <div class="flex flex-col w-full md:w-10/12 pb-32">
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
      <span v-if="!$v.form.questionNumber.required" class="error"
        >The question number is required.</span
      >
      <span v-else-if="!$v.form.questionNumber.numeric" class="error"
        >The question number must be a number.</span
      >
    </span>

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
    <span v-if="!$v.options.$error">&nbsp;</span>
    <span v-else>
      <span class="error">All options must be filled in.</span>
    </span>
    <div class="flex justify-start mt-2">
      <button class="btn-primary px-3" @click="addNewOption">Add New</button>
    </div>
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
  name: 'NewQuestionRanking',
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
  },
}
</script>
