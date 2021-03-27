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
  </div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import PreviewSurvey from '~/components/surveys/PreviewSurvey'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'

export default {
  name: 'SurveyVue',
  components: { PreviewSurvey, Spinner },
  layout: 'surveyParticipation',
  data() {
    return {
      surveyData: [],
      loading: true,
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
      alert('finish')
    },
    processAnswers(answers) {
      console.log(answers)
    },
  },
}
</script>

<style scoped></style>
