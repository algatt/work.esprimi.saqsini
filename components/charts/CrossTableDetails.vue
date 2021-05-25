<template>
  <div class="flex flex-wrap w-full">
    <div class="flex flex-col w-full md:w-4/12">
      <p class="font-semibold mb-1">X Axis</p>
      <select
        v-model="crossTabX"
        class="select w-full mb-5"
        @change="optionX = null"
      >
        <option :value="null">Choose question for X axis</option>
        <option
          v-for="question in questionsX"
          :key="question.code"
          :value="question"
        >
          {{ question.name }}
        </option>
      </select>

      <template
        v-if="
          crossTabX &&
          (crossTabX.flags.includes('RADIO_GRID') ||
            crossTabX.flags.includes('RANKING'))
        "
      >
        <p class="font-semibold mb-1">X Axis - Question Option</p>

        <select
          v-if="
            crossTabX &&
            (crossTabX.flags.includes('RADIO_GRID') ||
              crossTabX.flags.includes('RANKING'))
          "
          v-model="optionX"
          class="select w-full mb-5"
        >
          <option :value="null">Select an option</option>
          <option
            v-for="(option, index) in getDifferentAnswers(crossTabX)"
            :key="index"
            :value="option.code"
          >
            {{ option.text }}
          </option>
        </select>
      </template>
      <p class="font-semibold mb-1">Y Axis</p>
      <select
        v-model="crossTabY"
        class="select w-full mb-5"
        @change="optionY = null"
      >
        <option :value="null">Choose question for Y axis</option>
        <option
          v-for="question in questionsY"
          :key="question.code"
          :value="question"
        >
          {{ question.name }}
        </option>
      </select>

      <template
        v-if="
          crossTabY &&
          (crossTabY.flags.includes('RADIO_GRID') ||
            crossTabY.flags.includes('RANKING'))
        "
      >
        <p class="font-semibold mb-1">Y Axis - Question Option</p>

        <select v-model="optionY" class="select w-full mb-5">
          <option :value="null">Select an option</option>
          <option
            v-for="(option, index) in getDifferentAnswers(crossTabY)"
            :key="index"
            :value="option.code"
          >
            {{ option.text }}
          </option>
        </select>
      </template>
    </div>

    <div class="flex w-full md:w-8/12 justify-center items-center">
      <div v-if="!crossTabX || !crossTabY">
        <p>To display a cross tab you need to select two questions.</p>
      </div>
      <div v-else-if="crossTabX.code === crossTabY.code">
        <p>You need to select different questions</p>
      </div>
      <div v-else>
        <CrossTable
          v-if="allowCrossTab"
          :data="getCrossTabData()"
          :details="details"
        ></CrossTable>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getDifferentAnswers,
  getQuestionType,
} from '~/services/question-helpers'
import CrossTable from '~/components/charts/CrossTable'

