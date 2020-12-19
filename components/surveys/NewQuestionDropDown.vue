<template>
  <div class="flex flex-col w-full space-y-5">
    <toggle-switch :checked="isList" @clicked="changeView">
      <template v-slot:label
        >Data Input<popup-info
          ><template v-slot:text
            >You can input data one by one (Individual) or as a comma separated
            list (List).</template
          ></popup-info
        ></template
      >
      <template v-slot:leftLabel>Individual</template>
      <template v-slot:rightLabel>List</template>
    </toggle-switch>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label class="label">Options</label>
        <span v-if="$v.options.$error">
          <span class="error">all options are required</span>
        </span>
      </div>
      <template v-if="!isList">
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
          <button class="btn-primary px-3" @click="addNewOption">
            Add New
          </button>
        </div></template
      >
      <template v-else>
        <textarea
          v-model="optionsString"
          class="input"
          @change="convertFullString"
        ></textarea>
      </template>
    </div>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionDropDown',
  components: { PopupInfo },
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
