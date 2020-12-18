<template>
  <div class="flex flex-col mt-2">
    <div v-if="conditions.length === 0" class="mb-3">
      <p>Currently, this question has no branching.</p>
    </div>
    <div v-else class="mb-3">
      <label class="label">Existing Branching</label>
      <toggle-switch
        class="my-3"
        :checked="allMustBeMet"
        :change-colour="false"
        @clicked="allMustBeMet = $event"
      >
        <template v-slot:leftLabel>Match any</template>
        <template v-slot:rightLabel>Match all</template>
      </toggle-switch>
      <div
        v-for="(condition, index) in conditions"
        :key="index"
        class="flex items-center justify-between px-3 py-2 border border-gray-100 my-1 rounded w-full md:w-10/12 shadow-sm"
      >
        <div v-if="condition.questionCode" class="flex flex-grow flex-col">
          <p>{{ condition.questionText }}</p>
          <p>{{ condition.answer }}</p>
        </div>
        <div v-else>
          <p>{{ condition.filterType }}</p>
          <p v-if="condition.filter.name">{{ condition.filter.name }}</p>
          <p v-else>{{ condition.filter.displayName }}</p>
        </div>
        <div class="flex items-center">
          <button class="btn-link-danger" @click="deleteCondition(index)">
            <i class="far fa-trash-alt fa-sm fa-fw"></i>
          </button>
        </div>
      </div>
    </div>

    <toggle-switch
      class="my-3"
      :checked="isDemographicBranching"
      :change-colour="false"
      @clicked="isDemographicBranching = $event"
    >
      <template v-slot:label
        >Branching by
        <popup-info
          ><template v-slot:text
            >You can choose to add conditions either by previous responses or
            contact details.</template
          ></popup-info
        ></template
      >
      <template v-slot:leftLabel>Survey</template>
      <template v-slot:rightLabel>Contact Book</template>
    </toggle-switch>
    <div v-if="!isDemographicBranching" class="flex flex-wrap items-center">
      <template v-if="previousQuestions.length !== 0">
        <div class="w-full flex flex-wrap items-center mb-2">
          <label class="label md:w-2/12 w-full">Question</label>
          <select
            v-model="selectedQuestion"
            class="input select md:w-8/12 w-full"
            @change="updateSelectAnswers"
          >
            <option
              v-for="previous in previousQuestionsText"
              :key="previous.code"
              :value="previous.code"
            >
              {{ previous.text }}
            </option>
          </select>
        </div>
        <div class="flex items-center w-full flex-wrap mb-2">
          <label class="label md:w-2/12 w-full">Response</label>
          <select
            v-model="selectedAnswer"
            class="input select md:w-8/12 w-full"
          >
            <option
              v-for="(answer, index) in previousQuestionAnswers"
              :key="answer + index"
              :value="answer.value"
            >
              {{ answer.value }}
            </option>
          </select>
          <div
            class="flex w-full md:w-2/12 justify-center items-center px-3 mt-1 md:mt-0"
          >
            <button
              class="btn-primary px-3"
              :disabled="checkIfDisabledQuestion()"
              @click="addConditionQuestion"
            >
              Add
            </button>
          </div>
        </div>
      </template>
      <div v-else class="w-full flex items-center">
        Previous questions cannot be used for branching.
      </div>
    </div>
    <template v-else
      ><div class="flex flex-wrap items-center w-full mb-2">
        <div class="flex w-full flex-wrap w-full md:w-10/12">
          <select
            v-model="selectedFilter"
            class="input select w-full"
            @change="selectedFilterItem = filterItems[0].code"
          >
            <option v-for="(item, index) in filterKeys" :key="index">
              {{ item }}
            </option>
          </select>
        </div>
        <div class="flex flex-wrap items-center w-full mt-2">
          <select
            v-model="selectedFilterItem"
            class="input select w-10/12"
            :disabled="!filterItems || filterItems.length === 0"
          >
            <option
              v-for="(item, index) in filterItems"
              :key="index"
              :value="item.code"
            >
              <template v-if="selectedFilter !== 'Contacts'">{{
                item.name
              }}</template>
              <template v-else-if="selectedFilter === 'Contacts'">{{
                item.displayName
              }}</template>
            </option>
          </select>
          <div
            class="flex w-full md:w-2/12 justify-center items-center mt-2 md:mt-0"
          >
            <button
              class="btn-primary px-3"
              :disabled="checkIfDisabledDemographic()"
              @click="addConditionDemographic"
            >
              Add
            </button>
          </div>
        </div>
      </div></template
    >
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'
import PopupInfo from '~/components/layouts/PopupInfo'

