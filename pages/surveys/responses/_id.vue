<template>
  <div v-if="!loading" class="w-11/12 mx-auto pt-5">
    <div class="flex flex-col">
      <h3 class="mb-10">
        {{ responses.survey.name }}
      </h3>
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
    <div
      v-for="response in responses.questions"
      :key="response.question.code"
      class="flex flex-col mb-10"
    >
      <div class="flex flex-col items-center">
        <div class="flex items-center justify-center">
          <h5>{{ response.question.name }}</h5>
          <p class="bg-primary text-white rounded px-1.5 py-0.5 ml-2">
            {{ response.question.number }}
          </p>
        </div>
      </div>
      <div
        :key="response.question.code + ' ' + legend[response.question.code]"
        class="flex flex-wrap"
      >
        <div class="w-full md:w-3/12 flex py-5 items-start flex flex-col">
          <multi-select
            class="w-full"
            :original-list="getAnswers(response)"
            :selected-list="selectedValues[response.question.code]"
            display-field="text"
            @selectedItems="updatedSelectedValues(response, $event)"
            ><template v-slot:title>Choose Answers</template></multi-select
          >

          <div class="flex flex-col px-3 py-1 w-full mt-3">
            <label>Contacts' Details </label>
            <select
              v-model="legend[response.question.code]"
              class="input select w-full"
              @change="updateLegend(response)"
            >
              <option :value="null">all</option>
              <option
                v-for="(option, index) in legendContact"
                :key="index"
                :value="option"
              >
                {{ option }}
              </option>
            </select>
          </div>
        </div>
        <div class="w-full flex justify-center items-center md:w-9/12">
          <g-chart
            v-if="responsesGrouped[response.question.code].length > 1"
            type="ColumnChart"
            :data="responsesGrouped[response.question.code]"
            :options="getOptions(response.question)"
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
  <spinner v-else></spinner>
</template>

<script>
import { GChart } from 'vue-google-charts'
import multiSelect from '~/components/layouts/MultiSelect'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'SurveyResponses',
  components: { GChart, multiSelect, Spinner },

  data() {
    return {
      legend: {},
      selectedValues: [],
      legendContact: [],
      responsesGrouped: {},
      responses: [],
      loading: true,
    }
  },

  computed: {
    // responses() {
    //   return this.$store.getters.getItems('responses').questions
    // },
  },

  mounted() {
    this.loading = true
    this.$store
      .dispatch('responses/getResponses', this.$route.params.id)
      .then((response) => {
        this.responses = response
        this.responses.questions.forEach((el) => {
          this.legend[el.question.code] = null
          this.selectedValues[el.question.code] = this.getAnswers(el)
        })
        this.generateLegendItems()
        this.generateResponses()
        this.loading = false
      })
      .finally(() => {})
  },
  methods: {
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
      this.responses.survey.submittedTime.forEach((el) => {
        if (!dateCounts[el]) dateCounts[el] = 0
        dateCounts[el] += 1
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
    getAnswers(question) {
      let dataValues = []

      if (question.question.availableOptions) {
        question.question.availableOptions.forEach((el) => {
          dataValues.push({ code: String(el.value), text: String(el.text) })
        })
      }

      question.responses.forEach((response) => {
        response.chosenOption.forEach((option) => {
          const existingOnes = dataValues.map((el) => {
            return el.code
          })

          if (!existingOnes.includes(String(option)))
            dataValues.push({ code: String(option), text: String(option) })
        })
      })

      dataValues = dataValues.sort((a, b) => {
        return a > b ? 1 : -1
      })

      return dataValues
    },

    updatedSelectedValues(response, newSelection) {
      this.selectedValues[response.question.code] = newSelection
      this.responsesGrouped[response.question.code] = !this.legend[
        response.question.code
      ]
        ? this.getDataAll(response)
        : this.getDataSplit(response, this.legend[response.question.code])
      this.$forceUpdate()
    },

    getDataAll(question) {
      const data = {}
      question.question.availableOptions.forEach((el) => {
        data[el.value] = { text: el.text, count: 0 }
      })
      question.responses.forEach((el) => {
        el.chosenOption.forEach((answer) => {
          data[answer].count += 1
        })
      })
      const dataForChart = [['Response', 'Count']]
      Object.keys(data).forEach((key) => {
        const chosenItems = this.selectedValues[question.question.code].map(
          (el) => {
            return el.code
          }
        )
        if (chosenItems.includes(key)) dataForChart.push([key, data[key].count])
      })

      return dataForChart
    },
    getDataSplit(question, fieldName) {
      const data = []
      let options = []

      question.responses.forEach((el) => {
        if (!options.includes(String(el.contact[fieldName])))
          options.push(String(el.contact[fieldName]))
      })

      options = options.sort((a, b) => {
        return a > b ? -1 : 1
      })

      data.push([fieldName, ...options])

      const differentValues = {}
      question.responses.forEach((el) => {
        const whichColumn = String(el.contact[fieldName])
        el.chosenOption.forEach((subEl) => {
          if (!differentValues[subEl])
            differentValues[subEl] = Array(options.length).fill(0)
          differentValues[subEl][options.indexOf(whichColumn)] += 1
        })
      })

      let dataValues = []

      const chosenItems = this.selectedValues[question.question.code].map(
        (el) => {
          return el.code
        }
      )

      Object.keys(differentValues).forEach((el) => {
        if (chosenItems.includes(el))
          dataValues.push([el, ...differentValues[el]])
      })

      if (question.question.availableOptions) {
        question.question.availableOptions.forEach((el) => {
          if (
            !Object.keys(differentValues).includes(String(el.value)) &&
            chosenItems.includes(el.value)
          )
            dataValues.push([el.value, ...Array(options.length).fill(0)])
        })
      }

      dataValues = dataValues.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1
      })

      data.push(...dataValues)

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
        isStacked: !!this.legend[question.code],
      }
    },
    updateLegend(response) {
      this.generateResponses(response)
      this.$forceUpdate()
    },
    generateResponses(response) {
      if (!response) {
        this.responsesGrouped = {}
        this.responses.questions.forEach((el) => {
          if (!this.legend[el.question.code])
            this.responsesGrouped[el.question.code] = this.getDataAll(el)
          else
            this.responsesGrouped[el.question.code] = this.getDataSplit(
              el,
              this.legend[el.question.code]
            )
        })
      } else if (!this.legend[response.question.code])
        this.responsesGrouped[response.question.code] = this.getDataAll(
          response
        )
      else
        this.responsesGrouped[response.question.code] = this.getDataSplit(
          response,
          this.legend[response.question.code]
        )
    },
    generateLegendItems() {
      this.legendContact = []
      this.responses.questions.forEach((el) => {
        el.responses.forEach((subEl) => {
          if (subEl.contact) {
            Object.keys(subEl.contact).forEach((item) => {
              if (!this.legendContact.includes(item))
                this.legendContact.push(item)
            })
          }
          if (subEl.contactList) {
            Object.keys(subEl.contactList).forEach((item) => {
              if (!this.legendContact.includes(item))
                this.legendContact.push(item)
            })
          }
        })
      })
    },
  },
}
</script>

<style scoped></style>
