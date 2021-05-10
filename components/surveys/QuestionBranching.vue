<template>
  <div class="flex flex-col">
    <div v-for="condition in conditions" :key="condition.groupIndex">
      <div class="flex flex-col border border-gray-100 shadow rounded p-2 mb-5">
        <div
          v-for="(rule, ruleIndex) in condition.ruleList"
          :key="`${condition.groupIndex} ${ruleIndex}`"
          class="flex flex-wrap"
        >
          <div class="w-full xl:w-8/12 flex p-1 items-start pr-3">
            <div class="flex w-full justify-between">
              <l-select
                v-if="rule.hasOwnProperty('questionNumber')"
                class="input select flex flex-1"
                :value="rule.questionNumber"
                @input="updateQuestion(condition.groupIndex, ruleIndex, $event)"
              >
                <template v-slot:options>
                  <option
                    v-for="ques in questions"
                    :key="`${condition.groupIndex} ${ruleIndex} ${ques.questionNumber}`"
                    :value="String(ques.questionNumber)"
                    :selected="
                      String(ques.questionNumber) ===
                      String(rule.questionNumber)
                    "
                  >
                    {{ getQuestionText(ques).text }}
                  </option>
                </template>
              </l-select>
              <l-select
                v-else
                class="input select flex flex-1"
                @input="updateFilter(condition.groupIndex, ruleIndex, $event)"
              >
                <template v-slot:options>
                  <option
                    v-for="filter in Object.keys(filters)"
                    :key="`${condition.groupIndex} ${ruleIndex} ${filter}`"
                    :value="filter"
                    :selected="filter === rule.name"
                  >
                    {{ filter }}
                  </option></template
                >
              </l-select>
              <div class="w-12 flex justify-center items-center py-3.5">
                <l-button-circle
                  color="red"
                  @click="deleteQuestion(condition.groupIndex, ruleIndex)"
                >
                  <i class="far fa-trash-alt fa-fw"></i>
                </l-button-circle>
              </div>
            </div>
          </div>
          <div
            v-if="rule.hasOwnProperty('questionNumber')"
            class="w-full xl:w-4/12"
          >
            <multi-select
              :key="`${condition.groupIndex} ${ruleIndex} ${rule.options.length}`"
              class="w-full"
              :original-list="getCurrentQuestionOptions(rule.questionNumber)"
              :selected-list="rule.options"
              @selectedItems="
                manageOptions(condition.groupIndex, ruleIndex, $event)
              "
              ><template v-slot:title>Select</template></multi-select
            >
          </div>
          <div v-else class="flex w-full xl:w-4/12 flex-col">
            <multi-select
              :key="`${condition.groupIndex} ${ruleIndex} ${rule.options.length}`"
              :original-list="getCurrentFilterOptions(rule.name)"
              :selected-list="rule.options"
              @selectedItems="
                manageOptions(condition.groupIndex, ruleIndex, $event)
              "
              ><template v-slot:title>Select</template></multi-select
            >
          </div>

          <l-select
            v-if="rule.hasOwnProperty('isAnd')"
            v-model="rule.isAnd"
            class="ml-1 w-24"
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
          <div class="flex items-center px-2 py-2 w-full xl:w-auto">
            <span class="border-b border-transparent mr-1">New filter by</span>
            <text-link
              v-if="questions.length !== 0"
              @click="addQuestion(condition.groupIndex)"
            >
              Question
            </text-link>
            <span
              v-if="questions.length !== 0 && contactlists.length !== 0"
              class="border-b border-transparent mx-1"
              >or</span
            >
            <text-link
              v-if="contactlists.length !== 0"
              @click="addFilter(condition.groupIndex)"
            >
              Contact List
            </text-link>
          </div>

          <l-button color="red" @click="deleteGroup(condition.groupIndex)">
            Delete Group
          </l-button>
        </div>
      </div>
      <l-select
        v-if="condition.hasOwnProperty('isAnd')"
        v-model="condition.isAnd"
        class="ml-1 w-24 mb-5"
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

    <div class="flex flex-col w-full items-start">
      <div
        v-if="questions.length === 0 && contactlists.length === 0"
        class="mb-6"
      >
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
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import MultiSelect from '~/components/elements/MultiSelect'
import TextLink from '~/components/elements/TextLink'
import LButtonCircle from '~/components/LButtonCircle'
import LSelect from '~/components/LSelect'

export default {
  name: 'QuestionBranching',
  components: {
    LSelect,
    LButtonCircle,
    TextLink,
    MultiSelect,
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
      currentlySelectedQuestion: [],
      isLoading: true,
      conditions: [],
      loadedFilters: [],
    }
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },

    questions() {
      return JSON.parse(
        JSON.stringify(this.$store.getters.getItems('questions'))
      )
        .sort((a, b) => {
          return Number(a.ordinalPosition) > Number(b.ordinalPosition) ? 1 : -1
        })
        .filter((el) => {
          return (
            el.ordinalPosition < this.question.ordinalPosition &&
            !el.flags.includes('SECTION') &&
            el.options.length !== 0
          )
        })
    },
    filters() {
      return JSON.parse(JSON.stringify(this.loadedFilters))
    },
    contactlists() {
      if (this.canUseContactBook)
        return this.$store.getters.getItems('contactlist')
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
  },
  created() {
    this.isLoading = true
    this.conditions = this.existingConditions.rules
    if (this.contactlists.length !== 0)
      this.$store
        .dispatch('invitations/getFilters')
        .then((result) => {
          this.loadedFilters = result
        })
        .finally(() => {
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
    updateQuestion(groupIndex, conditionQuestionIndex, newCode) {
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
    updateFilter(groupIndex, conditionQuestionIndex, newCode) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList[conditionQuestionIndex] = {
            name: newCode,
            options: [],
            contactListCode: this.contactList.code
              ? this.contactList.code
              : null,
          }
        }
      }
      this.$forceUpdate()
    },
    getCurrentQuestionOptions(questionNumber) {
      const x = this.questions.find((el) => {
        return String(el.questionNumber) === String(questionNumber)
      })

      if (x.flags.includes('RANKING')) {
        const data = []
        x.options.forEach((el) => {
          for (let i = 1; i <= x.options.length; i++) {
            data.push({
              code: `${el.value} (${i})`,
              name: `${el.value} (${i})`,
            })
          }
        })
        return data
      } else if (x.flags.includes('RADIO_GRID')) {
        const data = []
        const rows = x.options.filter((el) => {
          return el.flags.includes('ROW')
        })
        const columns = x.options.filter((el) => {
          return el.flags.includes('COLUMN')
        })
        rows.forEach((row) => {
          columns.forEach((column) => {
            data.push({
              code: `${row.value} (${column.value})`,
              name: `${row.value} (${column.value})`,
            })
          })
        })
        return data
      } else {
        return x
          ? x.options.map((el) => {
              return { code: el.value, name: el.value }
            })
          : []
      }
    },
    getCurrentFilterOptions(filterName) {
      const x = this.filters[filterName]

      return x || []
    },

    manageOptions(groupIndex, questionIndex, newList) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].ruleList[questionIndex].options = newList
        }
      }
      this.$forceUpdate()
    },

    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
  },
}
</script>
