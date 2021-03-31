<template>
  <div v-if="!loading" class="w-full flex flex-col">
    <top-header-bar :hide-menu="true" which="">
      <template v-slot:title>{{ responses.survey.name }}</template>
      <template v-slot:extraButtons>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6 border-b-2 border-transparent"
          :class="
            selectedView === 'overall'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'overall'"
        >
          <i class="xl:pr-2 fas fa-poll fa-fw" title="Overall"></i>
          <span class="hidden md:block">Overall</span>
        </button>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6 border-b-2 border-transparent"
          :class="
            selectedView === 'questions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'questions'"
        >
          <i class="xl:pr-2 fas fa-question-circle fa-fw" title="Questions"></i>
          <span class="hidden md:block">Questions</span>
        </button>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6 border-b-2 border-transparent"
          :class="
            selectedView === 'individual'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'individual'"
        >
          <i class="xl:pr-2 fas fa-user fa-fw" title="Crosstab"></i>
          <span class="hidden md:block">Individual</span>
        </button>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6 border-b-2 border-transparent"
          :class="
            selectedView === 'cross'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'cross'"
        >
          <i class="xl:pr-2 fas fa-table fa-fw" title="Crosstab"></i>
          <span class="hidden md:block">Crosstab</span>
        </button>
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
      <cross-table-details
        v-if="false"
        :data="dataForCrossTab"
      ></cross-table-details>
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

export default {
  name: 'SurveyResponses',
  components: {
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
      // data.sessions = this.responses.sessions
      return data
    },
    dataForCrossTab() {
      const data = {}
      data.questions = this.responses.questions
      data.responses = this.responses.responses
      return data
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
