<template>
  <div class="flex flex-wrap w-full">
    <div class="flex flex-col w-full md:w-4/12">
      <select v-model="crossTabX" class="input select w-full mb-5">
        <option :value="null">Choose question for X axis</option>
        <option
          v-for="question in data.questions"
          :key="question.code"
          :value="question"
        >
          {{ question.text }}
        </option>
      </select>
      <select v-model="crossTabY" class="input select w-full mb-5">
        <option :value="null">Choose question for X axis</option>
        <option
          v-for="question in data.questions"
          :key="question.code"
          :value="question"
        >
          {{ question.text }}
        </option>
      </select>
    </div>
    <div class="flex w-full md:w-8/12 justify-center items-center">
      <div v-if="!crossTabX || !crossTabY">
        <p>To display a cross tab you need to select two questions.</p>
      </div>
      <div v-else-if="crossTabX.code === crossTabY.code">
        <p>You need to select different questions</p>
      </div>
      <div v-else>
        <CrossTable :data="getCrossTabData()"></CrossTable>
      </div>
    </div>
  </div>
</template>

<script>
import { getDifferentAnswers } from '~/helpers/chartHelpers'
import CrossTable from '~/components/charts/CrossTable'

export default {
  name: 'CrossTableDetails',
  components: { CrossTable },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      crossTabX: null,
      crossTabY: null,
    }
  },
  methods: {
    getCrossTabData() {
      const xAxis = getDifferentAnswers(
        this.crossTabX,
        this.data.responses
      ).map((el) => {
        return el.code
      })
      const yAxis = getDifferentAnswers(
        this.crossTabY,
        this.data.responses
      ).map((el) => {
        return el.code
      })

      const data = []
      data.push(['', ...xAxis])
      yAxis.forEach((el) => {
        data.push([el, ...new Array(xAxis.length).fill(0)])
      })

      const xAnswers = []

      const xResponses = this.data.responses.filter((el) => {
        return el.question === this.crossTabX.code
      })

      xResponses.forEach((response) => {
        response.value.forEach((el) => {
          xAnswers.push([response.invitee, el])
        })
      })

      const yAnswers = []

      const yResponses = this.data.responses.filter((el) => {
        return el.question === this.crossTabY.code
      })

      yResponses.forEach((response) => {
        response.value.forEach((el) => {
          yAnswers.push([response.invitee, el])
        })
      })

      xAnswers.forEach((eachXAnswer) => {
        const tempYAnswers = yAnswers.filter((el) => {
          return el[0] === eachXAnswer[0]
        })
        tempYAnswers.forEach((eachTempYAnswer) => {
          data.find((el) => {
            return el[0] === eachTempYAnswer[1]
          })[xAxis.indexOf(eachXAnswer[1]) + 1] += 1
        })
      })

      return data
    },
  },
}
</script>

<style scoped></style>
