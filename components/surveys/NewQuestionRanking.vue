<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col w-full xl:w-6/12">
      <div class="flex items-center mt-4 mb-2">
        <label class="font-semibold">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options must be filled in</span>
        </span>
      </div>

      <input-base-with-button
        v-for="(option, index) in options"
        :id="'inputOptions' + index"
        :key="option.ordinalPosition"
        v-model="option.text"
        placeholder="Enter option text"
        @keyup="updateValues"
        @change="$v.options.$touch()"
      >
        <template v-slot:button>
          <button-for-input
            text-colour="red"
            :disabled="options.length < 3"
            @click="deleteOptionAtIndex(index)"
          >
            <i class="fas fa-trash-alt fa-fw"></i> </button-for-input
        ></template>
      </input-base-with-button>

      <div class="flex justify-start my-4">
        <button-base @click="addNewOption"> Add New Option </button-base>
      </div>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import ButtonForInput from '~/components/elements/ButtonForInput'
import InputBaseWithButton from '~/components/elements/InputBaseWithButton'
import ButtonBase from '~/components/elements/ButtonBase'
export default {
  name: 'NewQuestionRanking',
  components: { ButtonForInput, InputBaseWithButton, ButtonBase },
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
