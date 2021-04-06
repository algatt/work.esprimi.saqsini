<template>
  <div class="flex flex-col w-full space-y-5">
    <toggle-switch :checked="isList" @clicked="changeView">
      <template v-slot:label
        >Data Input<popup-base class="ml-1 font-normal"
          >You can input data one by one (Individual) or as a comma separated
          list (List).</popup-base
        ></template
      >
      <template v-slot:leftLabel>Individual</template>
      <template v-slot:rightLabel>List</template>
    </toggle-switch>

    <div class="flex flex-col w-full xl:w-6/12">
      <div class="flex items-center mb-2">
        <label class="font-semibold">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options are required</span>
        </span>
      </div>
      <template v-if="!isList">
        <input-base-with-button
          v-for="(option, index) in options"
          :id="'inputOptions' + index"
          :key="option.ordinalPosition"
          v-model="option.text"
          placeholder="Enter option text"
          @input="$v.options.$touch()"
          @keyup="updateValues"
        >
          <template v-slot:button>
            <button-for-input
              text-colour="red"
              :disabled="options.length < 3"
              @click="deleteOptionAtIndex(index)"
            >
              <i class="fas fa-trash-alt fa-fw"></i>
            </button-for-input>
          </template>
        </input-base-with-button>

        <div class="flex justify-start mt-4 mb-4">
          <button-base @click="addNewOption"> Add New Option </button-base>
        </div></template
      >
      <template v-else>
        <text-area-base
          v-model="optionsString"
          class="w-full"
          @input="convertFullString"
        ></text-area-base>
      </template>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import PopupBase from '~/components/elements/PopupBase'
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'
import ButtonForInput from '~/components/elements/ButtonForInput'
import ButtonBase from '~/components/elements/ButtonBase'
import TextAreaBase from '~/components/elements/TextAreaBase'

export default {
  name: 'NewQuestionDropDown',
  components: {
    TextAreaBase,
    PopupBase,
    ToggleSwitch,
    InputBaseWithButton,
    ButtonForInput,
    ButtonBase,
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
      optionsString: '',
      isList: false,
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
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
  watch: {
    options(data) {
      this.options = data
      this.optionsString = ''
      data.forEach((item) => {
        this.optionsString += item.text + '; '
      })
      this.updateValues()
      return this.$emit('updatedOptions', this.options)
    },
    isValid() {
      this.$emit('isValid', !this.$v.$invalid)
    },
  },
  created() {
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Option 1' },
        { ordinalPosition: 2, text: 'Option 2' },
      ]
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
