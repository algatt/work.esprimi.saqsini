<template>
  <div class="flex flex-col w-full space-y-5">
    <!--    <div class="flex flex-col">-->
    <!--      <div class="flex items-center">-->
    <!--        <label for="inputNumber" class="label">Number</label>-->
    <!--        <span v-if="$v.form.questionNumber.$error">-->
    <!--          <span v-if="!$v.form.questionNumber.required" class="error"-->
    <!--            >required</span-->
    <!--          >-->
    <!--          <span v-else-if="!$v.form.questionNumber.numeric" class="error"-->
    <!--            >must be a number</span-->
    <!--          >-->
    <!--        </span>-->
    <!--        <popup-info-->
    <!--          ><template v-slot:text>{{ infoNumber }}</template></popup-info-->
    <!--        >-->
    <!--      </div>-->
    <!--      <input-->
    <!--        id="inputNumber"-->
    <!--        v-model="form.questionNumber"-->
    <!--        placeholder="Enter question number"-->
    <!--        class="input"-->
    <!--        @change="$v.form.questionNumber.$touch()"-->
    <!--      />-->
    <!--    </div>-->

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputName" class="label">Name</label>
        <span v-if="$v.form.name.$error">
          <span v-if="!$v.form.name.required" class="error">required</span>
        </span>
        <popup-info
          ><template v-slot:text>{{ infoName }}</template></popup-info
        >
      </div>
      <input
        id="inputName"
        v-model="form.name"
        placeholder="Enter question name"
        class="input"
        @change="$v.form.name.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label for="inputText" class="label">Text</label>
        <span v-if="$v.form.text.$error">
          <span v-if="!$v.form.text.required" class="error">required</span>
        </span>
        <popup-info
          ><template v-slot:text>{{ infoText }}</template></popup-info
        >
      </div>
      <input
        id="inputText"
        v-model="form.text"
        placeholder="Enter question text"
        class="input"
        @change="$v.form.text.$touch()"
      />
    </div>

    <div class="flex flex-col">
      <div class="flex items-center">
        <label class="label">Options and Weights</label>
        <span v-if="$v.options.$error">
          <span class="error"
            >all options and weights (numeric) must be filled in</span
          >
        </span>
        <popup-info
          ><template v-slot:text
            >Here you can set the text (option) for all options. <br />Every
            option must be assigned a numeric weight.</template
          ></popup-info
        >
      </div>
      <div
        v-for="(item, index) in options"
        :key="item.ordinalPosition"
        class="flex w-full items-center space-x-2 mb-1"
      >
        <input
          :id="'inputOptions' + index"
          v-model="item.text"
          class="input mb-2 w-7/12"
          @change="$v.options.$touch()"
        />
        <input
          v-model="item.value"
          class="input mb-2 w-2/12 text-center"
          @change="
            sortOptions()
            $v.options.$touch()
          "
        />
        <button
          class="btn-link ml-2"
          :disabled="options.length < 3"
          @click="deleteOptionAtIndex(index)"
        >
          Delete
        </button>
      </div>

      <div key="addNewButton" class="flex justify-start mt-2">
        <button class="btn-primary px-3" @click="addNewOption">Add New</button>
      </div>
    </div>

    <toggle-switch
      :checked="form.isMandatory"
      @clicked="form.isMandatory = $event"
    >
      <template v-slot:label>
        Required<popup-info
          ><template v-slot:text>{{ infoRequired }}</template></popup-info
        ></template
      >
      <template v-slot:leftLabel>No</template>
      <template v-slot:rightLabel>Yes</template>
    </toggle-switch>

    <toggle-switch
      :checked="form.showWeights"
      @clicked="form.showWeights = $event"
    >
      <template v-slot:label
        >Display Mode<popup-info
          ><template v-slot:text
            >You can choose to display the labels or values. <br />If values are
            chosen only the labels at each end will be displayed.</template
          ></popup-info
        ></template
      >
      <template v-slot:leftLabel>Labels</template>
      <template v-slot:rightLabel>Values</template>
    </toggle-switch>

    <edit-object-modal-bottom-part
      :form="form"
      which="questions"
      :is-valid="isValid"
    ></edit-object-modal-bottom-part>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'
import { required, numeric } from 'vuelidate/lib/validators'
import EditObjectModalBottomPart from '~/components/layouts/EditObjectModalBottomPart'
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import questionMixin from '~/helpers/questionMixin'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'NewQuestionLikert',
  components: { PopupInfo, EditObjectModalBottomPart },
  mixins: [validationMixin, questionMixin],
  data() {
    return {
      form: null,
      options: [],
    }
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    isValid() {
      return !this.$v.$invalid
    },
  },
  watch: {
    options(data) {
      this.form.options = data
    },
  },

  validations: {
    form: {
      questionNumber: {
        required,
        numeric,
      },
      name: {
        required,
      },
      text: {
        required,
      },
    },
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
    this.form = parseQuestionToForm(this.question)
    if (!this.form.options) {
      this.options = [
        { ordinalPosition: 1, text: 'Strongly Disagree', value: 1 },
        { ordinalPosition: 2, text: 'Disagree', value: 2 },
        { ordinalPosition: 3, text: 'Neutral', value: 3 },
        { ordinalPosition: 4, text: 'Agree', value: 4 },
        { ordinalPosition: 5, text: 'Strongly Agree', value: 5 },
      ]
      this.form.options = this.options
    } else {
      this.options = this.form.options
    }
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
