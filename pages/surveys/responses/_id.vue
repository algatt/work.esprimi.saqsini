<template>
  <list-layout v-if="!loading && !error">
    <div class="w-full flex flex-wrap items-center mb-10">
      <div class="flex w-full md:flex-1">
        <h5>{{ responses.survey.name }}</h5>
      </div>
      <div class="flex flex-col md:flex-row md:space-x-2">
        <menu-icon-button
          :active="selectedView === 'overall'"
          @click="selectedView = 'overall'"
          >Overall Summary<template v-slot:icon
            ><i class="fas fa-poll fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'questions'"
          @click="selectedView = 'questions'"
          >Question Results<template v-slot:icon
            ><i class="fas fa-question-circle fa-fw"></i></template
        ></menu-icon-button>
        <menu-icon-button
          :active="selectedView === 'individual'"
          @click="selectedView = 'individual'"
          >Individual Responses<template v-slot:icon
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

    <survey-details v-if="selectedView === 'overall'"></survey-details>

    <question-details
      v-else-if="selectedView === 'questions'"
    ></question-details>

    <individual-details
      v-else-if="selectedView === 'individual'"
    ></individual-details>

    <cross-table-details
      v-else-if="selectedView === 'cross'"
    ></cross-table-details>
  </list-layout>
  <page-load-error v-else-if="!loading && error"></page-load-error>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import SurveyDetails from '~/components/charts/SurveyDetails'
import QuestionDetails from '~/components/charts/QuestionList'
import CrossTableDetails from '~/components/charts/CrossTableDetails'
import IndividualDetails from '~/components/charts/InvidualDetails'
import MenuIconButton from '~/components/elements/MenuIconButton'
import ListLayout from '~/components/elements/ListLayout'
import Spinner from '~/components/elements/Spinner'
import PageLoadError from '~/components/elements/PageLoadError'

export default {
  name: 'SurveyResponses',
  middleware: ['surveyBuilder'],
  layout: 'authlayout',
  components: {
    PageLoadError,
    Spinner,
    ListLayout,
    MenuIconButton,
    QuestionDetails,
    SurveyDetails,
    CrossTableDetails,
    IndividualDetails,
  },

  data() {
    return {
      loading: true,
      selectedView: 'overall',
      error: false,
    }
  },
  computed: {
    responses() {
      return this.$store.state.surveys.surveyData
    },
  },

  mounted() {
    this.loading = true
    this.$store
      .dispatch('surveys/getSurveyData', this.$route.params.id)
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },
}
</script>

<style scoped></style>
