<template>
  <div v-if="!loading">
    <div
      v-for="question in data.questions"
      :key="question.code"
      class="flex flex-col mb-16"
    >
      <div class="flex flex-col items-center">
        <div class="flex">
          <h6>{{ question.name }}</h6>
          <p class="bg-primary text-white rounded px-1.5 py-0.5 ml-2">
            {{ question.number }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="w-full md:w-3/12 flex py-5 items-start flex flex-col">
          <span class="p-4">
            <span class="text-gray-700 font-semibold"
              >{{ getQuestionType(question.type).text }}
              <i
                :class="getQuestionType(question.type).icon"
                class="text-gray-400 ml-2"
              ></i>
            </span>
          </span>
          <multi-select
            class="w-full"
            :original-list="getDifferentAnswers(question)"
            :selected-list="selectedAnswers[question.code]"
            display-field="text"
            @selectedItems="updateSelectedAnswers(question, $event)"
            ><template v-slot:title>Choose Answers</template></multi-select
          >

          <div class="flex flex-col px-3 py-1 w-full mt-3">
            <select
              v-model="selectedDemographics[question.code]"
              class="input select w-full"
              @change="updateDemographics(question)"
            >
              <option :value="null">No Aggregation</option>
              <option
                v-for="(option, index) in getDifferentDemographics(question)"
                :key="index"
                :value="option.code"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
        <div class="w-full flex justify-center items-center md:w-9/12">
          <question-chart-element
            v-if="selectedAnswers[question.code].length !== 0"
            :chart-data="aggregateData[question.code]"
            :question="question"
          ></question-chart-element>
          <div v-else class="p-5">
            <p>Choose at least one value</p>
          </div>
        </div>
      </div>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { getDifferentAnswers } from '~/helpers/chartHelpers'
import MultiSelect from '~/components/layouts/MultiSelect'
import Spinner from '~/components/layouts/Spinner'
import QuestionChartElement from '~/components/charts/QuestionChartElement'
import { QUESTION_TYPES } from '~/helpers/constants'

export default {
  name: 'QuestionDetails',
  components: { QuestionChartElement, Spinner, MultiSelect },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      selectedAnswers: [],
      aggregateData: [],
      selectedDemographics: [],
      loading: true,
    }
  },
  mounted() {
    this.loading = true
    this.data.questions.forEach((el) => {
      this.selectedAnswers[el.code] = getDifferentAnswers(
        el,
        this.data.responses
      )
      this.selectedDemographics[el.code] = null
      this.aggregateData[el.code] = this.getAggregateData(el)
      this.loading = false
    })
  },
  methods: {
    getQuestionType(type) {
      return QUESTION_TYPES[type]
    },
    getDifferentAnswers(question) {
      return getDifferentAnswers(question, this.data.responses)
    },

    updateSelectedAnswers(question, newList) {
      this.selectedAnswers[question.code] = newList
      this.aggregateData[question.code] = this.getAggregateData(question)
      this.$forceUpdate()
    },
    getAggregateData(question) {
      const data = []

      const answers = this.selectedAnswers[question.code].map((el) => {
        return el.code
      })
      const demographic = this.selectedDemographics[question.code]

      const responses = this.data.responses.filter((el) => {
        return el.question === question.code
      })

      if (!demographic) {
        data.push(['Answer', 'Total', { type: 'string', role: 'annotation' }])
        answers.forEach((el) => {
          data.push([el, 0, ''])
        })

        responses.forEach((response) => {
          response.value.forEach((option) => {
            const foundObj = data.find((el) => {
              return el[0] === option
            })
            if (foundObj) {
              foundObj[1] += 1
              foundObj[2] = Number(foundObj[2]) + 1
            }
          })
        })
      } else {
        if (answers.length < 1) return null
        data.push([demographic])

        for (let i = 0; i < answers.length; i++)
          data[0].push(String(answers[i]), {
            role: 'annotation',
            type: 'string',
          })

        const whichContacts = this.data.responses
          .filter((el) => {
            return el.question === question.code
          })
          .map((el) => {
            return el.invitee
          })

        const contacts = this.data.invitees.filter((el) => {
          return whichContacts.includes(el.code)
        })

        let availableDemographics = new Set()
        const initialValues = new Array(data[0].length - 1).fill(0)

        contacts.forEach((contact) => {
          if (contact[demographic])
            availableDemographics.add(contact[demographic])
        })

        availableDemographics = Array.from(availableDemographics).sort(
          (a, b) => {
            return a > b ? 1 : -1
          }
        )

        availableDemographics.forEach((el) => {
          data.push([el, ...initialValues])
        })

        responses.forEach((response) => {
          const contact = contacts.find((el) => {
            return el.code === response.invitee
          })
          if (contact[demographic]) {
            response.value.forEach((option) => {
              const foundObj = data.find((el) => {
                return el[0] === contact[demographic]
              })

              const index = data[0].indexOf(String(option))

              if (index !== -1) {
                foundObj[index] += 1
                foundObj[index + 1] = foundObj[index]
              }
            })
          }
        })

        for (let i = 1; i < data.length; i++) {
          for (let j = 2; j < data[i].length; j += 2) {
            if (data[i][j] === 0) data[i][j] = null
          }
        }
      }

      return data
    },
    getDifferentDemographics(question) {
      let data = []

      const actuallyResponded = this.data.responses
        .filter((el) => {
          return el.question === question.code
        })
        .map((el) => {
          return el.invitee
        })

      const respondents = this.data.invitees.filter((el) => {
        return actuallyResponded.includes(el.code)
      })

      respondents.forEach((el) => {
        data.push(...Object.keys(el))
      })

      const setValues = new Set(data)
      data = []

      setValues.forEach((el) => {
        if (el !== 'code')
          data.push({
            text: `${el.substring(0, 1).toUpperCase()}${el.substring(
              1,
              el.len
            )}`,
            code: el,
          })
      })

      data = data.sort((a, b) => {
        return a.text > b.text ? 1 : -1
      })

      return data
    },
    updateDemographics(question) {
      this.aggregateData[question.code] = this.getAggregateData(question)
      this.$forceUpdate()
    },
  },
}
</script>

<style scoped></style>
