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
      v-for="question in responses.questions"
      :key="question.question.code"
      class="flex flex-col mb-10"
    >
      <div class="flex flex-col items-center">
        <div class="flex items-center justify-center">
          <h5>{{ question.question.name }}</h5>
          <p class="bg-primary text-white rounded px-1.5 py-0.5 ml-2">
            {{ question.question.number }}
          </p>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="w-full md:w-3/12 flex py-5 items-start flex flex-col">
          <multi-select
            class="w-full"
            :original-list="getDifferentAnswers(question)"
            :selected-list="selectedAnswers[question.question.code]"
            display-field="text"
            @selectedItems="updateSelectedAnswers(question, $event)"
            ><template v-slot:title>Choose Answers</template></multi-select
          >

          <div class="flex flex-col px-3 py-1 w-full mt-3">
            <label>Contacts' Details </label>
            <select
              v-model="selectedDemographics[question.question.code]"
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
            v-if="aggregateData[question.question.code].length > 1"
            type="ColumnChart"
            :data="aggregateData[question.question.code]"
            :options="getOptions(question.question)"
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
// import { GChart } from 'vue-google-charts'
import multiSelect from '~/components/layouts/MultiSelect'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'SurveyResponses',
  components: { Spinner, multiSelect },

  data() {
    return {
      responses: [],
      loading: true,
      selectedAnswers: [],
      selectedDemographics: [],
      aggregateData: [],
    }
  },

  mounted() {
    this.loading = true
    this.$store
      .dispatch('responses/getResponses', this.$route.params.id)
      .then((response) => {
        this.responses = response
        this.responses.questions.forEach((el) => {
          this.selectedAnswers[el.question.code] = this.getDifferentAnswers(el)
          this.selectedDemographics[el.question.code] = null
          this.aggregateData[el.question.code] = this.getAggregateData(el)
        })

        this.loading = false
      })
      .finally(() => {})
  },
  methods: {
    getDifferentAnswers(question) {
      let data = []
      data.push(
        ...question.question.availableOptions.map((el) => {
          return { text: el.text, code: el.value }
        })
      )
      question.responses.forEach((eachResponse) => {
        eachResponse.chosenOption.forEach((option) => {
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
        return a.text > b.text ? 1 : -1
      })

      return data
    },
    getDifferentDemographics(question) {
      let data = []

      question.responses.forEach((el) => {
        data.push(...Object.keys(el.contact))
      })

      const setValues = new Set(data)
      data = []

      setValues.forEach((el) => {
        data.push({
          text: `${el.substring(0, 1).toUpperCase()}${el.substring(1, el.len)}`,
          code: el,
        })
      })

      data = data.sort((a, b) => {
        return a.text > b.text ? 1 : -1
      })

      return data
    },

    updateSelectedAnswers(question, newList) {
      this.selectedAnswers[question.question.code] = newList
      this.aggregateData[question.question.code] = this.getAggregateData(
        question
      )
      this.$forceUpdate()
    },

    updateDemographics(question) {
      this.aggregateData[question.question.code] = this.getAggregateData(
        question
      )
      this.$forceUpdate()
    },

    getAggregateData(question) {
      const data = []

      const answers = this.selectedAnswers[question.question.code].map((el) => {
        return el.code
      })
      const demographic = this.selectedDemographics[question.question.code]

      if (!demographic) {
        data.push(['Answer', 'Total'])
        answers.forEach((el) => {
          data.push([el, 0])
        })

        question.responses.forEach((response) => {
          response.chosenOption.forEach((option) => {
            const foundObj = data.find((el) => {
              return el[0] === option
            })
            if (foundObj) foundObj[1] += 1
          })
        })
      } else {
        data.push([demographic, ...answers])

        let availableDemographics = new Set()
        const initialValues = new Array(answers.length).fill(0)
        question.responses.forEach((response) => {
          if (response.contact[demographic])
            availableDemographics.add(response.contact[demographic])
        })

        availableDemographics = Array.from(availableDemographics).sort(
          (a, b) => {
            return a > b ? 1 : -1
          }
        )

        availableDemographics.forEach((el) => {
          data.push([el, ...initialValues])
        })

        question.responses.forEach((response) => {
          if (response.contact[demographic]) {
            response.chosenOption.forEach((option) => {
              const foundObj = data.find((el) => {
                return el[0] === response.contact[demographic]
              })
              foundObj[data[0].indexOf(option)] += 1
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
  },
}
</script>

<style scoped></style>
