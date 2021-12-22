<template>
  <div class="flex flex-col" :style="`min-height: ${dataChart.height}px`">
    <apexchart
      :options="dataChart.chartOptions"
      :series="dataChart.series"
      height="100%"
      class="w-full"
    ></apexchart>
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

      <template v-if="categories.length === 10">
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
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartLikert',
  components: {},
  props: {
    elements: {
      type: Array,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    },
  },
  computed: {
    categories() {
      return this.elements.map((el) => {
        return el.value
      })
    },
    dataChart() {
      const data = []
      for (const el of this.categories) {
        const foundItems = this.responses.filter((res) => {
          return res.value === el
        }).length
        data.push({ name: el, data: [foundItems] })
      }

      return {
        series: data,
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
      const values = this.responses.map((el) => {
        return Number(el.value)
      })

      const totalNumbers = values.length

      const total = values.reduce((a, v) => {
        return a + v
      })

      return (total / totalNumbers).toFixed(2)
    },
    getNPS() {
      const nps = {
        Detractors: 0,
        Passive: 0,
        Promoters: 0,
        NPS: 0,
      }

      for (const i in this.responses) {
        const which =
          this.responses[i].value < 7
            ? 'Detractors'
            : this.responses[i].value < 9
            ? 'Passive'
            : 'Promoters'

        nps[which] += 1
        nps.NPS += 1
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
