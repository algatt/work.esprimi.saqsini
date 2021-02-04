<template>
  <div class="flex flex-col mt-2">
    <div v-if="conditions.length === 0" class="mb-3">
      <p>Currently, this question has no branching.</p>
    </div>
    <div v-else class="mb-3">
      <toggle-switch
        class="my-3"
        :checked="xl:BeMet"
        :change-colour="false"
        @clicked="xl:BeMet = $event"
      >
        <template v-slot:leftLabel>Match any</template>
        <template v-slot:rightLabel>Match all</template>
      </toggle-switch>
      <div
        v-for="(condition, index) in conditions"
        :key="'condition' + index"
        class="border border-gray-200 px-3 py-2 shadow my-2 rounded flex w-full items-center"
        @click="selectedFilter = condition.parentObject.code"
      >
        <div
          v-if="condition.type === 'question'"
          class="flex flex-col flex-grow"
        >
          <div class="flex flex-col font-semibold mb-2 cursor-pointer">
            {{ condition.parentObject.ordinalPosition }} -
            {{ condition.parentObject.name }}
          </div>
          <div>
            <span
              v-for="(option, index2) in condition.condition"
              :key="'option' + index + '' + index2"
              class="bg-gray-100 rounded px-2 py-0.5 mr-2"
              >{{ option }}</span
            >
          </div>
        </div>
        <div v-else class="flex flex-col flex-grow">
          <div class="flex flex-col font-semibold mb-2">
            {{ condition.parentObject.text }}
          </div>
          <div>
            <span
              v-for="(option, index2) in condition.condition"
              :key="'option' + index + '' + index2"
              class="bg-gray-100 rounded px-2 py-0.5 mr-2"
              >{{ option }}</span
            >
          </div>
        </div>
        <div class="w-8">
          <button
            class="btn-link-danger"
            @click.stop="deleteCondition(condition.parentObject.code)"
          >
            <i class="far fa-trash-alt fa-fw"></i>
          </button>
        </div>
      </div>
    </div>

    <label class="label">Add Branching</label>
    <select v-model="selectedFilter" class="input mb-2">
      <option
        value=""
        class="bg-gray-100 font-semibold text-gray-800"
        disabled
        selected
      >
        Choose question or contact book value
      </option>
      <option
        v-for="item in combinedQuestionsAndContactText"
        :key="item.code"
        :code="item.code"
        :value="item.code"
        :class="
          item.type === 'header'
            ? 'bg-gray-100 font-semibold text-gray-800'
            : null
        "
        :disabled="item.type === 'header'"
      >
        {{ item.text }}
      </option>
    </select>
    <div
      v-for="item in combinedQuestionAndContactOptions"
      :key="item.code"
      class="flex w-full px-3 py-1"
    >
      <div class="w-8">
        <button class="focus:outline-none cursor-pointer">
          <i
            class="far fa-check-circle transition-all duration-300 ease-in"
            :class="checkIfExists(item) ? 'text-primary' : 'text-gray-300'"
            @click="addCondition(item)"
          ></i>
        </button>
      </div>
      <div class="flex flex-grow cursor-pointer" @click="addCondition(item)">
        {{ item.value }}
      </div>
    </div>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'

