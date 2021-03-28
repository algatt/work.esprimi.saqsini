<template>
  <spinner v-if="isLoading"></spinner>
  <div v-else class="flex flex-col mt-2">
    <div v-for="condition in conditions" :key="condition.groupIndex">
      <div class="flex flex-col border border-gray-100 shadow rounded p-2 my-3">
        <div
          v-for="(
            conditionQuestion, conditionQuestionIndex
          ) in condition.questions"
          :key="`${condition.groupIndex} ${conditionQuestionIndex}`"
          class="flex flex-wrap"
        >
          <div class="w-8/12 flex p-1 items-start pr-3">
            <div class="flex w-full justify-between">
              <select
                v-if="conditionQuestion.hasOwnProperty('code')"
                class="input select flex flex-1"
                @change="
                  updateQuestion(
                    condition.groupIndex,
                    conditionQuestionIndex,
                    $event
                  )
                "
              >
                <option
                  v-for="question in questions"
                  :key="`${condition.groupIndex} ${conditionQuestionIndex} ${question.code}`"
                  :value="question.code"
                  :selected="question.code === conditionQuestion.code"
                >
                  {{ getQuestionText(question).text }}
                </option>
              </select>
              <select
                v-else
                class="input select flex flex-1"
                @change="
                  updateFilter(
                    condition.groupIndex,
                    conditionQuestionIndex,
                    $event
                  )
                "
              >
                <option
                  v-for="filter in Object.keys(filters)"
                  :key="`${condition.groupIndex} ${conditionQuestionIndex} ${filter}`"
                  :value="filter"
                  :selected="filter === conditionQuestion.name"
                >
                  {{ filter }}
                </option>
              </select>
              <div class="w-12 flex justify-center items-center">
                <button
                  class="btn-link-danger"
                  @click="
                    deleteQuestion(condition.groupIndex, conditionQuestionIndex)
                  "
                >
                  <i class="far fa-trash-alt fa-fw"></i>
                </button>
              </div>
            </div>
          </div>
          <div
            v-if="conditionQuestion.hasOwnProperty('code')"
            class="flex w-4/12 flex-col"
          >
            <multi-select
              :key="
                condition.groupIndex +
                ' ' +
                conditionQuestionIndex +
                conditionQuestion.options.length
              "
              :original-list="getCurrentQuestionOptions(conditionQuestion.code)"
              :selected-list="conditionQuestion.options"
              @selectedItems="
                manageOptions(
                  condition.groupIndex,
                  conditionQuestionIndex,
                  $event
                )
              "
              ><template v-slot:title>Select</template></multi-select
            >
          </div>
          <div v-else class="flex w-4/12 flex-col">
            <multi-select
              :key="
                condition.groupIndex +
                ' ' +
                conditionQuestionIndex +
                conditionQuestion.options.length
              "
              :original-list="getCurrentFilterOptions(conditionQuestion.name)"
              :selected-list="conditionQuestion.options"
              @selectedItems="
                manageOptions(
                  condition.groupIndex,
                  conditionQuestionIndex,
                  $event
                )
              "
              ><template v-slot:title>Select</template></multi-select
            >
          </div>
          <select
            v-if="conditionQuestion.hasOwnProperty('isAnd')"
            v-model="conditionQuestion.isAnd"
            class="input select w-20 bg-gray-100 rounded"
          >
            <option :value="false">or</option>
            <option :value="true">and</option>
          </select>
        </div>

        <div class="flex justify-between items-center">
          <div class="flex items-center">
            New filter by
            <button
              v-if="questions.length !== 0"
              class="btn-link mx-1 py-2"
              @click="addQuestion(condition.groupIndex)"
            >
              Question
            </button>
            <span v-if="questions.length !== 0 && contactlists.length !== 0"
              >or</span
            >
            <button
              v-if="contactlists.length !== 0"
              class="btn-link mx-1 py-2"
              @click="addFilter(condition.groupIndex)"
            >
              Contact List
            </button>
          </div>
          <button
            class="text-red-500 hover:text-red-600 hover:underline font-semibold mr-1 p-2"
            @click="deleteGroup(condition.groupIndex)"
          >
            Delete Group
          </button>
        </div>
      </div>
      <select
        v-if="condition.hasOwnProperty('isAnd')"
        v-model="condition.isAnd"
        class="input select w-20 bg-gray-100 rounded mb-1"
      >
        <option :value="false">or</option>
        <option :value="true">and</option>
      </select>
    </div>

    <div class="flex w-full justify-between items-center">
      <button class="btn-link ml-1 p-2" @click="addGroup">
        Add Condition Group
      </button>
    </div>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import Spinner from '~/components/layouts/Spinner'
