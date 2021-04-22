<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col w-full xl:w-6/12">
      <div class="flex items-center">
        <label class="font-semibold mt-4 mb-2">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options must be filled in</span>
        </span>
      </div>
      <div
        v-for="(option, index) in options"
        :key="option.ordinalPosition"
        class="flex w-full mb-1"
      >
        <input-base-with-button
          :id="'inputOptions' + index"
          v-model="option.text"
          class="w-full"
          placeholder="Enter option text"
          @keyup="updateValues"
          @input="$v.options.$touch()"
        >
          <template v-slot:button>
            <button-for-input
              text-colour="red"
              :disabled="options.length < 3"
              @click="deleteOptionAtIndex(index)"
              ><i class="fas fa-trash-alt fa-fw"></i
            ></button-for-input>
          </template>
        </input-base-with-button>
      </div>

      <div class="flex justify-start mt-2 mb-4">
        <button-basic @click="addNewOption"> Add New Option</button-basic>
      </div>
    </div>

    <toggle-switch :checked="allowMultiple" @clicked="allowMultiple = $event">
      <template v-slot:label>
        Allow Multiple Answers<popup-base class="ml-1 font-normal">
          Allows the respondent to choose more than one option.</popup-base
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>

    <toggle-switch :checked="allowOther" @clicked="allowOther = $event">
      <template v-slot:label>
        Allow Other Entry<popup-base class="ml-1 font-normal"
          >Allow the respondent to input another answer not present in the given
          options.</popup-base
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import PopupBase from '~/components/elements/PopupBase'
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'

import ButtonForInput from '~/components/elements/ButtonForInput'

export default {
  name: 'NewQuestionMultipleChoice',
  components: {
    ButtonForInput,
    PopupBase,
    ToggleSwitch,
    InputBaseWithButton,
  },
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
        const el = document
          .getElementById('inputOptions' + (this.options.length - 1))
          .getElementsByTagName('input')[0]
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
