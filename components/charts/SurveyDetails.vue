<template>
  <div class="flex flex-wrap w-full">
    <div class="w-full md:w-4/12 flex justify-center items-center mb-20">
      <pie-chart
        style="max-height: 300px"
        :chart-data="responseRates"
        :options="{
          title: {
            display: true,
            text: 'Response Rate',
            fontSize: 16,
            fontFamily: 'Poppins',
          },
          legend: {
            position: 'bottom',
            labels: { fontFamily: 'Poppins' },
          },
          maintainAspectRatio: false,
          responsive: true,
        }"
      ></pie-chart>
    </div>
    <div class="w-full md:w-4/12 flex justify-center items-center mb-20">
      <pie-chart
        style="max-height: 300px"
        :chart-data="kioskResponse"
        :options="{
          title: {
            display: true,
            text: 'Kiosk vs Invites',
            fontSize: 16,
            fontFamily: 'Poppins',
          },
          legend: {
            position: 'bottom',
            labels: { fontFamily: 'Poppins' },
          },
          maintainAspectRatio: false,
          responsive: true,
        }"
      ></pie-chart>
    </div>
    <template v-if="false">
      <div
        v-for="(item, index) in differentKeys"
        :key="index"
        class="w-full md:w-4/12 flex justify-center items-center mb-20"
      >
        <pie-chart
          v-if="getTotalForKey(item).datasets[0].data.length < 4"
          style="max-height: 300px"
          :chart-data="getTotalForKey(item)"
          :options="{
            title: {
              display: true,
              text: item,
              fontSize: 16,
              fontFamily: 'Poppins',
            },
            legend: {
              position: 'bottom',
              labels: { fontFamily: 'Poppins' },
            },
            maintainAspectRatio: false,
            responsive: true,
          }"
        ></pie-chart>
        <bar-chart
          v-else
          style="max-height: 300px"
          :chart-data="getTotalForKey(item)"
          :options="{
            title: {
              display: true,
              text: item,
              fontSize: 16,
              fontFamily: 'Poppins',
            },
            legend: {
              display: false,
            },
            maintainAspectRatio: false,
            responsive: true,
            scales: {
              xAxes: [
                {
                  display: true,
                  gridLines: {
                    display: true,
                    drawBorder: true,
                    drawOnChartArea: false,
                  },
                  scaleLabel: {
                    display: false,
                  },
                },
              ],
              yAxes: [
                {
                  display: true,
                  gridLines: {
                    display: true,
                    drawBorder: true,
                    drawOnChartArea: false,
                  },
                  scaleLabel: {
                    display: true,
                    labelString: 'Count',
                  },
                  ticks: {
                    beginAtZero: true,
                  },
                },
              ],
            },
          }"
        ></bar-chart>
      </div>
    </template>
    <div class="w-full md:w-4/12 flex justify-center items-center mb-20">
      <line-chart
        :chart-data="sessionStats"
        :options="{
          title: {
            display: true,
            text: 'Response by Date',
            fontSize: 16,
            fontFamily: 'Poppins',
          },
          legend: {
            display: false,
          },
          maintainAspectRatio: false,
          responsive: true,
          scales: {
            xAxes: [
              {
                display: true,
                gridLines: {
                  display: true,
                  drawBorder: true,
                  drawOnChartArea: false,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Date',
                },
              },
            ],
            yAxes: [
              {
                display: true,
                gridLines: {
                  display: true,
                  drawBorder: true,
                  drawOnChartArea: false,
                },
                scaleLabel: {
                  display: true,
                  labelString: 'Count',
                },
                ticks: {
                  beginAtZero: true,
                },
              },
            ],
          },
        }"
      ></line-chart>
    </div>
  </div>
</template>

<script>
// import { GChart } from 'vue-google-charts'
import PieChart from '~/components/charts/PieChart'
import colours from '~/assets/settings/colours.json'
import LineChart from '~/components/charts/LineChart'
import BarChart from '~/components/charts/BarChart'
export default {
  name: 'SurveyDetails',
  components: {
    BarChart,
    LineChart,
    PieChart,
    // GChart,
  },
  props: {
    details: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sessionStats() {
      const totals = this.details.invitees.reduce(function (sums, entry) {
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
      // new Date(el.substring(0, 4), el.substring(4, 6), el.substring(6, 8))
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
              this.details.survey.responses,
              this.details.survey.invitees - this.details.survey.responses,
            ],
            backgroundColor: colours,
          },
        ],
        labels: ['Replied', 'Did Not Reply'],
      }

      return data
    },
    kioskResponse() {
      const kioskCount = this.details.invitees.filter((el) => {
        return el.flags.includes('KIOSK')
      }).length
      const inviteeCount = this.details.invitees.filter((el) => {
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
      const data = {
        datasets: [
          {
            data: [],
            backgroundColor: colours,
          },
        ],
        labels: [],
      }

      const totals = this.details.invitees.reduce(function (sums, entry) {
        sums[entry[key.toLowerCase()]] =
          (sums[entry[key.toLowerCase()]] || 0) + 1
        return sums
      }, {})
      Object.keys(totals).forEach((el) => {
        data.datasets[0].data.push(totals[el])
      })
      data.labels = Object.keys(totals)

      return data
    },
  },
}
</script>

<style scoped></style>
