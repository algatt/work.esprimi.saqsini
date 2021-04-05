<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col w-full xl:w-6/12">
      <div class="flex items-center mt-3 mb-2">
        <label class="font-semibold flex items-center"
          >Options and Weights
          <popup-base class="ml-1 font-normal">
            Here you can set the text (option) for all options. <br />Every
            option must be assigned a numeric weight.</popup-base
          ></label
        >
        <span v-if="$v.options.$error">
          <span class="error"
            >all options and weights (numeric) must be filled in</span
          >
        </span>
      </div>
      <div
        v-for="(item, index) in options"
        :key="item.ordinalPosition"
        class="flex w-full items-start space-x-2"
      >
        <input-base
          :id="'inputOptions' + index"
          v-model="item.text"
          class="flex flex-1"
          @input="$v.options.$touch()"
        />
        <input-base
          v-model="item.value"
          class="input w-2/12 text-center"
          @input="$v.options.$touch()"
          @blur="sortOptions()"
        />
        <button-for-input
          bg-colour="red"
          class="mt-3 rounded"
          :disabled="options.length < 3"
          @click="deleteOptionAtIndex(index)"
        >
          <i class="fas fa-trash-alt"></i>
        </button-for-input>
      </div>

      <div key="addNewButton" class="flex justify-start my-4">
        <button-base @click="addNewOption"> Add New Option </button-base>
      </div>
    </div>

    <toggle-switch :checked="showWeights" @clicked="showWeights = $event">
      <template v-slot:label
        >Display Mode<popup-base class="ml-1 font-normal">
          You can choose to display the labels or values. <br />If values are
          chosen only the labels at each end will be displayed.</popup-base
        ></template
      >
      <template v-slot:leftLabel>Labels</template>
      <template v-slot:rightLabel>Values</template>
    </toggle-switch>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'
import questionMixin from '~/helpers/questionMixin'
import PopupBase from '~/components/elements/PopupBase'
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import InputBase from '~/components/elements/InputBase'
import ButtonForInput from '~/components/elements/ButtonForInput'
import ButtonBase from '~/components/elements/ButtonBase'

export default {
  name: 'NewQuestionLikert',
  components: {
    ButtonForInput,
    PopupBase,
    ToggleSwitch,
    InputBase,
    ButtonBase,
  },
  mixins: [validationMixin, questionMixin],
  props: {
    form: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      options: [],
      showWeights: false,
    }
  },
  computed: {
    isValid() {
      return !this.$v.$invalid
    },
  },
  watch: {
    options() {
      this.$emit('updatedOptions', this.options)
    },
    showWeights() {
      this.$emit('updatedShowWeights', this.showWeights)
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
        value: {
          required,
          numeric,
        },
      },
    },
  },
  created() {
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Strongly Disagree', value: 1 },
        { ordinalPosition: 2, text: 'Disagree', value: 2 },
        { ordinalPosition: 3, text: 'Neutral', value: 3 },
        { ordinalPosition: 4, text: 'Agree', value: 4 },
        { ordinalPosition: 5, text: 'Strongly Agree', value: 5 },
      ]
    } else {
      this.options = this.form.options
    }

    this.showWeights = this.form.showWeights
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
      this.$nextTick(() => {
        const el = document
          .getElementById('inputOptions' + (this.options.length - 1))
          .getElementsByTagName('input')[0]
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
