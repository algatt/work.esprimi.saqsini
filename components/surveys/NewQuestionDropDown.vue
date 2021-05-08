<template>
  <div class="flex flex-col w-full space-y-5">
    <l-toggle :checked="isList" :change-color="false" @clicked="changeView">
      <template v-slot:label
        >Data Input<popup-information
          >You can input data one by one (Individual) or as a comma separated
          list (List).</popup-information
        ></template
      >
      <template v-slot:leftLabel>Individual</template>
      <template v-slot:rightLabel>List</template>
    </l-toggle>

    <div class="flex flex-col w-full">
      <div class="flex items-center mb-2">
        <label class="font-semibold">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options are required</span>
        </span>
      </div>
      <template v-if="!isList">
        <l-input-button
          v-for="(option, index) in options"
          :id="'inputOptions' + index"
          :key="index"
          v-model="option.text"
          button-color="red"
          placeholder="Enter option text"
          :button-disabled="options.length < 3"
          @input="$v.options.$touch()"
          @keyup="updateValues"
          @click="deleteOptionAtIndex(index)"
        >
          <i class="fas fa-trash-alt fa-fw"></i>
        </l-input-button>

        <div class="flex justify-start mt-4 mb-4">
          <l-button @click="addNewOption"> Add New Option </l-button>
        </div></template
      >
      <template v-else>
        <l-text-area
          v-model="optionsString"
          class="w-full"
          @blur="convertFullString"
        ></l-text-area>
      </template>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

export default {
  name: 'NewQuestionDropDown',
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
    changeView(state) {
      this.isList = state
    },
    convertFullString() {
      this.options = []
      let position = 1
      const splitData = this.optionsString.split('; ')
      for (const i in splitData) {
        const item = splitData[i]
        if (item !== '') {
          this.options.push({
            ordinalPosition: position++,
            text: item,
            value: item,
          })
        }
      }
      if (this.options.length < 2) {
        for (let i = this.options.length; i < 2; i++) {
          this.options.push({
            ordinalPosition: position,
            text: `Option ${position}`,
            value: `Option ${position}`,
          })
          position++
        }
      }
    },
  },
}
</script>
