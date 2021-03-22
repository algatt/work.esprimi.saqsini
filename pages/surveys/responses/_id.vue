<template>
  <div v-if="!loading" class="w-11/12 mx-auto pt-5">
    <div class="flex flex-col mb-10">
      <h2 class="mb-5 text-center">
        {{ responses.survey.name }}
      </h2>
      <div class="flex w-full flex-wrap">
        <div class="w-full md:w-4/12 flex flex-col items-center justify-center">
          <h6>Response Rate</h6>
          <g-chart
            type="PieChart"
            :data="getResponseRate()"
            style="min-height: 400px"
          ></g-chart>
        </div>
        <div class="w-full md:w-8/12 flex flex-col items-center justify-center">
          <h6>Responses By Date</h6>
          <g-chart
            type="Calendar"
            :settings="{ packages: ['calendar'] }"
            :data="getResponseRateByDate()"
            style="min-height: 400px; width: 100%"
          ></g-chart>
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-10">
      <h5 class="mb-5 text-center">Cross Tab Evaluation</h5>
      <div class="flex flex-wrap w-full">
        <div class="flex flex-col w-full md:w-3/12">
          <p class="font-semibold mb-5">Questions</p>

          <select v-model="crossTabX" class="input select w-full mb-5">
            <option :value="null">Choose question for X axis</option>
            <option
              v-for="question in responses.questions"
              :key="question.code"
              :value="question"
            >
              {{ question.text }}
            </option>
          </select>

          <select v-model="crossTabY" class="input select w-full mb-5">
            <option :value="null">Choose question for Y axis</option>
            <option
              v-for="question in responses.questions"
              :key="question.code"
              :value="question"
            >
              {{ question.text }}
            </option>
          </select>
        </div>
        <div class="flex w-full md:w-9/12">
          <div v-if="!crossTabX || !crossTabY">
            <p>To display a cross tab you need to select two questions.</p>
          </div>
          <div v-else-if="crossTabX.code === crossTabY.code">
            <p>You need to select different questions</p>
          </div>
          <div v-else>
            <CrossTable :data="getCrossTabData()"></CrossTable>
          </div>
        </div>
      </div>
    </div>
    <div class="flex flex-col mb-10">
      <h5 class="mb-5 text-center">Question Visualisation</h5>
      <div
        v-for="question in responses.questions"
        :key="question.code"
        class="flex flex-col mb-10"
      >
        <div class="flex flex-col items-center">
          <div class="flex items-center justify-center">
            <h6>{{ question.name }}</h6>
            <p class="bg-primary text-white rounded px-1.5 py-0.5 ml-2">
              {{ question.number }}
            </p>
          </div>
        </div>
        <div class="flex flex-wrap">
          <div class="w-full md:w-3/12 flex py-5 items-start flex flex-col">
            <multi-select
              class="w-full"
              :original-list="getDifferentAnswers(question)"
              :selected-list="selectedAnswers[question.code]"
              display-field="text"
              @selectedItems="updateSelectedAnswers(question, $event)"
              ><template v-slot:title>Choose Answers</template></multi-select
            >

            <div class="flex flex-col px-3 py-1 w-full mt-3">
              <label>Contacts' Details </label>
              <select
                v-model="selectedDemographics[question.code]"
                class="input select w-full"
                @change="updateDemographics(question)"
              >
                <option :value="null">All</option>
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
            <g-chart
              v-if="aggregateData[question.code].length > 1"
              type="ColumnChart"
              :data="aggregateData[question.code]"
              :options="getOptions(question)"
              class="w-full"
              style="min-height: 400px"
            ></g-chart>
            <div v-else class="p-5">
              <p>Choose at least one value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { GChart } from 'vue-google-charts'
import MultiSelect from '~/components/layouts/MultiSelect'
import Spinner from '~/components/layouts/Spinner'
import CrossTable from '~/components/charts/CrossTable'

