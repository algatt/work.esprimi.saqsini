<template>
  <div class="flex flex-wrap w-full">
    <div
      v-for="(chart, index) in chartsToDraw"
      :key="index"
      class="w-full flex justify-center items-center mb-20"
      :class="chart.width"
    >
      <component
        :is="chart.type"
        style="max-height: 300px"
        :chart-data="chart.chartData"
        :properties="chart.properties"
      ></component>
    </div>
  </div>
</template>

<script>
import PieChart from '~/components/charts/PieChart'
import colours from '~/assets/settings/colours.json'
import LineChart from '~/components/charts/LineChart'
import BarChart from '~/components/charts/BarChart'
import {
  OPTIONS_PIE_CHART,
  OPTIONS_LINE_CHART,
  OPTIONS_BAR_CHART,
} from '~/assets/settings/charts-settings'
export default {
  name: 'SurveyDetails',
  components: {
    BarChart,
    LineChart,
    PieChart,
  },

  data() {
    return {
      OPTIONS_PIE_CHART,
      OPTIONS_LINE_CHART,
      OPTIONS_BAR_CHART,
      chartsToDraw: [],
    }
  },
  computed: {
    surveyData() {
      return this.$store.state.surveys.surveyData
    },
    sessionStats() {
      const totals = this.surveyData.invitations.reduce(function (sums, entry) {
        sums[entry.lastModified.substring(0, 10)] =
          (sums[entry.lastModified.substring(0, 10)] || 0) + 1
        return sums
      }, {})

      const data = {
        datasets: [
          {
            data: [],
            fill: false,
            borderColor: colours[0],
          },
        ],
        labels: [],
      }

      let tempData = []

      Object.keys(totals).forEach((el) => {
        tempData.push([el, totals[el]])
      })
      tempData = tempData.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1
      })

      tempData.forEach((el) => {
        data.labels.push(el[0])
        data.datasets[0].data.push(el[1])
      })
      return data
    },
    responseRates() {
      const data = {
        datasets: [
          {
            data: [
              this.surveyData.survey.responses,
              this.surveyData.survey.invitees -
                this.surveyData.survey.responses,
            ],
            backgroundColor: colours,
          },
        ],
        labels: ['Replied', 'Did Not Reply'],
      }

      return data
    },
    kioskResponse() {
      const kioskCount = this.surveyData.invitations.filter((el) => {
        return el.flags.includes('KIOSK')
      }).length
      const inviteeCount = this.surveyData.invitations.filter((el) => {
        return !el.flags.includes('KIOSK')
      }).length
      const data = {
        datasets: [
          {
            data: [kioskCount, inviteeCount],
            backgroundColor: colours,
          },
        ],
        labels: ['Kiosk', 'Invited'],
      }
      return data
    },
    totalResponsesPerQuestion() {
      const obj = {}
      this.surveyData.responses.forEach((el) => {
        if (!obj[el.questionCode]) obj[el.questionCode] = []
        if (!obj[el.questionCode].includes(el.token))
          obj[el.questionCode].push(el.token)
      })
      const result = []
      const labels = []
      Object.keys(obj).forEach((el) => {
        result.push(obj[el].length)
        labels.push(
          this.surveyData.questions.find((question) => {
            return String(question.code) === String(el)
          }).name
        )
      })

      return {
        labels,
        datasets: [{ data: result, backgroundColor: colours }],
      }
    },
  },
  mounted() {
    this.chartsToDraw = [
      {
        type: 'pie-chart',
        chartData: this.responseRates,
        properties: { title: 'Response Rate' },
        width: 'md:w-4/12',
      },
      {
        type: 'pie-chart',
        chartData: this.kioskResponse,
        properties: { title: 'Kiosk Vs Invites' },
        width: 'md:w-4/12',
      },
      {
        type: 'line-chart',
        chartData: this.sessionStats,
        properties: {
          title: 'Sessions Statistics',
          xAxes: 'Date',
          yAxes: 'Count',
        },
        width: 'md:w-4/12',
      },
      {
        type: 'bar-chart',
        chartData: this.totalResponsesPerQuestion,
        properties: { title: 'Responses Per Question' },
        width: 'md:w-full',
      },
    ]
  },
}
</script>

<style scoped></style>
