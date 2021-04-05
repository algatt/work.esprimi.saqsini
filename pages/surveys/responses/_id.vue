<template>
  <div v-if="!loading" class="w-full flex flex-col">
    <top-header-bar :hide-menu="true" which="">
      <template v-slot:title>{{ responses.survey.name }}</template>
      <template v-slot:extraButtons>
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
          >Overall<template v-slot:icon
            ><i class="fas fa-user fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'cross'"
          @click="selectedView = 'cross'"
          >Cross Table<template v-slot:icon
            ><i class="fas fa-table fa-fw"></i></template
        ></menu-icon-button>
      </template>
    </top-header-bar>
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
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import SurveyDetails from '~/components/charts/SurveyDetails'
import QuestionDetails from '~/components/charts/QuestionList'
import CrossTableDetails from '~/components/charts/CrossTableDetails'
import IndividualDetails from '~/components/charts/InvidualDetails'
import MenuIconButton from '~/components/layouts/MenuIconButton'

export default {
  name: 'SurveyResponses',
  components: {
    MenuIconButton,
    QuestionDetails,
    SurveyDetails,
    TopHeaderBar,
    Spinner,
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
      return data
    },
    dataForCrossTab() {
      return {
        questions: this.responses.questions,
        responses: this.responses.responses,
      }
    },
  },

  async mounted() {
    this.loading = true
    this.responses = await this.$store.dispatch(
      'surveys/getSurveyData',
      this.$route.params.id
    )
    this.loading = false
  },
  methods: {},
}
</script>

<style scoped></style>
