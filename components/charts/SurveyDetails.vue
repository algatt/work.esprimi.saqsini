<template>
  <div class="flex w-full flex-col">
    <div class="flex flex-wrap">
      <div class="w-full md:w-4/12">
        <g-chart
          type="PieChart"
          :data="responseRates"
          :options="{
            title: 'Response Rate',
            legend: { position: 'bottom' },
            titleTextStyle: {
              fontSize: 16,
              fontName: 'Poppins',
            },
          }"
          style="min-height: 400px"
        ></g-chart>
      </div>
      <div
        v-for="(item, index) in differentKeys"
        :key="index"
        class="w-full md:w-4/12"
      >
        <g-chart
          :type="getTotalForKey(item).length > 4 ? 'BarChart' : 'PieChart'"
          :data="getTotalForKey(item)"
          :options="{
            title: item,
            titleTextStyle: {
              fontSize: 16,
              fontName: 'Poppins',
            },
            legend: { position: 'bottom' },
          }"
          style="min-height: 400px"
        ></g-chart>
      </div>
    </div>
    <div class="flex w-full">
      <div class="flex w-full md:w-8/12">
        <g-chart
          type="LineChart"
          :data="sessionStats"
          :options="{
            title: 'Response by Date',
            titleTextStyle: {
              fontSize: 16,
              fontName: 'Poppins',
            },
            hAxis: {
              format: 'MMM d, y',
              ticks: ticks,
            },
            vAxis: {
              format: '###',
            },
            legend: { position: 'bottom' },
          }"
          class="w-full md:w-6/12"
          style="min-height: 400px; width: 100%"
        >
        </g-chart>
      </div>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  name: 'SurveyDetails',
  components: {
    GChart,
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    ticks() {
      let temp = this.sessionStats.map((el) => {
        if (el[0] !== 'Date') return el[0]
      })
      temp = temp.filter((el) => {
        return el
      })
      return temp
    },
    sessionStats() {
      const totals = this.details.sessions.reduce(function (sums, entry) {
        sums[entry.finishedAt] = (sums[entry.finishedAt] || 0) + 1
        return sums
      }, {})

      const data = [['Date', 'Count']]
      let tempData = []

      Object.keys(totals).forEach((el) => {
        tempData.push([
          new Date(el.substring(0, 4), el.substring(4, 6), el.substring(6, 8)),
          totals[el],
        ])
      })
      tempData = tempData.sort((a, b) => {
        return a[0] > b[0] ? 1 : -1
      })
      data.push(...tempData)
      return data
    },

    responseRates() {
      const data = [['Type', 'Total']]
      data.push(['Replied', this.details.survey.totalRespondents])
      data.push([
        'Did Not Reply',
        this.details.survey.totalInvites - this.details.survey.totalRespondents,
      ])
      return data
    },
    differentKeys() {
      const keys = []
      this.details.invitees.forEach((el) => {
        Object.keys(el).forEach((key) => {
          const tempKey =
            key.substring(0, 1).toUpperCase() + key.substring(1, key.length)
          if (!keys.includes(tempKey) && tempKey !== 'Code') keys.push(tempKey)
        })
      })
      return keys.sort((a, b) => {
        return a > b ? 1 : -1
      })
    },
  },
  methods: {
    getTotalForKey(key) {
      const data = [[key, 'Total']]
      const totals = this.details.invitees.reduce(function (sums, entry) {
        sums[entry[key.toLowerCase()]] =
          (sums[entry[key.toLowerCase()]] || 0) + 1
        return sums
      }, {})
      Object.keys(totals).forEach((el) => {
        data.push([el, totals[el]])
      })
      return data
    },
  },
}
</script>

<style scoped></style>
