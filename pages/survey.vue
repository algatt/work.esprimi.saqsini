<template>
  <div
    v-if="!loading"
    class="min-h-screen"
    :style="{ backgroundColor: survey.options.accentColour }"
  >
    <PreviewSurvey
      class="w-11/12 md:w-8/12 mx-auto"
      :survey-prop="survey"
      :questions="surveyData.questions"
      @finishSurvey="finishSurvey"
      @answers="processAnswers"
    ></PreviewSurvey>
    <modal-generic
      v-if="finished"
      width="w-64"
      :style="{ color: survey.options.accentColour }"
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
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import ModalGeneric from '~/components/layouts/ModalGeneric'

export default {
  name: 'SurveyVue',
  components: { ModalGeneric, PreviewSurvey, Spinner },
  layout: 'surveyParticipation',
  data() {
    return {
      surveyData: [],
      loading: true,
      answers: [],
      finished: false,
    }
  },
  computed: {
    survey() {
      return parseSurveyToForm(this.surveyData.survey)
    },
  },
  mounted() {
    this.$store
      .dispatch('surveys/getSession', this.$route.query.id)
      .then((response) => {
        this.surveyData = response
        this.loading = false
      })
  },
  methods: {
    finishSurvey() {
      const tempAnswers = []
      this.answers
        .filter((el) => {
          return !el.questionType.includes('SECTION')
        })
        .forEach((el) => {
          tempAnswers.push({
            token: this.surveyData.invitations[0].token,
            questionCode: el.code,
            value: JSON.stringify(el.answers),
            surveyOptions: null,
          })
        })
      this.finished = true
      this.$store.dispatch('surveys/saveSession', tempAnswers)
      setTimeout(() => {
        window.location.reload()
      }, 3000)
    },
    processAnswers(answers) {
      this.answers = answers
    },
  },
}
</script>

<style scoped></style>
