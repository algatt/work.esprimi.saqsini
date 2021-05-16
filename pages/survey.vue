<template>
  <div
    v-if="!loading"
    class="min-h-screen"
    :style="{ backgroundColor: parsedSurvey.options.backgroundColour }"
  >
    <div class="w-full min-h-screen">
      <PreviewSurvey
        class="w-11/12 md:w-8/12 mx-auto"
        :original-survey="survey.survey"
        :questions="surveyData.questions"
        :show-start="true"
        :has-token="hasToken"
        :existing-answers="existingAnswers"
        @finishSurvey="finishSurvey"
        @disqualifySurvey="disqualifySurvey"
        @answers="processAnswers"
        @changedAnswers="saveSession($event)"
      ></PreviewSurvey>
      <modal-generic v-if="finished && !hasToken">
        <template v-slot:title>Finished</template
        ><template v-slot:body> Thank you for participating. </template>
      </modal-generic>
      <modal-generic v-else-if="finished && hasToken">
        <template v-slot:title>Finished</template
        ><template v-slot:body> Thank you for participating. </template>
      </modal-generic>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/elements/Spinner'
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import ModalGeneric from '~/components/elements/ModalGeneric'
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import { USER_META_DATA } from '~/assets/settings/survey-settings'

export default {
  name: 'SurveyVue',
  components: { ModalGeneric, Spinner, PreviewSurvey },
  layout: 'surveyParticipation',
  data() {
    return {
      surveyData: [],
      loading: true,
      answers: [],
      finished: false,
      sessionDetails: {},
      changedAnswers: {},
    }
  },
  computed: {
    survey() {
      return this.surveyData
    },
    parsedSurvey() {
      return convertSurveyFromApiToForm(
        JSON.parse(JSON.stringify(this.survey.survey))
      )
    },
    hasToken() {
      return this.$route.query.token !== undefined
    },
    existingAnswers() {
      const answers = JSON.parse(JSON.stringify(this.surveyData.questions))
      this.surveyData.responses.forEach((response) => {
        const x = answers.find((question) => {
          return question.code === response.questionCode
        })
        if (!x.answers) x.answers = []

        x.answers.push({
          questionOption: response.option,
          value: response.value,
        })
      })

      return answers.filter((el) => {
        return el.answers
      })
    },
  },
  mounted() {
    const properties = {
      id: this.$route.query.id,
    }
    if (this.$route.query.token) properties.token = this.$route.query.token
    this.$store.dispatch('invitations/redeem', properties).then((response) => {
      this.surveyData = response
      this.loading = false
    })
    this.generateSessionDetails()
  },
  methods: {
    hasAnswerChanged(code) {
      const originalAnswers = this.surveyData.responses
        .filter((el) => {
          return el.questionCode === code
        })
        .map((el) => {
          return { option: el.option, value: el.value, found: false }
        })

      if (originalAnswers.length === 0) return true

      const currentAnswers = this.answers
        .filter((el) => {
          return el.code === code
        })
        .map((el) => {
          return {
            option: el.answers[0].questionOption,
            value: el.answers[0].value,
          }
        })

      originalAnswers.forEach((oa) => {
        currentAnswers.forEach((ca) => {
          if (oa.option === ca.option && oa.value === ca.value) oa.found = true
        })
      })

      return (
        originalAnswers.filter((el) => {
          return el.found === false
        }).length > 0
      )
    },
    getExistingSessionDetails(code) {
      const x = this.surveyData.responses.find((el) => {
        return el.questionCode === code
      })
      if (x) return x.surveyOptions
      return {}
    },
    async finishSurvey() {
      this.finished = true

      const tempAnswers = this.convertAnswers(this.answers)

      await this.$store.dispatch('invitations/submit', tempAnswers)
      await this.$store.dispatch(
        'invitations/consume',
        this.surveyData.invitations[0].token
      )

      if (!this.hasToken)
        setTimeout(() => {
          window.location.reload()
        }, 3000)
    },
    disqualifySurvey() {
      alert('disqualifed')
    },
    async saveSession(answers) {
      this.answers = answers
      const tempAnswers = this.convertAnswers(this.answers)
      await this.$store.dispatch('invitations/submit', tempAnswers)
    },
    processAnswers(answers) {
      this.answers = answers
    },
    convertAnswers(answers) {
      const tempAnswers = []
      answers
        .filter((el) => {
          return !el.questionType.includes('SECTION')
        })
        .forEach((answer) => {
          answer.answers.forEach((el) => {
            tempAnswers.push({
              token: this.surveyData.invitations[0].token,
              questionCode: answer.code,
              option: el.questionOption,
              value: el.value,
              surveyOptions: this.hasAnswerChanged(answer.code)
                ? JSON.stringify(this.sessionDetails)
                : this.getExistingSessionDetails(answer.code),
            })
          })
        })
      return tempAnswers
    },
    generateSessionDetails() {
      USER_META_DATA.navigator.forEach((el) => {
        this.sessionDetails[el] = navigator[el]
      })
      USER_META_DATA.window.forEach((el) => {
        this.sessionDetails[el] = window[el]
      })
      this.getIpDetails('https://www.cloudflare.com/cdn-cgi/trace').then(
        (data) => {
          const ipRegex = /[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}/
          this.sessionDetails.ip = data.match(ipRegex)[0]
          const locRegex = /loc=../
          this.sessionDetails.loc = data.match(locRegex)[0].substring(4)
        }
      )
    },
    getIpDetails() {
      return fetch('https://www.cloudflare.com/cdn-cgi/trace').then((res) =>
        res.text()
      )
    },
  },
}
</script>

<style scoped></style>
