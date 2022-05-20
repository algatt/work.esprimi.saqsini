<template>
  <div class="flex flex-wrap w-full">
    <div
      v-for="(chart, index) in chartsToDraw"
      :key="index"
      class="w-full flex justify-center items-center mb-10"
      :class="chart.class"
      :style="`height: ${chart.height}px`"
    >
      <apexchart
        :options="chart.chartOptions"
        :series="chart.series"
        height="100%"
        class="w-full"
      ></apexchart>
    </div>
  </div>
</template>

<script>
import {
  PIE_CHART_SETTINGS,
  LINE_CHART_SETTINGS,
  HORIZONTAL_BAR_CHART_SETTINGS,
  REPORT_CHART_SETTINGS,
} from '@/assets/settings/charts-settings'

export default {
  name: 'SurveyDetails',

  data() {
    return {
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

      const obj = {
        data: [],
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
        obj.labels.push(el[0])
        obj.data.push(el[1])
      })
      return obj
    },
    responseRates() {
      return {
        data: [
          this.surveyData.survey.responses,
          this.surveyData.survey.invitees - this.surveyData.survey.responses,
        ],
        labels: ['Replied', 'Did Not Reply'],
      }
    },
    kioskResponse() {
      const kioskCount = this.surveyData.invitations.filter((el) => {
        return el.flags.includes('KIOSK')
      }).length
      const inviteeCount = this.surveyData.invitations.filter((el) => {
        return !el.flags.includes('KIOSK')
      }).length
      return {
        data: [kioskCount, inviteeCount],
        labels: ['Kiosk', 'Invited'],
      }
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
        data: result,
      }
    },
  },
  mounted() {
    this.chartsToDraw = [
      {
        ...PIE_CHART_SETTINGS(
          this.responseRates.labels,
          this.responseRates.data,
          'Response Rate'
        ),
        class: 'w-full lg:w-6/12',
        height: 300,
      },
      {
        ...PIE_CHART_SETTINGS(
          this.kioskResponse.labels,
          this.kioskResponse.data,
          'Kiosk Response Rate'
        ),
        class: 'w-full lg:w-6/12',
        height: 300,
      },
      {
        ...LINE_CHART_SETTINGS(
          this.sessionStats.labels,
          this.sessionStats.data,
          'Daily Responses',
          'Responses'
        ),
        class: 'w-full px-20',
        height: 300,
      },
      {
        ...HORIZONTAL_BAR_CHART_SETTINGS(
          this.totalResponsesPerQuestion.labels,
          this.totalResponsesPerQuestion.data,
          'Responses per Question',
          'Responses'
        ),
        class: 'w-full px-20',
        height:
          this.totalResponsesPerQuestion.data.length < 6
            ? 300
            : REPORT_CHART_SETTINGS.horizontalBar.barHeight *
              this.totalResponsesPerQuestion.data.length,
      },
    ]
  },
}
</script>

<style></style>