export default {
  name: 'CrossTableDetails',
  components: { CrossTable },

  data() {
    return {
      crossTabX: null,
      crossTabY: null,
      optionX: null,
      optionY: null,
      crossTabXX: null,
    }
  },
  computed: {
    surveyData() {
      return this.$store.state.surveys.surveyData
    },
    details() {
      return {
        xTitle: this.crossTabX.name,
        yTitle: this.crossTabY.name,
        xOption: this.optionX,
        yOption: this.optionY,
      }
    },
    validCrossTabXSelection() {
      const needForOption = ['RANKING', 'RADIO_GRID']
      if (!this.crossTabX) return false
      const needForOptionX = needForOption.includes(
        getQuestionType(this.crossTabX)
      )
      return !needForOptionX || (needForOptionX && !!this.optionX)
    },
    validCrossTabYSelection() {
      const needForOption = ['RANKING', 'RADIO_GRID']
      if (!this.crossTabY) return false
      const needForOptionY = needForOption.includes(
        getQuestionType(this.crossTabY)
      )
      return !needForOptionY || (needForOptionY && !!this.optionY)
    },
    allowCrossTab() {
      return this.validCrossTabXSelection && this.validCrossTabYSelection
    },
    questionsX() {
      let x = this.surveyData.questions
        .filter((el) => {
          return !el.flags.includes('SECTION')
        })
        .sort((a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        })
      if (this.crossTabY)
        x = x.filter((el) => {
          return el.code !== this.crossTabY.code
        })
      return x
    },
    questionsY() {
      let x = this.surveyData.questions
        .filter((el) => {
          return !el.flags.includes('SECTION')
        })
        .sort((a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        })
      if (this.crossTabX)
        x = x.filter((el) => {
          return el.code !== this.crossTabX.code
        })
      return x
    },
  },
  methods: {
    getCrossTabData() {
      const xResponses = this.surveyData.responses.filter((el) => {
        return el.questionCode === this.crossTabX.code
      })

      const yResponses = this.surveyData.responses.filter((el) => {
        return el.questionCode === this.crossTabY.code
      })

      let xAxis = []

      if (this.crossTabX.flags.includes('RANKING')) {
        const numElements = this.crossTabX.options.length
        for (let i = 1; i <= numElements; i++) xAxis.push(String(i))
      } else if (this.crossTabX.flags.includes('RADIO_GRID')) {
        const elements = this.crossTabX.options
          .filter((el) => {
            return el.flags.includes('COLUMN')
          })
          .sort((a, b) => {
            return a.ordinalPosition > b.ordinalPosition ? 1 : -1
          })
        for (const i in elements) xAxis.push(elements[i].value)
      } else
        xAxis = getDifferentAnswers(this.crossTabX, xResponses).map((el) => {
          return el.code
        })

      let yAxis = []

      if (this.crossTabY.flags.includes('RANKING')) {
        const numElements = this.crossTabY.options.length
        for (let i = 1; i <= numElements; i++) yAxis.push(String(i))
      } else if (this.crossTabY.flags.includes('RADIO_GRID')) {
        const elements = this.crossTabY.options
          .filter((el) => {
            return el.flags.includes('COLUMN')
          })
          .sort((a, b) => {
            return a.ordinalPosition > b.ordinalPosition ? 1 : -1
          })
        for (const i in elements) yAxis.push(elements[i].value)
      } else
        yAxis = getDifferentAnswers(this.crossTabY, yResponses).map((el) => {
          return el.code
        })

      const data = []
      data.push(['', ...xAxis])
      yAxis.forEach((el) => {
        data.push([el, ...new Array(xAxis.length).fill(0)])
      })

      const xAnswers = []

      xResponses.forEach((response) => {
        if (
          this.crossTabX.flags.includes('RANKING') ||
          this.crossTabX.flags.includes('RADIO_GRID')
        ) {
          if (response.option === this.optionX)
            xAnswers.push([response.token, String(response.value)])
        } else if (this.crossTabX.flags.includes('TYPE_IN')) {
          xAnswers.push([response.token, String(response.value)])
        } else {
          xAnswers.push([response.token, String(response.value)])
        }
      })

      const yAnswers = []

      yResponses.forEach((response) => {
        if (
          this.crossTabY.flags.includes('RANKING') ||
          this.crossTabY.flags.includes('RADIO_GRID')
        ) {
          if (response.option === this.optionY)
            yAnswers.push([response.token, String(response.value)])
        } else if (this.crossTabY.flags.includes('TYPE_IN')) {
          yAnswers.push([response.token, String(response.value)])
        } else {
          yAnswers.push([response.token, String(response.value)])
        }
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
    getDifferentAnswers(question) {
      return getDifferentAnswers(
        question,
        this.surveyData.responses.filter((el) => {
          return el.questionCode === question.code
        })
      )
    },
  },
}
</script>

<style scoped>
.select {
  @apply border-2 border-gray-200 rounded py-1.5 px-2 focus:border-primary focus:ring-0 focus:outline-none transition duration-300 disabled:bg-gray-100;
  @apply appearance-none;
  background-image: url('/dropdown.svg');
  background-repeat: no-repeat;
  background-position: right 0.5em top 50%;
  background-size: 1em auto;
}
</style>
