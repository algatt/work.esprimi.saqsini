<template>
  <div class="flex flex-col items-center w-full">
    <div class="flex space-x-2 items-center">
      <span>Base</span
      ><span class="font-semibold bg-gray-100 rounded px-1 py-0.5">
        {{
          datasets.data.reduce((acc, val) => {
            return (acc += val)
          })
        }}</span
      >
    </div>
    <div class="flex w-full" :style="`height: ${chartData.height}px`">
      <apexchart
        :options="chartData.chartOptions"
        :series="chartData.series"
        height="100%"
        class="w-full"
      ></apexchart>
    </div>

    <div class="flex flex-wrap justify-center items-center space-x-5 mt-4">
      <div class="flex flex-col border border-gray-200 shadow-sm w-24">
        <span
          class="flex justify-center p-2 font-semibold border-b border-gray-200 bg-gray-50"
          >Average</span
        >
        <span class="flex justify-center p-2 font-semibold text-lg">{{
          calculateAverage()
        }}</span>
      </div>
      <template v-if="datasets.data.length === 10">
        <div
          v-for="(item, index) in getNPS()"
          :key="index"
          class="flex flex-col border border-gray-200 shadow-sm w-24"
        >
          <span
            class="flex justify-center p-2 font-semibold border-b border-gray-200 bg-gray-50"
            >{{ item.title }}</span
          >
          <span
            class="flex justify-center p-2 font-semibold text-lg"
            :class="
              item.title === 'NPS'
                ? item.value < 0
                  ? 'text-red-500'
                  : item.value > 0
                  ? 'text-green-500'
                  : null
                : null
            "
            ><template v-if="item.title === 'NPS'">{{
              item.value.toFixed(2)
            }}</template
            ><template v-else>{{ item.value }}</template></span
          >
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import { getDataAggregate } from '~/services/question-helpers'
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartLikert',
  components: {},
  props: {
    data: {
      type: Object,
      required: true,
    },
    selectedList: {
      type: Array,
      required: true,
    },
  },
  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    datasets() {
      const selectedList = this.selectedList.map((el) => {
        return el.code
      })

      return getDataAggregate(this.legendData, selectedList, this.data)
    },
    chartData() {
      const formattedData = []
      for (let i = 0; i < this.datasets.labels.length; i++) {
        formattedData.push({
          name: this.datasets.labels[i],
          data: [this.datasets.data[i]],
        })
      }
      return {
        series: formattedData,
        chartOptions: {
          colors: REPORT_CHART_SETTINGS.colors,
          chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
            height: '250px',
          },
          plotOptions: {
            bar: {
              horizontal: true,
            },
          },
          legend: {
            position: 'bottom',
            horizontalAlign: 'center',
          },
          xaxis: {
            categories: ['Distribution'],
          },
        },
        height: '250',
      }
    },
  },

  methods: {
    calculateAverage() {
      let total = 0
      let average = 0
      for (const i in this.datasets.data) {
        total += this.datasets.data[i]
        average += this.datasets.data[i] * this.datasets.labels[i]
      }

      return Math.round((average / total) * 100) / 100
    },
    getNPS() {
      const nps = {
        Detractors: 0,
        Passive: 0,
        Promoters: 0,
        NPS: 0,
      }

      for (const i in this.datasets.data) {
        const which =
          this.datasets.labels[i] < 7
            ? 'Detractors'
            : this.datasets.labels[i] < 9
            ? 'Passive'
            : 'Promoters'

        nps[which] += this.datasets.data[i]
        nps.NPS += this.datasets.data[i]
      }

      nps.NPS = ((nps.Promoters - nps.Detractors) / nps.NPS) * 100

      const x = []
      Object.keys(nps).forEach((el) => {
        x.push({ title: el, value: nps[el] })
      })

      return x
    },
  },
}
</script>
