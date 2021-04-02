<template>
  <div class="flex flex-col items-center">
    <horizontal-bar-chart
      :chart-data="datasets"
      :options="options"
    ></horizontal-bar-chart>
    <div class="w-full flex justify-center items-center mb-5">
      <h6>Average Score</h6>

      <span
        class="ml-2 text-lg font-semibold bg-primary text-white rounded px-2"
        ><template v-if="datasets.datasets.length === 1">{{
          calculateAverage()
        }}</template
        ><template v-else>{{ calculateAverageAggregation() }}</template></span
      >
    </div>
    <div
      v-if="datasets.datasets[0].data.length === 10"
      class="flex flex-wrap justify-center"
    >
      <span
        v-for="(item, index) in datasets.datasets.length === 1
          ? getNPS()
          : getNPSAggregation()"
        :key="index"
        class="flex flex-col border border-gray-200 shadow-sm w-32 mx-4 my-4"
      >
        <span
          class="flex justify-center p-2 font-semibold border-b border-gray-200 bg-gray-50"
          >{{ item.title }}</span
        >
        <span
          class="flex justify-center p-4 font-semibold text-xl"
          :class="
            item.title === 'Score'
              ? item.value < 0
                ? 'text-red-500'
                : item.value > 0
                ? 'text-green-500'
                : null
              : null
          "
          >{{ item.value }}</span
        >
      </span>
    </div>
  </div>
</template>

<script>
import HorizontalBarChart from '~/components/charts/HorizontalBarChart'
import { getDataAggregate } from '~/helpers/chartHelpers'

export default {
  name: 'ChartLikert',
  components: { HorizontalBarChart },
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
  data() {
    return {
      options: {
        responsive: false,
        maintainAspectRatio: false,
        legend: {
          display: false,
        },

        scales: {
          xAxes: [
            {
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
              },
              ticks: {
                beginAtZero: true,
                precision: 0,
              },
            },
          ],
          yAxes: [
            {
              gridLines: {
                display: true,
                drawBorder: true,
                drawOnChartArea: false,
              },
            },
          ],
        },
      },
    }
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
  },

  methods: {
    calculateAverage() {
      let total = 0
      let average = 0
      for (const i in this.datasets.datasets[0].data) {
        total += this.datasets.datasets[0].data[i]
        average += this.datasets.datasets[0].data[i] * this.datasets.labels[i]
      }

      return Math.round((average / total) * 100) / 100
    },
    calculateAverageAggregation() {
      let total = 0
      let average = 0
      for (const i in this.datasets.datasets) {
        for (const j in this.datasets.datasets[i].data) {
          total += this.datasets.datasets[i].data[j]
          average += this.datasets.datasets[i].data[j] * this.datasets.labels[j]
        }
      }

      return Math.round((average / total) * 100) / 100
    },
    getNPS() {
      const nps = {
        Detractors: 0,
        Passive: 0,
        Promoters: 0,
        Score: 0,
      }

      for (const i in this.datasets.datasets[0].data) {
        const which =
          this.datasets.labels[i] < 7
            ? 'Detractors'
            : this.datasets.labels[i] < 9
            ? 'Passive'
            : 'Promoters'

        nps[which] += this.datasets.datasets[0].data[i]
        nps.Score += this.datasets.datasets[0].data[i]
      }

      nps.Score = ((nps.Promoters - nps.Detractors) / nps.Score) * 100

      const x = []
      Object.keys(nps).forEach((el) => {
        x.push({ title: el, value: nps[el] })
      })

      return x
    },
    getNPSAggregation() {
      const nps = {
        Detractors: 0,
        Passive: 0,
        Promoters: 0,
        Score: 0,
      }

      for (const i in this.datasets.datasets) {
        for (const j in this.datasets.datasets[i].data) {
          const which =
            this.datasets.labels[j] < 7
              ? 'Detractors'
              : this.datasets.labels[j] < 9
              ? 'Passive'
              : 'Promoters'

          nps[which] += this.datasets.datasets[i].data[j]
          nps.Score += this.datasets.datasets[i].data[j]
        }
      }

      nps.Score = ((nps.Promoters - nps.Detractors) / nps.Score) * 100
      const x = []
      Object.keys(nps).forEach((el) => {
        x.push({ title: el, value: nps[el] })
      })

      return x
    },
  },
}
</script>
