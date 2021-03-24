<template>
  <div class="flex flex-col w-full">
    {{ chartData }}
    <!--    <g-chart-->
    <!--      :type="chartTypes[question.type]"-->
    <!--      :data="chartData"-->
    <!--      :options="getOptions(question)"-->
    <!--      class="w-full"-->
    <!--      style="min-height: 400px"-->
    <!--    ></g-chart>-->
    <!--    <div-->
    <!--      v-if="question.type === 'LIKERT'"-->
    <!--      class="flex flex-col justify-center items-center"-->
    <!--    >-->
    <!--      <div class="flex flex-wrap items-center">-->
    <!--        <h6>Average Score</h6>-->
    <!--        <span-->
    <!--          class="ml-2 text-lg font-semibold bg-primary text-white rounded px-2"-->
    <!--          ><template v-if="chartData[0].length <= 3">{{-->
    <!--            calculateAverageScoreNoAggregation(chartData)-->
    <!--          }}</template-->
    <!--          ><template v-else>{{-->
    <!--            calculateAverageScoreWithAggregation(chartData)-->
    <!--          }}</template></span-->
    <!--        >-->
    <!--      </div>-->
    <!--      <div-->
    <!--        v-if="checkIfNPS(question)"-->
    <!--        class="flex justify-center mt-4 space-x-4"-->
    <!--      >-->
    <!--        <span-->
    <!--          class="flex flex-col items-center rounded"-->
    <!--          style="min-width: 100px"-->
    <!--        >-->
    <!--          <p-->
    <!--            class="font-semibold bg-gray-100 px-2 py-2 border border-gray-200 rounded-t text-center"-->
    <!--          >-->
    <!--            Detractors-->
    <!--          </p>-->
    <!--          <span-->
    <!--            class="bg-white p-3 bg-white border-l border-r border-b border-gray-200 w-full text-center rounded-b text-lg"-->
    <!--            >{{ calculateNPS(chartData).detractors }}</span-->
    <!--          >-->
    <!--        </span>-->
    <!--        <span-->
    <!--          class="flex flex-col items-center rounded"-->
    <!--          style="min-width: 100px"-->
    <!--        >-->
    <!--          <p-->
    <!--            class="font-semibold bg-gray-100 px-2 py-2 border border-gray-200 rounded-t text-center"-->
    <!--            style="min-width: 100px"-->
    <!--          >-->
    <!--            Passive-->
    <!--          </p>-->
    <!--          <span-->
    <!--            class="bg-white p-3 bg-white border-l border-r border-b border-gray-200 w-full text-center rounded-b text-lg"-->
    <!--            >{{ calculateNPS(chartData).passive }}</span-->
    <!--          >-->
    <!--        </span>-->
    <!--        <span-->
    <!--          class="flex flex-col items-center rounded"-->
    <!--          style="min-width: 100px"-->
    <!--        >-->
    <!--          <p-->
    <!--            class="font-semibold bg-gray-100 px-2 py-2 border border-gray-200 rounded-t text-center"-->
    <!--            style="min-width: 100px"-->
    <!--          >-->
    <!--            Promoters-->
    <!--          </p>-->
    <!--          <span-->
    <!--            class="bg-white p-3 bg-white border-l border-r border-b border-gray-200 w-full text-center rounded-b text-lg"-->
    <!--            >{{ calculateNPS(chartData).promoters }}</span-->
    <!--          >-->
    <!--        </span>-->
    <!--        <span-->
    <!--          class="flex flex-col items-center rounded"-->
    <!--          style="min-width: 100px"-->
    <!--        >-->
    <!--          <p-->
    <!--            class="font-semibold bg-gray-100 px-2 py-2 border border-gray-200 rounded-t text-center"-->
    <!--            style="min-width: 100px"-->
    <!--          >-->
    <!--            NPS-->
    <!--          </p>-->
    <!--          <span-->
    <!--            class="bg-white p-3 bg-white border-l border-r border-b border-gray-200 w-full text-center rounded-b text-lg"-->
    <!--            :class="-->
    <!--              calculateNPS(chartData).nps < 0-->
    <!--                ? 'text-red-600'-->
    <!--                : calculateNPS(chartData).nps > 0-->
    <!--                ? 'text-green-600'-->
    <!--                : 'text-gray-800'-->
    <!--            "-->
    <!--            >{{ calculateNPS(chartData).nps }}</span-->
    <!--          >-->
    <!--        </span>-->
    <!--      </div>-->
    <!--    </div>-->
  </div>
</template>

<script>
// import { GChart } from 'vue-google-charts'
export default {
  name: 'QuestionChartElement',
  components: {},
  props: {
    chartData: {
      required: true,
      type: Array,
    },
    question: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      chartTypes: {
        MULTIPLE_CHOICE: 'ColumnChart',
        LIKERT: 'ColumnChart',
        RANKING: 'ColumnChart',
      },
    }
  },
  methods: {
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
      }
    },
    calculateAverageScoreNoAggregation(data) {
      let score = 0
      let count = 0
      for (let i = 1; i < data.length; i++) {
        score += data[i][0] * data[i][1]
        count += data[i][1]
      }
      return score / count
    },
    calculateAverageScoreWithAggregation(data) {
      let score = 0
      let count = 0
      for (let i = 1; i < data.length; i++) {
        for (let j = 1; j < data[i].length; j += 2) {
          score += data[i][j] * Number(data[0][j])
          count += data[i][j]
        }
      }
      return score / count
    },
    checkIfNPS(question) {
      const npsScale = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
      return (
        question.availableOptions.filter((x) => npsScale.includes(x.value))
          .length === 10
      )
    },
    calculateNPS(data) {
      const result = {
        detractors: 0,
        passive: 0,
        promoters: 0,
        nps: 0,
      }
      if (this.chartData[0].length < 4) {
        for (let i = 1; i < data.length; i++) {
          if (data[i][0] !== 0 && data[i][0] < 7)
            result.detractors += data[i][1]
          else if (data[i][0] < 9) result.passive += data[i][1]
          else result.promoters += data[i][1]
        }
      } else {
        for (let i = 1; i < data.length; i++) {
          for (let j = 1; j < data[i].length; j += 2) {
            console.log(data[i][j])
            if (data[i][j] > 0) {
              const val = Number(data[0][j])
              if (val < 7) result.detractors += data[i][j]
              else if (val < 9) result.passive += data[i][j]
              else result.promoters += data[i][j]
            }
          }
        }
      }
      result.nps =
        ((result.promoters - result.detractors) /
          (result.promoters + result.detractors + result.passive)) *
        100
      return result
    },
  },
}
</script>

<style scoped></style>