export default {
  name: 'QuestionBranching',
  components: { PopupInfo, ToggleSwitch },
  props: {
    existingConditions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedQuestion: null,
      selectedAnswer: null,
      isDemographicBranching: false,
      allMustBeMet: false,
      conditions: [],
      filters: {},
      selectedFilter: null,
      selectedFilterItem: null,
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
      return this.previousQuestions.map((el) => {
        const text = this.getQuestionText(el)
        return { code: el.code, text: text.name + ' - ' + text.text }
      })
    },
    previousQuestionAnswers() {
      const question = this.questions.find((el) => {
        return el.code === this.selectedQuestion
      })
      if (!question) return null
      return question.options.map((el) => {
        return { value: el.value }
      })
    },
    filterKeys() {
      const x = Object.keys(this.filters)
      const result = []
      x.forEach((el) => {
        result.push(el.charAt(0).toUpperCase() + el.slice(1))
      })
      return result
    },
    filterItems() {
      let x = this.filters[this.selectedFilter.toLowerCase()]
      const fieldToSort =
        this.selectedFilter.toLowerCase() === 'contacts'
          ? 'displayName'
          : 'name'
      x = x.sort((a, b) => {
        return a[fieldToSort].toLowerCase() > b[fieldToSort].toLowerCase()
          ? 1
          : -1
      })
      x.unshift({ [fieldToSort]: 'All', value: 'ALL' })
      return x
    },
  },
  watch: {
    conditions(ev) {
      this.$emit('conditions', { rules: ev, allMustBeMet: this.allMustBeMet })
    },
    allMustBeMet(ev) {
      this.$emit('conditions', {
        rules: this.conditions,
        allMustBeMet: ev,
      })
    },
  },
  async created() {
    if (this.previousQuestionsText && this.previousQuestionsText.length > 0) {
      this.selectedQuestion = this.previousQuestionsText[0].code
      this.selectedAnswer = this.previousQuestionAnswers[0].value
    }
    this.conditions = this.existingConditions.rules
    this.allMustBeMet = this.existingConditions.allMustBeMet

    this.filters = await this.$store.dispatch('invitations/getFilters')
    this.selectedFilter = this.filterKeys[0]
    this.selectedFilterItem =
      this.filterItems.length > 0 ? this.filterItems[0].code : null
  },
  methods: {
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
    updateSelectAnswers() {
      this.selectedAnswer = this.previousQuestionAnswers[0].value
    },
    checkIfDisabledQuestion() {
      return (
        this.conditions.filter((el) => {
          return (
            el.questionCode === this.selectedQuestion &&
            el.answer === this.selectedAnswer
          )
        }).length > 0
      )
    },
    checkIfDisabledDemographic() {
      return (
        this.conditions.filter((el) => {
          return (
            el.filterType === this.selectedFilter &&
            el.filter.code === this.selectedFilterItem
          )
        }).length > 0
      )
    },
    addConditionQuestion() {
      const questionText = this.getQuestionText(
        this.questions.find((el) => {
          return el.code === this.selectedQuestion
        })
      ).text
      this.conditions.push({
        questionCode: this.selectedQuestion,
        questionText,
        answer: this.selectedAnswer,
      })
    },
    addConditionDemographic() {
      this.conditions.push({
        filterType: this.selectedFilter,
        filter: this.filters[this.selectedFilter.toLowerCase()].find((el) => {
          return el.code === this.selectedFilterItem
        }),
      })
    },
    deleteCondition(index) {
      this.conditions.splice(index, 1)
    },
  },
}
</script>

<style scoped></style>
