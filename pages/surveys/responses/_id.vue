<template>
  <div v-if="!loading" class="w-full flex flex-col">
    <div class="w-full flex items-center my-4">
      <div class="flex flex-1">
        <h5>{{ responses.survey.name }}</h5>
      </div>
      <div class="flex space-x-2">
        <menu-icon-button
          :active="selectedView === 'overall'"
          @click="selectedView = 'overall'"
          >Overall<template v-slot:icon
            ><i class="fas fa-poll fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'questions'"
          @click="selectedView = 'questions'"
          >Questions<template v-slot:icon
            ><i class="fas fa-question-circle fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'individual'"
          @click="selectedView = 'individual'"
          >Individual<template v-slot:icon
            ><i class="fas fa-user fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'cross'"
          @click="selectedView = 'cross'"
          >Cross Table<template v-slot:icon
            ><i class="fas fa-table fa-fw"></i></template
        ></menu-icon-button>
      </div>
    </div>

    <div v-if="selectedView === 'overall'">
      <survey-details :details="dataForSurveyOverall"></survey-details>
    </div>
    <div v-else-if="selectedView === 'questions'">
      <question-details :data="responses"></question-details>
    </div>
    <div v-else-if="selectedView === 'individual'">
      <individual-details :data="responses"></individual-details>
    </div>
    <div v-else-if="selectedView === 'cross'">
      <cross-table-details :data="dataForCrossTab"></cross-table-details>
    </div>
  </div>
</template>

<script>
import SurveyDetails from '~/components/charts/SurveyDetails'
import QuestionDetails from '~/components/charts/QuestionList'
import CrossTableDetails from '~/components/charts/CrossTableDetails'
import IndividualDetails from '~/components/charts/InvidualDetails'
import MenuIconButton from '~/components/layouts/MenuIconButton'

export default {
  name: 'SurveyResponses',
  middleware: ['surveyBuilder'],
  components: {
    MenuIconButton,
    QuestionDetails,
    SurveyDetails,
    CrossTableDetails,
    IndividualDetails,
  },

  data() {
    return {
      responses: [],
      loading: true,
      selectedView: 'overall',
    }
  },
  computed: {
    dataForSurveyOverall() {
      const data = {}
      data.survey = this.responses.survey
      data.invitees = this.responses.invitations
      data.responses = this.responses.responses
      data.questions = this.responses.questions
      return data
    },
    dataForCrossTab() {
      return {
        questions: this.responses.questions,
        responses: this.responses.responses,
      }
    },
  },

  mounted() {
    this.loading = true
    this.$store
      .dispatch('surveys/getSurveyData', this.$route.params.id)
      .then((response) => {
        this.responses = response
        this.loading = false
      })
  },
}
</script>

<style scoped></style>