export default {
  name: 'QuestionBranching',
  components: { ToggleSwitch },
  props: {
    existingConditions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      xl:BeMet: false,
      conditions: [],
      filters: {},
      selectedFilter: '',
    }
  },
  computed: {
    question() {
      return this.$store.state.currentItemToBeEdited
    },
    questions() {
      return JSON.parse(
        JSON.stringify(this.$store.getters.getItems('questions'))
      ).sort((a, b) => {
        return Number(a.ordinalPosition) > Number(b.ordinalPosition) ? 1 : -1
      })
    },
    previousQuestions() {
      return this.questions.filter((el) => {
        return (
          el.ordinalPosition < this.question.ordinalPosition &&
          !el.flags.includes('SECTION') &&
          el.options.length !== 0
        )
      })
    },
    previousQuestionsText() {
      const x = this.previousQuestions.map((el) => {
        const text = this.getQuestionText(el)
        return {
          code: el.code,
          text: text.name + ' - ' + text.text,
          type: 'question',
          obj: el,
        }
      })
      x.unshift({ code: -1, text: 'Questions', type: 'header' })
      return x
    },
    previousQuestionAnswers() {
      if (isNaN(Number(this.selectedFilter))) return []
      const question = this.questions.find((el) => {
        return el.code === this.selectedFilter
      })
      if (!question) return null
      return question.options.map((el) => {
        return { value: el.value, obj: el }
      })
    },
    contactText() {
      const x = Object.keys(this.filters)
      const result = [{ code: -2, text: 'Contact Book', type: 'header' }]
      x.forEach((el) => {
        result.push({
          code: 'contact ' + el,
          text: el.charAt(0).toUpperCase() + el.slice(1),
          type: 'contact',
          obj: {
            code: 'contact ' + el,
            text: el.charAt(0).toUpperCase() + el.slice(1),
          },
        })
      })
      return result
    },
    contactOptions() {
      if (
        !isNaN(Number(this.selectedFilter)) ||
        this.selectedFilter.indexOf('contact ') !== 0
      )
        return []

      let which = this.selectedFilter.toLowerCase()
      which = which.replace('contact ', '')
      let x = this.filters[which]

      const fieldToSort =
        this.selectedFilter.toLowerCase() === 'contacts'
          ? 'displayName'
          : 'name'
      x = x.sort((a, b) => {
        return a[fieldToSort].toLowerCase() > b[fieldToSort].toLowerCase()
          ? 1
          : -1
      })
      x = x.map((el) => {
        return {
          code: el.code,
          value: el[fieldToSort],
          obj: el,
        }
      })
      x.unshift({ code: 'all', value: 'All' })
      return x
    },

    combinedQuestionsAndContactText() {
      return this.previousQuestionsText.concat(this.contactText)
    },
    combinedQuestionAndContactOptions() {
      if (
        !isNaN(Number(this.selectedFilter)) ||
        this.selectedFilter.indexOf('contact ') !== 0
      )
        return this.previousQuestionAnswers
      return this.contactOptions
    },
  },
  watch: {
    conditions(ev) {
      this.$emit('conditions', { rules: ev, xl:BeMet: this.xl:BeMet })
    },
    xl:BeMet(ev) {
      this.$emit('conditions', {
        rules: this.conditions,
        xl:BeMet: ev,
      })
    },
  },
  async created() {
    this.conditions = this.existingConditions.rules
    this.xl:BeMet = this.existingConditions.xl:BeMet
    this.filters = await this.$store.dispatch('invitations/getFilters')
  },
  methods: {
    checkIfExists(item) {
      const existingCondition = this.conditions.find((el) => {
        return el.parentObject.code === this.selectedFilter
      })
      if (existingCondition)
        return existingCondition.condition.includes(item.value)
      return false
    },
    addCondition(item) {
      const parentObject = this.combinedQuestionsAndContactText.find((el) => {
        return el.code === this.selectedFilter
      })

      const existingCondition = this.conditions.find((el) => {
        return el.parentObject.code === this.selectedFilter
      })

      let values = []
      if (parentObject.type === 'contact' && item.value === 'All') {
        values = this.filters[parentObject.code.replace('contact ', '')]
        values = values.map((el) => {
          return el.name
        })
      }

      if (!existingCondition)
        this.conditions.push({
          type: parentObject.type,
          parentObject: parentObject.obj,
          condition: values.length === 0 ? [item.value] : values,
        })
      else if (
        existingCondition.condition.includes(item.value) &&
        values.length === 0
      ) {
        existingCondition.condition = existingCondition.condition.filter(
          (el) => {
            return el !== item.value
          }
        )
        if (existingCondition.condition.length === 0)
          this.conditions = this.conditions.filter((el) => {
            return el.parentObject.code !== this.selectedFilter
          })
      } else if (values.length !== 0) existingCondition.condition = values
      else existingCondition.condition.push(item.value)
    },
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },

    deleteCondition(code) {
      this.conditions = this.conditions.filter((el) => {
        return el.parentObject.code !== code
      })
    },
  },
}
</script>
