<template>
  <div class="flex flex-col w-full space-y-5">
    <div class="flex flex-col w-full">
      <div class="flex items-center">
        <label class="font-semibold">Options</label>
        <span v-if="$v.options.$error" class="flex items-center">
          <span class="error">all options must be filled in</span>
        </span>
      </div>
      <div class="flex flex-wrap w-full mb-1">
        <div
          v-for="(option, index) in options"
          :key="option.ordinalPosition"
          class="flex flex-col w-full md:w-4/12 px-5"
        >
          <l-input-button
            :id="'inputOptions' + index"
            v-model="option.text"
            :button-disabled="options.length < 3"
            button-color="red"
            placeholder="Enter option text"
            @click="deleteOptionAtIndex(index)"
            @keyup="updateValues"
            @input="$v.options.$touch()"
          >
            <i class="fas fa-trash-alt fa-fw"></i>
          </l-input-button>
          <label class="w-full mt-4 flex flex-col items-center justify-center">
            <div class="w-full flex justify-center items-center h-24">
              <i
                v-if="!option.surveyOptions.image"
                class="far fa-image fa-fw fa-3x text-gray-400 hover:text-primary cursor-pointer"
              ></i>
              <img
                v-else
                :src="option.surveyOptions.image"
                class="w-24 h-24 object-contain transition duration-300 cursor-pointer"
              />
            </div>
            <input
              type="file"
              style="visibility: hidden"
              class="h-0"
              @change="updateImage($event, index)"
            />
          </label>
        </div>
      </div>

      <div class="flex justify-start mt-2 mb-4">
        <l-button @click="addNewOption"> Add New Option</l-button>
      </div>
    </div>

    <l-toggle :checked="allowMultiple" @clicked="allowMultiple = $event">
      <template v-slot:label>
        Allow Multiple Answers<popup-information>
          Allows the respondent to choose more than one
          option.</popup-information
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </l-toggle>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required } from 'vuelidate/lib/validators'
import { resizeImage } from '~/services/image-helpers'

export default {
  name: 'NewQuestionMultipleChoiceImage',
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
      totalImages: 0,
    }
  },
  computed: {
    totalOptions() {
      return this.options.length
    },

    isValid() {
      return (
        !this.$v.$invalid &&
        this.totalOptions > 1 &&
        this.totalOptions === this.totalImages
      )
    },
  },
  watch: {
    options: {
      handler() {
        this.updateValues()
        this.$emit('updatedOptions', this.options)
      },
      deep: true,
    },
    allowMultiple(ev) {
      this.$emit('updateAllowMultiple', ev)
    },

    isValid: {
      handler() {
        this.$emit('isValid', this.isValid)
      },
      deep: true,
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
      this.options = []
      this.totalImages = 0
      this.options.push(
        {
          ordinalPosition: this.options.length + 1,
          text: 'New Option',
          surveyOptions: {},
        },
        {
          ordinalPosition: this.options.length + 1,
          text: 'New Option',
          surveyOptions: {},
        }
      )
    } else {
      this.options = this.form.options
      this.totalImages = this.options.length
    }

    this.allowMultiple =
      this.form.allowMultiple === undefined ? true : this.form.allowMultiple
  },

  methods: {
    addNewOption() {
      this.options.push({
        ordinalPosition: this.options.length + 1,
        text: 'New Option',
        surveyOptions: {},
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
      this.totalImages--
    },
    updateValues() {
      this.options.forEach((item) => {
        item.value = item.text
      })
    },
    async updateImage(event, index) {
      if (!event.target.files[0]) return

      this.options[index].surveyOptions.image = await resizeImage(
        event.target.files[0],
        480,
        480
      )
      this.totalImages++
      this.$forceUpdate()
    },
  },
}
</script>
