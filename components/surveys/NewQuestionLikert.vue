<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col items-start">
      <div class="flex items-center">
        <label class="font-semibold flex items-center"
          >Options and Weights
          <popup-information>
            Here you can set the text (option) for all options. <br />Every
            option must be assigned a numeric weight.</popup-information
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
        <l-input
          :id="'inputOptions' + index"
          v-model="item.text"
          class="flex flex-1"
          @input="$v.options.$touch()"
        />
        <l-input-button
          v-model="item.value"
          class="input w-2/12 text-center"
          button-color="red"
          :button-disabled="options.length < 3"
          @click="deleteOptionAtIndex(index)"
          @input="$v.options.$touch()"
          @blur="sortOptions()"
          ><i class="fas fa-trash-alt fa-fw"></i
        ></l-input-button>
      </div>

      <div key="addNewButton" class="flex justify-start my-4">
        <l-button @click="addNewOption"> Add New Option </l-button>
      </div>
    </div>

    <l-toggle
      :checked="showWeights"
      :change-color="false"
      @clicked="showWeights = $event"
    >
      <template v-slot:label
        >Display Mode<popup-information>
          You can choose to display the labels or values. <br />If values are
          chosen only the labels at each end will be
          displayed.</popup-information
        ></template
      >
      <template v-slot:leftLabel>Labels</template>
      <template v-slot:rightLabel>Values</template>
    </l-toggle>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'

export default {
  name: 'NewQuestionLikert',
  mixins: [validationMixin],
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
