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
        <button class="btn-primary px-3" @click="addNewOption">Add New</button>
      </div>
    </div>

    <toggle-switch :checked="allowMultiple" @clicked="allowMultiple = $event">
      <template v-slot:label>
        Allow Multiple Answers<popup-info
          ><template v-slot:text
            >Allows the respondent to choose more than one option.</template
          ></popup-info
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>

    <toggle-switch :checked="allowOther" @clicked="allowOther = $event">
      <template v-slot:label>
        Allow Other Entry<popup-info
          ><template v-slot:text
            >Allow the respondent to input another answer not present in the
            given options.</template
          ></popup-info
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
import ToggleSwitch from '~/components/layouts/ToggleSwitch'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionMultipleChoice',
  components: { PopupInfo, ToggleSwitch },
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

    this.allowOther = this.form.allowOther
    this.allowMultiple = this.form.allowMultiple
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
