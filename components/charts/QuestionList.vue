<template>
  <div class="flex flex-col">
    <div class="flex justify-start">
      <l-button @click="print"
        >Save to PDF<template v-slot:rightIcon
          ><i class="fas fa-file-pdf fa-fw"></i></template
      ></l-button>
    </div>

    <template v-if="true">
      <div
        v-for="item in processedQuestions"
        :key="item.question.code"
        class="flex flex-col mb-16"
      >
        <div class="flex justify-center items-center w-full space-x-2">
          <h6>{{ item.question.name }}</h6>
          <p class="bg-gray-100 rounded-xl px-2 py-0.5 text-gray-700">
            {{ item.question.questionNumber }}
          </p>

          <span class="text-gray-700 font-semibold"
            >{{ item.question.type.text }}
          </span>
        </div>
        <div class="flex justify-center items-center w-full space-x-2 my-2">
          {{ getQuestionTitle(item.question) }}
        </div>

        <div class="flex flex-wrap w-full">
          <question-element
            :key="item.question.questionCode"
            :data="item"
          ></question-element>
        </div></div
    ></template>
    <modal-generic v-if="startPrint">
      <template v-slot:title>Setting up PDF</template>
      <template v-slot:body>PDF will be available shortly.</template>
    </modal-generic>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import QuestionElement from '~/components/charts/QuestionElement'
import {
  getDifferentAnswers,
  convertQuestionFromApiToForm,
  getQuestionType,
} from '~/services/question-helpers'

import ModalGeneric from '~/components/elements/ModalGeneric'

export default {
  name: 'ChartsQuestionList',
  components: { ModalGeneric, QuestionElement },

  data() {
    return {
      startPrint: false,
    }
  },
  computed: {
    surveyData() {
      return this.$store.state.surveys.surveyData
    },
    processedQuestions() {
      let temp = JSON.parse(JSON.stringify(this.surveyData.questions))
      temp = temp
        .filter((el) => {
          return !el.flags.includes('SECTION')
        })
        .sort((a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        })
      const result = []
      for (const i in temp) {
        result.push(this.processQuestion(temp[i]))
      }
      return result
    },
  },

  methods: {
    print() {
      this.startPrint = true
      window.setTimeout(() => {
        if (process.browser) {
          // eslint-disable-next-line new-cap
          const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'cm',
          })

          doc.setFont('Helvetica', 'bold')
          doc.setFontSize(24)
          doc.text(this.surveyData.survey.name, 3, 3)
          doc.setFontSize(18)
          doc.text(this.surveyData.survey.referenceDate, 3, 5)

          const promises = []

          this.processedQuestions.forEach((question) => {
            const obj = document.getElementById(
              `question_graph_${question.question.code}`
            )
            promises.push(
              new Promise((resolve) => {
                html2canvas(obj).then((canvas) => {
                  doc.addPage()
                  doc.setFont('Helvetica', 'bold')
                  doc.setFontSize(16)
                  doc.text(question.question.name, 2, 2)
                  doc.setFont('Helvetica', 'bold')
                  doc.setFontSize(14)
                  doc.text(this.getQuestionTitle(question.question), 2, 3)
                  let widthChange = 1
                  if (canvas.width * 0.0264583333 > 17)
                    widthChange = 17 / (canvas.width * 0.0264583333)
                  resolve(
                    doc.addImage(
                      canvas,
                      2,
                      5,
                      canvas.width * 0.0264583333 * widthChange,
                      canvas.height * 0.0264583333 * widthChange
                    )
                  )
                })
              })
            )
          })
          Promise.all(promises).then(() => {
            doc.save(`${this.surveyData.survey.name}.pdf`)
            this.startPrint = false
          })
        }
      }, 1000)
    },
    getQuestionTitle(question) {
      return convertQuestionFromApiToForm(question).text
    },

    processQuestion(question) {
      const data = {}
      const surveyYear = this.surveyData.survey.referenceDate.substring(0, 4)

      const responses = this.surveyData.responses.filter((el) => {
        return el.questionCode === question.code
      })
      const availableInvitees = responses.map((el) => {
        return el.token
      })
      const invitees = this.surveyData.invitations.filter((el) => {
        return availableInvitees.includes(el.token)
      })

      data.surveyYear = surveyYear
      data.question = question
      data.question.type = getQuestionType(question)
      data.responses = responses
      data.invitees = invitees
      data.availableAnswers = getDifferentAnswers(question, responses)
      data.demographicLabels = this.getDifferentDemographicLabels(invitees)
      data.demographics = this.getDifferentDemographicValues(
        data.demographicLabels,
        invitees
      )

      return data
    },

    getDifferentDemographicLabels(invitees) {
      let data = []
      invitees.forEach((invitee) => {
        Object.keys(invitee).forEach((el) => {
          if (!data.includes(el) && el !== 'code') data.push(el)
        })
      })
      data = data.sort((a, b) => {
        return a > b ? 1 : -1
      })
      return data
    },
    getDifferentDemographicValues(labels, invitees) {
      const data = {}
      labels.forEach((label) => {
        data[label] = []
      })
      invitees.forEach((invitee) => {
        labels.forEach((label) => {
          if (invitee[label] && !data[label].includes(invitee[label]))
            data[label].push(invitee[label])
        })
      })

      Object.keys(data).forEach((el) => {
        data[el] = data[el].sort((a, b) => {
          return a > b ? 1 : -1
        })
      })

      return data
    },
  },
}
</script>

<style scoped></style>