import MultiSelect from '~/components/layouts/MultiSelect'

export default {
  name: 'QuestionBranching',
  components: { Spinner, MultiSelect },
  props: {
    existingConditions: {
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
    question() {
      return this.$store.state.currentItemToBeEdited
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
      return this.$store.getters.getItems('contactlist')
    },
    contactList() {
      return this.$store.getters.getSelectedContactList
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
        contactListCode: this.contactList.code,
        groupIndex: len,
        questions: [],
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

    questionExistsInGroup(groupIndex, questionCode) {
      return (
        this.conditions
          .find((el) => {
            return el.groupIndex === groupIndex
          })
          .questions.find((el) => {
            return el.code === questionCode
          }) !== undefined
      )
    },
    addQuestion(groupIndex) {
      const group = this.conditions.find((el) => {
        return el.groupIndex === groupIndex
      })

      const obj = { code: this.questions[0].code, options: [] }
      if (group.questions.length > 0) {
        group.questions[group.questions.length - 1].isAnd = true
      }
      group.questions.push(obj)
      this.$forceUpdate()
    },
    addFilter(groupIndex) {
      const group = this.conditions.find((el) => {
        return el.groupIndex === groupIndex
      })
      const obj = { name: Object.keys(this.filters)[0], options: [] }
      if (group.questions.length > 0) {
        group.questions[group.questions.length - 1].isAnd = true
      }
      group.questions.push(obj)
      this.$forceUpdate()
    },
    deleteQuestion(groupIndex, questionIndex) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].questions.splice(questionIndex, 1)
          if (this.conditions[i].questions.length > 0)
            delete this.conditions[i].questions[
              this.conditions[i].questions.length - 1
            ].isAnd
        }
      }
      this.$forceUpdate()
    },
    updateQuestion(groupIndex, conditionQuestionIndex, newCode) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].questions[conditionQuestionIndex] = {
            code: Number(newCode.target.value),
            options: [],
          }
        }
      }
      this.$forceUpdate()
    },
    updateFilter(groupIndex, conditionQuestionIndex, newCode) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].questions[conditionQuestionIndex] = {
            name: newCode.target.value,
            options: [],
          }
        }
      }
      this.$forceUpdate()
    },
    getCurrentQuestionOptions(questionCode) {
      const x = this.questions.find((el) => {
        return el.code === questionCode
      })

      if (x.flags.includes('RANKING')) {
        const data = []
        x.options.forEach((el) => {
          for (let i = 1; i <= x.options.length; i++) {
            const value = `${el.value} (${i})`
            data.push({ code: value, name: value })
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
            const value = `${row.value}#${column.value}`
            const name = `${row.value} (${column.value})`
            data.push({ code: value, name })
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
    existsInOption(groupIndex, questionIndex, value) {
      return this.conditions
        .find((el) => {
          return el.groupIndex === groupIndex
        })
        .questions[questionIndex].options.includes(value)
    },
    // addOptionToQuestion(groupIndex, questionIndex, value) {
    //   for (const i in this.conditions) {
    //     if (this.conditions[i].groupIndex === groupIndex) {
    //       if (
    //         this.conditions[i].questions[questionIndex].options.includes(value)
    //       )
    //         this.conditions[i].questions[
    //           questionIndex
    //         ].options = this.conditions[i].questions[
    //           questionIndex
    //         ].options.filter((el) => {
    //           return el !== value
    //         })
    //       else this.conditions[i].questions[questionIndex].options.push(value)
    //     }
    //   }
    //   this.$forceUpdate()
    // },
    manageOptions(groupIndex, questionIndex, newList) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].questions[questionIndex].options = newList
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
