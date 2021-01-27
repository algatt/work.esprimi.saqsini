<template>
  <div class="flex flex-col w-full space-y-5">
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
          :disabled="options.length < 3"
          @click="deleteOptionAtIndex(index)"
        >
          Delete
        </button>
      </div>

      <div class="flex justify-start mt-2">
        <button class="btn btn-primary px-3" @click="addNewOption">
          Add New
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'

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
        { ordinalPosition: 1, text: 'Option 1', value: 'Option 1' },
        { ordinalPosition: 2, text: 'Option 2', value: 'Option 2' },
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
  },
}
</script>
