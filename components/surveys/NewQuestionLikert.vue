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

    <label class="label-required">Options and Weights</label>

    <div
      v-for="(item, index) in options"
      :key="item.ordinalPosition"
      class="flex w-full items-center space-x-2"
    >
      <input
        :id="'inputOptions' + index"
        v-model="item.text"
        class="input mb-2 w-7/12"
        @change="$v.options.$touch()"
      />
      <input
        v-model="item.value"
        class="input mb-2 w-3/12"
        @change="
          sortOptions()
          $v.options.$touch()
        "
      />
      <button
        class="btn-link ml-2"
        :disabled="options.length < 3"
        @click="deleteOptionAtIndex(index)"
      >
        Delete
      </button>
    </div>

    <span v-if="!$v.options.$error">&nbsp;</span>
    <span v-else>
      <span class="error"
        >All values and weights must be filled in. Values must be numeric.</span
      >
    </span>

    <div key="addNewButton" class="flex justify-start mt-2">
      <button class="btn-primary px-3" @click="addNewOption">Add New</button>
    </div>
    <span>&nbsp;</span>

    <toggle-switch
      :checked="form.showWeights"
      @clicked="form.showWeights = $event"
    >
      <template v-slot:label> Display Mode</template>
      <template v-slot:leftLabel>Labels</template>
      <template v-slot:rightLabel>Values</template>
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
  name: 'NewQuestionLikert',
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
        value: {
          required,
          numeric,
        },
      },
    },
  },
  created() {
    this.form = parseQuestionToForm(this.question)
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Strongly Disagree', value: 1 },
        { ordinalPosition: 2, text: 'Disagree', value: 2 },
        { ordinalPosition: 3, text: 'Neutral', value: 3 },
        { ordinalPosition: 4, text: 'Agree', value: 4 },
        { ordinalPosition: 5, text: 'Strongly Agree', value: 5 },
      ]
      this.form.options = this.options
    } else {
      this.options = this.form.options
    }
  },
  methods: {
    addNewOption() {
      let nextValue = this.options.map((el) => {
        return el.value
      })
      nextValue = Math.max(...nextValue) + 1

      this.options.push({
        ordinalPosition: this.options.length + 1,
        text: 'New Option',
        value: nextValue,
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
      this.$nextTick(() => {
        const el = document.getElementById(
          'inputOptions' + (this.options.length - 1)
        )
        el.focus()
        el.select()
      })
    },
    sortOptions() {
      this.options = this.options.sort((a, b) => {
        return Number(a.value) > Number(b.value) ? 1 : -1
      })
      let position = 1
      this.options.forEach((el) => {
        el.ordinalPosition = position++
      })
    },
  },
}
</script>
