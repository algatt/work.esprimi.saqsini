<template>
  <div v-if="!isLoading" class="flex flex-col">
    <div
      v-if="!isBranchingValid"
      class="bg-red-100 border border-red-200 my-3 p-2 text-red-800 text-sm rounded transition duration-300"
    >
      Check your branching rules. You cannot have rules without any selected
      values.
    </div>
    <div
      v-for="condition in conditions"
      :key="condition.groupIndex"
      class="flex flex-col"
    >
      <div class="flex flex-col border border-gray-100 shadow rounded p-2">
        <div
          v-for="(rule, ruleIndex) in condition.ruleList"
          :key="ruleIndex"
          class="flex flex-col"
        >
          <question-branching-select-filter
            :condition="condition"
            :rule="rule"
            :question="question"
            @updateQuestion="
              updateQuestion($event, condition.groupIndex, ruleIndex)
            "
            @updateFilter="
              updateFilter($event, condition.groupIndex, ruleIndex)
            "
            @deleteQuestion="deleteQuestion(condition.groupIndex, ruleIndex)"
            @manageOptions="
              manageOptions($event, condition.groupIndex, ruleIndex)
            "
          ></question-branching-select-filter>

          <l-select
            v-if="rule.hasOwnProperty('isAnd')"
            v-model="rule.isAnd"
            class="w-24 my-4"
          >
            <template v-slot:options>
              <option value="false" :selected="rule.isAnd === 'false'">
                or
              </option>
              <option value="true" :selected="rule.isAnd === 'true'">
                and
              </option></template
            >
          </l-select>
        </div>

        <div class="flex flex-wrap justify-between items-center">
          <div class="flex items-center px-2 py-2 w-full md:w-auto">
            <span class="border-b-2 border-transparent mr-1"
              >New filter by</span
            >
            <l-text-link
              v-if="questions.length !== 0"
              @click="addQuestion(condition.groupIndex)"
            >
              Question
            </l-text-link>
            <span
              v-if="questions.length !== 0 && contactlists.length !== 0"
              class="border-b border-transparent mx-1"
              >or</span
            >
            <l-text-link
              v-if="contactlists.length !== 0"
              @click="addFilter(condition.groupIndex)"
            >
              Contact List
            </l-text-link>
          </div>

          <l-text-link color="red" @click="deleteGroup(condition.groupIndex)">
            Delete Group
          </l-text-link>
        </div>
      </div>
      <l-select
        v-if="condition.hasOwnProperty('isAnd')"
        v-model="condition.isAnd"
        class="ml-1 w-24 my-4"
        ><template v-slot:options>
          <option value="false" :selected="condition.isAnd === 'false'">
            or
          </option>
          <option value="true" :selected="condition.isAnd === 'true'">
            and
          </option></template
        >
      </l-select>
    </div>

    <div class="flex flex-col w-full items-start mt-4">
      <div v-if="questions.length === 0 && contactlists.length === 0">
        <p class="font-semibold">There is no branching available.</p>
      </div>
      <l-button
        :disabled="questions.length === 0 && contactlists.length === 0"
        @click="addGroup"
      >
        Add Condition Group
      </l-button>
    </div>
  </div>
</template>

<script>
import { convertQuestionFromApiToForm } from '~/services/question-helpers'
import LSelect from '~/components/LSelect'
import QuestionBranchingSelectFilter from '~/components/surveys/QuestionBranchingSelectFilter'
import LTextLink from '~/components/LTextLink'
import { FILTER_NAMES } from '~/assets/settings/survey-settings'

