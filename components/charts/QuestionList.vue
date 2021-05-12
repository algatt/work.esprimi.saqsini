<template>
  <div v-if="!loading">
    <l-button @click="print"
      >Save to PDF<template v-slot:rightIcon
        ><i class="fas fa-file-pdf fa-fw"></i></template
    ></l-button>
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
      </div>
    </div>
    <modal-generic v-if="startPrint">
      <template v-slot:title>Setting up PDF</template>
      <template v-slot:body>PDF will be available shortly.</template>
    </modal-generic>
  </div>
</template>

<script>
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import QuestionElement from '~/components/charts/QuestionElement'
import { getDifferentAnswers } from '~/helpers/chartHelpers'
import { convertQuestionFromApiToForm } from '~/services/question-helpers'
import ModalGeneric from '~/components/layouts/ModalGeneric'
export default {
  name: 'QuestionList',
  components: { ModalGeneric, QuestionElement },
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: true,
      workingData: null,
      processedQuestions: [],
      startPrint: false,
    }
  },
  mounted() {
    this.workingData = JSON.parse(JSON.stringify(this.data))

    let questions = JSON.parse(JSON.stringify(this.data.questions))
    questions = questions
      .sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
      .filter((el) => {
        return !el.flags.includes('SECTION')
      })

    questions.forEach((el) => {
      this.processedQuestions.push(this.processQuestion(el))
    })

    this.loading = false
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
          doc.text(this.data.survey.name, 3, 3)
          doc.setFontSize(18)
          doc.text(this.data.survey.referenceDate, 3, 5)

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
                  const widthChange = 17 / (canvas.width * 0.0264583333)
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
            doc.save(`${this.data.survey.name}.pdf`)
            this.startPrint = false
          })
        }
      }, 1000)
    },
    getQuestionTitle(question) {
      return convertQuestionFromApiToForm(question).text
    },
    getQuestionType(question) {
      let result = ''
      question.flags.forEach((el) => {
        if (Object.keys(QUESTION_TYPES).includes(el))
          result = QUESTION_TYPES[el]
      })
      return result
    },
    processQuestion(question) {
      const data = {}
      const surveyYear = this.workingData.survey.referenceDate.substring(0, 4)
      const responses = this.workingData.responses.filter((el) => {
        return el.questionCode === question.code
      })
      const availableInvitees = responses.map((el) => {
        return el.token
      })
      const invitees = this.workingData.invitations.filter((el) => {
        return availableInvitees.includes(el.token)
      })

      data.surveyYear = surveyYear
      data.question = question
      data.question.type = this.getQuestionType(question)
      data.responses = responses
      data.invitees = invitees
      data.availableAnswers = this.getDifferentAnswers(question, responses)
      data.demographicLabels = this.getDifferentDemographicLabels(invitees)
      data.demographics = this.getDifferentDemographicValues(
        data.demographicLabels,
        invitees
      )

      return data
    },
    getDifferentAnswers(question, responses) {
      return getDifferentAnswers(question, responses)
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
