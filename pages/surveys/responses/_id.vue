<template>
  <div v-if="!loading" class="w-11/12 mx-auto pt-5">
    <div
      v-for="response in responses"
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
        <h6>{{ response.question.text }}</h6>
      </div>
      <div
        :key="response.question.code + ' ' + legend[response.question.code]"
        class="flex"
      >
        <div class="w-full md:w-3/12 flex py-5 items-start">
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
        <div class="w-full md:w-9/12">
          <g-chart
            type="ColumnChart"
            :data="responsesGrouped[response.question.code]"
            :options="getOptions(response.question.code)"
            style="min-height: 400px"
          ></g-chart>
        </div>
      </div>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { GChart } from 'vue-google-charts'
import viewMixin from '~/helpers/viewMixin'

export default {
  name: 'SurveyResponses',
  components: { GChart },
  mixins: [viewMixin],
  data() {
    return {
      legend: {},
      legendContact: [],
      responsesGrouped: {},
    }
  },

  computed: {
    responses() {
      return this.$store.getters.getItems('responses').questions
    },
  },
  created() {
    this.updateData()
  },
  mounted() {
    this.responses.forEach((el) => {
      this.legend[el.question.code] = null
    })
    this.generateLegendItems()
    this.generateResponses(null)
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('setLoading', true)
      await this.$store.dispatch(
        'responses/getResponses',
        this.$route.params.id
      )
      await this.$store.dispatch('setLoading', false)
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
        dataForChart.push([key, data[key].count])
      })
      return dataForChart
    },
    getDataSplit(question, fieldName) {
      const data = []
      let options = []

      question.responses.forEach((el) => {
        if (!options.includes(el.contact[fieldName]))
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

      Object.keys(differentValues).forEach((el) => {
        dataValues.push([el, ...differentValues[el]])
      })

      if (question.question.availableOptions) {
        question.question.availableOptions.forEach((el) => {
          if (!Object.keys(differentValues).includes(String(el.value)))
            dataValues.push([el.value, ...Array(options.length).fill(0)])
        })
      }

      dataValues = dataValues.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1
      })

      data.push(...dataValues)

      return data
    },
    getOptions(questionCode) {
      return {
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
        isStacked: !!this.legend[questionCode],
      }
    },
    updateLegend(response) {
      this.generateResponses(response)
      this.$forceUpdate()
    },
    generateResponses(response) {
      if (!response) {
        this.responsesGrouped = {}
        this.responses.forEach((el) => {
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
      this.responses.forEach((el) => {
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
