<template>
  <div class="flex flex-col w-full space-y-5">
    <l-input
      id="inputMaxChoice"
      v-model="maxChoice"
      :error="
        $v.maxChoice.$model !== undefined
          ? !$v.maxChoice.required
            ? 'required'
            : !$v.maxChoice.numeric
            ? 'must be a number'
            : !$v.maxChoice.between
            ? `must be between 1 and ${this.options.length}`
            : null
          : null
      "
      @change="$v.maxChoice.$touch()"
      ><span class="flex items-center">
        Maximum Choices Allowed
        <popup-information
          >A limit can be set on the number of choices that can be
          selected.</popup-information
        >
      </span></l-input
    >

    <div class="flex items-center mt-4">
      <label class="font-semibold">Options</label>
      <span v-if="$v.options.$invalid">
        <span class="error">all options must be filled in</span>
      </span>
    </div>

    <div class="flex flex-col space-y-2">
      <l-input-button
        v-for="(option, index) in options"
        :id="'inputOptions' + index"
        :key="option.ordinalPosition"
        v-model="option.text"
        placeholder="Enter option text"
        button-color="red"
        :button-disabled="options.length < 3"
        @keyup="updateValues"
        @change="$v.options.$touch"
        @click="deleteOptionAtIndex(index)"
      >
        <i class="fas fa-trash-alt fa-fw"></i>
      </l-input-button>
    </div>
    <div class="flex justify-start">
      <l-button @click="addNewOption"> Add New Option </l-button>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric, between } from 'vuelidate/lib/validators'

export default {
  name: 'NewQuestionRanking',
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
      maxChoice: 0,
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
    maxChoice(ev) {
      this.$emit('updateMaxChoice', ev)
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
    maxChoice: {
      required,
      numeric,
      between(value) {
        return between(1, this.options.length)(value)
      },
    },
  },
  created() {
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Option 1', value: 'Option 1' },
        { ordinalPosition: 2, text: 'Option 2', value: 'Option 2' },
      ]
      this.maxChoice = this.options.length
    } else {
      this.options = this.form.options
      this.maxChoice = this.form.maxChoice
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
  },
}
</script>
