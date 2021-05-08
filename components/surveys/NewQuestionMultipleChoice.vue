<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col w-full">
      <div class="flex items-center">
        <label class="font-semibold">Options</label>
        <span v-if="$v.options.$error" class="flex items-center">
          <span class="error">all options must be filled in</span>
        </span>
      </div>
      <div
        v-for="(option, index) in options"
        :key="option.ordinalPosition"
        class="flex w-full mb-1"
      >
        <l-input-button
          :id="'inputOptions' + index"
          v-model="option.text"
          :button-disabled="options.length < 3"
          button-color="red"
          class="w-full"
          placeholder="Enter option text"
          @click="deleteOptionAtIndex(index)"
          @keyup="updateValues"
          @input="$v.options.$touch()"
        >
          <i class="fas fa-trash-alt fa-fw"></i>
        </l-input-button>
      </div>

      <div class="flex justify-start mt-2 mb-4">
        <l-button @click="addNewOption"> Add New Option</l-button>
      </div>
    </div>

    <l-toggle :checked="allowMultiple" @clicked="allowMultiple = $event">
      <template v-slot:label>
        Allow Multiple Answers<popup-information>
          Allows the respondent to choose more than one
          option.</popup-information
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </l-toggle>

    <l-toggle :checked="allowOther" @clicked="allowOther = $event">
      <template v-slot:label>
        Allow Other Entry<popup-information
          >Allow the respondent to input another answer not present in the given
          options.</popup-information
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </l-toggle>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'NewQuestionMultipleChoice',
  mixins: [validationMixin],
  props: {
    form: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      options: [],
      allowMultiple: false,
      allowOther: false,
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },
  },
  watch: {
    options() {
      this.updateValues()
      this.$emit('updatedOptions', this.options)
    },
    allowMultiple(ev) {
      this.$emit('updateAllowMultiple', ev)
    },
    allowOther(ev) {
      this.$emit('updateAllowOther', ev)
    },
    isValid() {
      this.$emit('isValid', !this.$v.$invalid)
    },
  },
  validations: {
    options: {
      $each: {
        text: {
          required,
        },
      },
    },
  },
  created() {
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Yes', value: 'Yes' },
        { ordinalPosition: 2, text: 'No', value: 'No' },
      ]
    } else {
      this.options = this.form.options
    }

    this.allowOther =
      this.form.allowOther === undefined ? true : this.form.allowOther
    this.allowMultiple =
      this.form.allowMultiple === undefined ? true : this.form.allowMultiple
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
      this.options.forEach((item) => {
        item.value = item.text
      })
    },
  },
}
</script>
