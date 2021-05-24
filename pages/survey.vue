<template>
  <div
    v-if="!loading && !error && !disqualify && !finished"
    class="min-h-screen"
    :style="{ backgroundColor: parsedSurvey.options.backgroundColour }"
  >
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
  <div
    v-else-if="!loading && error === true"
    class="flex flex-col justify-center items-center h-screen w-full"
  >
    <app-logo></app-logo>
    <div class="my-10">There was a problem loading the survey.</div>
  </div>
  <div
    v-else-if="!loading && error === 'ready'"
    class="flex flex-col justify-center items-center h-screen w-full"
  >
    <app-logo></app-logo>
    <div class="my-10">You have already participated in this survey.</div>
  </div>
  <div
    v-else-if="!loading && !error && disqualify && !finished"
    class="flex flex-col justify-center items-center h-screen w-full"
  >
    <app-logo></app-logo>
    <div class="my-10 text-center space-y-2">
      <p>Unfortunately, you are uneligible to participate in this survey.</p>
      <p>Thank you for your time.</p>
    </div>
  </div>
  <div
    v-else-if="!loading && !error && !disqualify && finished"
    class="flex flex-col justify-center items-center h-screen w-full"
  >
    <app-logo></app-logo>
    <div class="my-10 text-center space-y-2">
      <p>Thank you for your time.</p>
      <p v-if="hasToken && !askForEmail">
        <l-text-link @click="sendEmailWithResponses">Click here</l-text-link>
        for a copy of your responses.
      </p>
    </div>
  </div>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import Spinner from '~/components/elements/Spinner'
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import ModalGeneric from '~/components/elements/ModalGeneric'
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import { USER_META_DATA } from '~/assets/settings/survey-settings'
import AppLogo from '~/components/elements/AppLogo'
import LTextLink from '~/components/LTextLink'

export default {
  name: 'SurveyVue',
  components: { LTextLink, AppLogo, ModalGeneric, Spinner, PreviewSurvey },
  layout: 'default',
  data() {
    return {
      error: false,
      surveyData: [],
      loading: true,
      answers: [],
      finished: false,
      disqualify: false,
      sessionDetails: {},
      changedAnswers: {},
      askForEmail: false,
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
    hasEdit() {
      return this.$route.query.edit !== undefined
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
      isAdmin: this.hasEdit,
    }
    if (this.$route.query.token) properties.token = this.$route.query.token
    this.$store
      .dispatch('invitations/redeem', properties)
      .then((response) => {
        this.surveyData = response
      })
      .catch((error) => {
        if (error.response.status === 406) this.error = 'ready'
        else this.error = true
      })
      .finally(() => {
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
      this.$store
        .dispatch(
          'invitations/disqualify',
          this.surveyData.invitations[0].token
        )
        .then(() => {
          this.disqualify = true
        })
        .catch(() => {
          this.error = true
        })
    },
    sendEmailWithResponses() {
      this.$store
        .dispatch(
          'invitations/sendEmailWithResponses',
          this.surveyData.invitations[0].token
        )
        .then(() => {
          this.askForEmail = true
          this.$toasted.show(
            'You will receive a copy of the responses shortly.'
          )
        })
        .catch(() => {
          this.$toasted.error(
            'There was a problem sending you a copy of the responses'
          )
        })
    },
    async saveSession(answers) {
      this.answers = answers
      const tempAnswers = this.convertAnswers(this.answers)
      if (this.hasEdit)
        await this.$store.dispatch('invitations/update', tempAnswers)
      else await this.$store.dispatch('invitations/submit', tempAnswers)
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