export default {
  name: 'SurveyResponses',
  components: { Spinner, CrossTable, MultiSelect, GChart },

  data() {
    return {
      responses: [],
      loading: true,
      selectedAnswers: [],
      selectedDemographics: [],
      aggregateData: [],
      crossTabX: null,
      crossTabY: null,
    }
  },

  mounted() {
    this.loading = true
    this.$store
      .dispatch('responses/getResponses', this.$route.params.id)
      .then((response) => {
        this.responses = response
        this.responses.questions.forEach((el) => {
          this.selectedAnswers[el.code] = this.getDifferentAnswers(el)
          this.selectedDemographics[el.code] = null
          this.aggregateData[el.code] = this.getAggregateData(el)
        })

        this.loading = false
      })
      .finally(() => {})
  },
  methods: {
    getDifferentAnswers(question) {
      let data = []
      data.push(
        ...question.availableOptions.map((el) => {
          return { text: el.text, code: el.value }
        })
      )

      const responses = this.responses.responses.filter((el) => {
        return el.question === question.code
      })

      responses.forEach((eachResponse) => {
        eachResponse.value.forEach((option) => {
          if (
            !data
              .map((el) => {
                return el.code
              })
              .includes(option)
          )
            data.push({ text: option, code: option })
        })
      })

      data = data.sort((a, b) => {
        return a.code > b.code ? 1 : -1
      })

      return data
    },
    getDifferentDemographics(question) {
      let data = []

      const actuallyResponded = this.responses.responses
        .filter((el) => {
          return el.question === question.code
        })
        .map((el) => {
          return el.invitee
        })

      const respondents = this.responses.invitees.filter((el) => {
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

    updateSelectedAnswers(question, newList) {
      this.selectedAnswers[question.code] = newList
      this.aggregateData[question.code] = this.getAggregateData(question)
      this.$forceUpdate()
    },

    updateDemographics(question) {
      this.aggregateData[question.code] = this.getAggregateData(question)
      this.$forceUpdate()
    },

    getAggregateData(question) {
      const data = []

      let answers = this.selectedAnswers[question.code].map((el) => {
        return el.code
      })
      const demographic = this.selectedDemographics[question.code]

      const responses = this.responses.responses.filter((el) => {
        return el.question === question.code
      })

      if (!demographic) {
        data.push(['Answer', 'Total'])
        answers.forEach((el) => {
          data.push([el, 0])
        })

        responses.forEach((response) => {
          response.value.forEach((option) => {
            const foundObj = data.find((el) => {
              return el[0] === option
            })
            if (foundObj) foundObj[1] += 1
          })
        })
      } else {
        answers = answers.map((el) => {
          return String(el)
        })
        data.push([demographic, ...answers])

        const whichContacts = this.responses.responses
          .filter((el) => {
            return el.question === question.code
          })
          .map((el) => {
            return el.invitee
          })

        const contacts = this.responses.invitees.filter((el) => {
          return whichContacts.includes(el.code)
        })

        let availableDemographics = new Set()
        const initialValues = new Array(answers.length).fill(0)

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
              foundObj[data[0].indexOf(String(option))] += 1
            })
          }
        })
      }

      return data
    },

    getResponseRate() {
      const data = [['Type', 'Total']]
      data.push(['Replied', this.responses.survey.totalRespondents])
      data.push([
        'Did Not Reply',
        this.responses.survey.totalInvites -
          this.responses.survey.totalRespondents,
      ])
      return data
    },
    getResponseRateByDate() {
      const data = [['Date', 'Count']]
      const dateCounts = {}
      this.responses.sessions.forEach((el) => {
        if (!dateCounts[el.finishedAt]) dateCounts[el.finishedAt] = 0
        dateCounts[el.finishedAt] += 1
      })
      let tempData = []
      Object.keys(dateCounts).forEach((el) => {
        tempData.push([
          new Date(el.substring(0, 4), el.substring(4, 6), el.substring(6, 8)),
          dateCounts[el],
        ])
      })
      tempData = tempData.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1
      })
      data.push(...tempData)
      return data
    },

    getOptions(question) {
      return {
        title: question.text,
        vAxis: {
          format: '###',
          viewWindow: { min: 0 },
          gridlines: { color: 'transparent' },
        },
        hAxis: {
          format: '###',
          viewWindow: { min: 0 },
          gridlines: { color: 'transparent' },
        },
        isStacked: !!this.selectedDemographics[question.code],
      }
    },

    getCrossTabData() {
      const xAxis = this.getDifferentAnswers(this.crossTabX).map((el) => {
        return el.code
      })
      const yAxis = this.getDifferentAnswers(this.crossTabY).map((el) => {
        return el.code
      })

      const data = []
      data.push(['', ...xAxis])
      yAxis.forEach((el) => {
        data.push([el, ...new Array(xAxis.length).fill(0)])
      })

      const xAnswers = []

      const xResponses = this.responses.responses.filter((el) => {
        return el.question === this.crossTabX.code
      })

      xResponses.forEach((response) => {
        response.value.forEach((el) => {
          xAnswers.push([response.invitee, el])
        })
      })

      const yAnswers = []

      const yResponses = this.responses.responses.filter((el) => {
        return el.question === this.crossTabY.code
      })

      yResponses.forEach((response) => {
        response.value.forEach((el) => {
          yAnswers.push([response.invitee, el])
        })
      })

      xAnswers.forEach((eachXAnswer) => {
        const tempYAnswers = yAnswers.filter((el) => {
          return el[0] === eachXAnswer[0]
        })
        tempYAnswers.forEach((eachTempYAnswer) => {
          data.find((el) => {
            return el[0] === eachTempYAnswer[1]
          })[xAxis.indexOf(eachXAnswer[1]) + 1] += 1
        })
      })

      return data
    },
  },
}
</script>

<style scoped></style>
