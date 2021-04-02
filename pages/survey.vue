<template>
  <div
    v-if="!loading"
    class="min-h-screen"
    :style="{
      backgroundColor: true ? '#E5E7EB' : parsedSurvey.options.accentColour,
    }"
  >
    <PreviewSurvey
      class="w-11/12 md:w-8/12 mx-auto"
      :original-survey="survey.survey"
      :questions="surveyData.questions"
      :show-start="true"
      @finishSurvey="finishSurvey"
      @answers="processAnswers"
    ></PreviewSurvey>
    <modal-generic
      v-if="finished"
      width="w-64"
      :style="{ color: parsedSurvey.options.accentColour }"
    >
      <template v-slot:title
        ><span class="w-full flex justify-center py-10"
          ><i class="fas fa-check-circle fa-fw fa-3x animate-bounce"></i></span
      ></template>
    </modal-generic>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import ModalGeneric from '~/components/layouts/ModalGeneric'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import { USER_META_DATA } from '~/helpers/constants'

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
    }
  },
  computed: {
    survey() {
      return this.surveyData
    },
    parsedSurvey() {
      return parseSurveyToForm(JSON.parse(JSON.stringify(this.survey.survey)))
    },
    firstQuestion() {
      return this.survey.questions.filter((el) => {
        return el.ordinalPosition === 1
      })
    },
  },
  mounted() {
    this.$store
      .dispatch('invitations/redeem', {
        id: this.$route.query.id,
        token: this.$route.query.token,
      })
      .then((response) => {
        this.surveyData = response
        this.loading = false
      })
    this.generateSessionDetails()
  },
  methods: {
    async finishSurvey() {
      const tempAnswers = []
      this.answers
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
              surveyOptions: JSON.stringify(this.sessionDetails),
            })
          })
        })

      this.finished = true

      await this.$store.dispatch('invitations/submit', tempAnswers)
      await this.$store.dispatch(
        'invitations/consume',
        this.surveyData.invitations[0].token
      )

      setTimeout(() => {
        window.location.reload()
      }, 3000)
    },
    processAnswers(answers) {
      this.answers = answers
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
