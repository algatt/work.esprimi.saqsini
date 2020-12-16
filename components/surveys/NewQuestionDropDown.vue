<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputNumber" class="label">Number</label>
        <span v-if="$v.form.questionNumber.$error">
          <span v-if="!$v.form.questionNumber.required" class="error"
            >required</span
          >
          <span v-else-if="!$v.form.questionNumber.numeric" class="error"
            >must be a number</span
          >
        </span>
        <popup-info
          ><template v-slot:text>{{ infoNumber }}</template></popup-info
        >
      </div>
      <input
        id="inputNumber"
        v-model="form.questionNumber"
        placeholder="Enter question number"
        class="input"
        @change="$v.form.questionNumber.$touch()"
      />
    </div>

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

    <toggle-switch :checked="isList" @clicked="changeView">
      <template v-slot:label
        >Data Input<popup-info
          ><template v-slot:text
            >You can input data one by one (Individual) or as a comma separated
            list (List).</template
          ></popup-info
        ></template
      >
      <template v-slot:leftLabel>Individual</template>
      <template v-slot:rightLabel>List</template>
    </toggle-switch>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label class="label">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options are required</span>
        </span>
      </div>
      <template v-if="!isList">
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
        </div></template
      >
      <template v-else>
        <textarea
          v-model="optionsString"
          class="input"
          @change="convertFullString"
        ></textarea>
      </template>
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
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionDropDown',
  components: { PopupInfo, EditObjectModalBottomPart },
  mixins: [validationMixin, questionMixin],
  data() {
    return {
      form: null,
      options: [],
      optionsString: '',
      isList: false,
    }
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
      this.optionsString = ''
      data.forEach((item) => {
        this.optionsString += item.text + '; '
      })
      this.updateValues()
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
    changeView(state) {
      this.isList = state
    },
    convertFullString() {
      this.options = []
      let position = 1
      const splitData = this.optionsString.split('; ')
      splitData.forEach((item) => {
        this.options.push({
          ordinalPosition: position++,
          text: item,
          value: item,
        })
      })
    },
  },
}
</script>