export default {
  name: 'QuestionBranching',
  components: {
    LTextLink,
    QuestionBranchingSelectFilter,
    LSelect,
  },
  props: {
    existingConditions: {
      type: Object,
      required: true,
    },
    question: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      conditions: [],
      FILTER_NAMES,
    }
  },
  computed: {
    isBranchingValid() {
      let valid = true
      for (const iter of this.conditions) {
        if (iter.ruleList.length === 0) valid = false
        else {
          const options = iter.ruleList.map((el) => {
            return el.options
          })
          options.forEach((option) => {
            if (option.length === 0) valid = false
          })
        }
      }
      return valid
    },
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },

    questions() {
      const x = JSON.parse(
        JSON.stringify(this.$store.getters['questions/sortedQuestions'])
      )
      return x.filter((el) => {
        return (
          el.ordinalPosition < this.question.ordinalPosition &&
          !el.flags.includes('SECTION') &&
          el.options.length !== 0
        )
      })
    },
    filters() {
      return JSON.parse(JSON.stringify(this.$store.state.invitations.filters))
    },
    contactlists() {
      if (this.canUseContactBook) return this.$store.state.contactlist.items
      return []
    },
    contactList() {
      if (this.canUseContactBook)
        return this.$store.getters.getSelectedContactList
      return {}
    },
  },
  watch: {
    conditions(ev) {
      this.$emit('conditions', { rules: ev })
    },
    isBranchingValid(ev) {
      this.$emit('isValid', this.isBranchingValid)
    },
  },
  created() {
    this.isLoading = true
    this.conditions = this.existingConditions.rules
    if (this.contactlists.length !== 0)
      this.$store.dispatch('invitations/getFilters').finally(() => {
        this.isLoading = false
      })
    else this.isLoading = false
  },
  methods: {
    addGroup() {
      const len = this.conditions.length
      const obj = {
        groupIndex: len,
        ruleList: [],
      }
      if (len > 0) {
        this.conditions[len - 1].isAnd = true
      }
      this.conditions.push(obj)
    },
    deleteGroup(groupIndex) {
      this.conditions = this.conditions.filter((el) => {
        return el.groupIndex !== groupIndex
      })
      for (const i in this.conditions) {
        this.conditions[i].groupIndex = i
        if (Number(i) === this.conditions.length - 1) {
          delete this.conditions[i].isAnd
        }
      }
    },

    addQuestion(groupIndex) {
      const group = this.conditions.find((el) => {
        return el.groupIndex === groupIndex
      })

      const obj = {
        questionNumber: this.questions[0].questionNumber,
        options: [],
      }
      if (group.ruleList.length > 0) {
        group.ruleList[group.ruleList.length - 1].isAnd = true
      }
      group.ruleList.push(obj)
      this.$forceUpdate()
    },
    addFilter(groupIndex) {
      const group = this.conditions.find((el) => {
        return el.groupIndex === groupIndex
      })
      const obj = {
        name: Object.keys(this.filters)[0],
        options: [],
        contactListCode: this.contactList.code ? this.contactList.code : null,
        filterName: FILTER_NAMES[Object.keys(this.filters)[0]],
      }
      if (group.ruleList.length > 0) {
        group.ruleList[group.ruleList.length - 1].isAnd = true
      }
      group.ruleList.push(obj)
      this.$forceUpdate()
    },
    deleteQuestion(groupIndex, questionIndex) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList.splice(questionIndex, 1)
          if (this.conditions[i].ruleList.length > 0)
            delete this.conditions[i].ruleList[
              this.conditions[i].ruleList.length - 1
            ].isAnd
        }
      }
      this.$forceUpdate()
    },
    updateQuestion(newCode, groupIndex, conditionQuestionIndex) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList[
            conditionQuestionIndex
          ].questionNumber = newCode
          this.conditions[i].ruleList[conditionQuestionIndex].options = []
        }
      }
      this.$forceUpdate()
    },
    updateFilter(newCode, groupIndex, conditionQuestionIndex) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList[conditionQuestionIndex] = {
            name: newCode,
            options: [],
            contactListCode: this.contactList.code
              ? this.contactList.code
              : null,
            filterName: FILTER_NAMES[newCode],
          }
        }
      }
      this.$forceUpdate()
    },

    manageOptions(newList, groupIndex, questionIndex) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList[questionIndex].options = newList
        }
      }
      this.$forceUpdate()
    },

    getQuestionText(question) {
      return convertQuestionFromApiToForm(question)
    },
  },
}
</script>
