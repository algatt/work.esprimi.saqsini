<template>
  <spinner v-if="isLoading"></spinner>
  <div v-else class="flex flex-col mt-2">
    {{ conditions }}
    <div v-for="condition in conditions" :key="condition.groupIndex">
      <div class="flex flex-col border border-gray-100 shadow rounded p-2 my-3">
        <div
          v-for="conditionQuestion in condition.questions"
          :key="`${condition.groupIndex} ${conditionQuestion.code}`"
          class="flex flex-wrap"
        >
          <div class="w-8/12 flex p-1 items-start pr-3">
            <div class="flex w-full justify-between">
              <select
                class="input select flex flex-1"
                @change="
                  updateQuestion(
                    condition.groupIndex,
                    conditionQuestion.code,
                    $event
                  )
                "
              >
                <option
                  v-for="question in questions"
                  :key="`${condition.groupIndex} ${conditionQuestion.code} ${question.code}`"
                  :value="question.code"
                  :selected="question.code === conditionQuestion.code"
                  :disabled="
                    question.code !== conditionQuestion.code &&
                    !getAvailableGroupQuestions(condition.groupIndex).includes(
                      question.code
                    )
                  "
                >
                  {{ getQuestionText(question).text }}
                </option>
              </select>
              <div class="w-12 flex justify-center items-center">
                <button
                  class="btn-link-danger"
                  @click="
                    deleteQuestion(condition.groupIndex, conditionQuestion.code)
                  "
                >
                  <i class="far fa-trash-alt fa-fw"></i>
                </button>
              </div>
            </div>
          </div>
          <div class="flex w-4/12 p-3 flex-col">
            <button
              v-for="(option, index) in getCurrentQuestionOptions(
                conditionQuestion.code
              )"
              :key="index"
              class="flex items-center text-left mb-1"
              @click="
                addOptionToQuestion(
                  condition.groupIndex,
                  conditionQuestion.code,
                  option.value
                )
              "
            >
              <div
                class="w-6 flex items-center justify-center pr-2"
                :class="
                  existsInOption(
                    condition.groupIndex,
                    conditionQuestion.code,
                    option.value
                  )
                    ? 'text-primary'
                    : 'text-gray-500'
                "
              >
                <i class="far fa-check-circle fa-fw"></i>
              </div>
              <div class="flex items-center">{{ option.value }}</div>
            </button>
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
          <button
            class="btn-link ml-1 py-2"
            @click="addQuestion(condition.groupIndex)"
          >
            Add Question
          </button>
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
      <button class="btn-link ml-1 p-2" @click="addGroup">Add Group</button>
    </div>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'QuestionBranching',
  components: {},
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
  },
  watch: {
    conditions(ev) {
      this.$emit('conditions', { rules: ev })
    },
  },
  created() {
    // this.isLoading = true
    this.conditions = this.existingConditions.rules
    // this.xl:BeMet = this.existingConditions.xl:BeMet
    // this.$store.dispatch('invitations/getFilters').then((result) => {
    //   this.filters = result
    //   // this.currentlySelectedQuestion =
    //   this.isLoading = false
    // })
    this.isLoading = false
  },
  methods: {
    addGroup() {
      const len = this.conditions.length
      const obj = {
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
    getAvailableGroupQuestions(groupIndex) {
      const usedQuestions = this.conditions
        .find((el) => {
          return el.groupIndex === groupIndex
        })
        .questions.map((el) => {
          return el.code
        })
      return this.questions
        .filter((el) => {
          return !usedQuestions.includes(el.code)
        })
        .map((el) => {
          return el.code
        })
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

      for (const i in this.questions) {
        if (!this.questionExistsInGroup(groupIndex, this.questions[i].code)) {
          const obj = { code: this.questions[i].code, options: [] }
          if (group.questions.length > 0) {
            group.questions[group.questions.length - 1].isAnd = true
          }
          group.questions.push(obj)
          break
        }
      }
    },
    deleteQuestion(groupIndex, questionCode) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          this.conditions[i].questions = this.conditions[i].questions.filter(
            (el) => {
              return el.code !== questionCode
            }
          )
          if (this.conditions[i].questions.length > 0)
            delete this.conditions[i].questions[
              this.conditions[i].questions.length - 1
            ].isAnd
        }
      }
    },
    updateQuestion(groupIndex, oldCode, newCode) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          for (const j in this.conditions[i].questions) {
            if (this.conditions[i].questions[j].code === oldCode) {
              this.conditions[i].questions[j] = {
                code: Number(newCode.target.value),
                options: [],
              }
            }
          }
        }
      }
      this.$forceUpdate()
    },
    getCurrentQuestionOptions(questionCode) {
      const x = this.questions.find((el) => {
        return el.code === questionCode
      })

      return x ? x.options : []
    },
    existsInOption(groupIndex, questionCode, value) {
      return this.conditions
        .find((el) => {
          return el.groupIndex === groupIndex
        })
        .questions.find((el) => {
          return el.code === questionCode
        })
        .options.includes(value)
    },
    addOptionToQuestion(groupIndex, questionCode, value) {
      for (const i in this.conditions) {
        if (this.conditions[i].groupIndex === groupIndex) {
          for (const j in this.conditions[i].questions) {
            if (this.conditions[i].questions[j].code === questionCode) {
              if (this.conditions[i].questions[j].options.includes(value))
                this.conditions[i].questions[j].options = this.conditions[
                  i
                ].questions[j].options.filter((el) => {
                  return el !== value
                })
              else this.conditions[i].questions[j].options.push(value)
            }
          }
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
