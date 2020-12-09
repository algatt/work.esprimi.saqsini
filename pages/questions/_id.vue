<template>
  <div v-if="!loading" class="flex flex-col flex-wrap mb-64">
    <div class="flex md:hidden items-center justify-between mb-3">
      <h5 class="text-lg font-bold text-right">{{ survey.name }}</h5>
      <h6>{{ survey.referenceDate }}</h6>
    </div>
    <div
      class="w-full flex flex-wrap items-end justify-between border-b border-gray-200"
    >
      <div
        class="flex items-center md:space-x-3 justify-around md:justify-start w-full md:w-auto"
      >
        <button
          v-for="menuOption in menu"
          :key="menuOption.code"
          class="w-20 font-semibold hover:text-primary pb-2 border-b-2 border-transparent hover:border-primary transition duration-300 focus:outline-none"
          :class="selectedMenu === menuOption.code ? 'border-primary' : null"
          @click="selectMenu(menuOption.code)"
        >
          {{ menuOption.text }}
        </button>
      </div>
      <div class="hidden md:flex md:flex-col items-center">
        <h5 class="text-lg font-bold text-right">{{ survey.name }}</h5>
        <h6>{{ survey.referenceDate }}</h6>
      </div>
    </div>
    <div class="mt-5 w-full flex flex-col">
      <div
        v-for="question in questions"
        :key="question.code"
        class="relative py-3"
        @mouseenter="changeSubMenu(question.code)"
      >
        <div
          v-if="!showPreview"
          class="border shadow p-5 rounded w-full md:w-8/12 mx-auto flex items-center"
          :class="
            question.flags.includes('SECTION')
              ? 'border-primary'
              : 'border-gray-100'
          "
        >
          <span v-if="question.questionNumber !== 0"
            >{{ question.questionNumber }} - </span
          ><span
            :class="
              question.flags.includes('SECTION')
                ? 'text-primary font-bold'
                : null
            "
            >{{ question.name }}</span
          >
        </div>
        <display-question
          v-else
          :question="question"
          class="border border-gray-100 shadow p-8 rounded"
          :default-style="true"
          @showSubMenu="changeSubMenu(question.code)"
        ></display-question>

        <new-question-toolbar
          class="absolute w-full bottom-0 mb-1"
          :class="
            whichSubMenu === question.code ? 'visible' : 'visible md:hidden'
          "
          @newQuestion="newQuestion($event, question.ordinalPosition + 1)"
          @editQuestion="editQuestion(question)"
          @moveQuestion="moveQuestion(question)"
          @deleteQuestion="deleteQuestion(question)"
        ></new-question-toolbar>
      </div>
    </div>

    <transition name="fade">
      <template v-if="selectedMenu === 1">
        <edit-object-modal v-if="currentItemToBeEdited">
          <template v-slot:content>
            <new-question></new-question>
          </template>
        </edit-object-modal>
      </template>
      <template v-else-if="selectedMenu === 2">
        <edit-object-modal
          v-if="currentItemToBeEdited"
          @modalClosed="selectedMenu = 1"
        >
          <template v-slot:content>
            <survey-settings></survey-settings>
          </template>
        </edit-object-modal>
      </template>
      <template v-else-if="selectedMenu === 4">
        <preview-survey-modal
          :survey="survey"
          :questions="questions"
          @modalClosed="selectedMenu = 1"
        ></preview-survey-modal>
      </template>
    </transition>

    <div class="fixed bottom-0 right-0 mr-5 mb-5 z-10">
      <button class="btn-round-primary" @click="showPreview = !showPreview">
        <i v-if="!showPreview" class="fas fa-eye fa-fw"></i>
        <i v-else class="fas fa-eye-slash fa-fw"></i>
      </button>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
import NewQuestionToolbar from '~/components/surveys/NewQuestionToolBar'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import NewQuestion from '~/components/surveys/NewQuestion'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import SurveySettings from '~/components/surveys/SurveySettings'
import PreviewSurveyModal from '~/components/surveys/PreviewSurveyModal'

export default {
  name: 'QuestionList',
  components: {
    PreviewSurveyModal,
    NewQuestion,
    Spinner,
    DisplayQuestion,
    NewQuestionToolbar,
    EditObjectModal,
    SurveySettings,
  },
  data() {
    return {
      menu: [
        { code: 1, text: 'Questions' },
        { code: 2, text: 'Settings' },
        { code: 3, text: 'Language' },
        { code: 4, text: 'Preview' },
      ],
      selectedMenu: 1,
      showPreview: true,
      whichSubMenu: null,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    questions() {
      return this.$store.getters.getSortedItems('questions').sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
    },
    survey() {
      return parseSurveyToForm(this.$store.getters.getItems('surveys')[0])
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('surveys/getSurveyByCode', this.$route.params.id),
      this.$store.dispatch('questions/getQuestionsBySurvey', {
        limit: 1000,
        offset: 0,
        code: this.$route.params.id,
      }),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  methods: {
    newQuestion(flag, ordinalPosition) {
      this.$store.dispatch('setCurrentItemToBeEdited', {
        code: -1,
        surveyCode: Number(this.$route.params.id),
        flags: [flag],
        ordinalPosition,
      })
    },
    editQuestion(question) {
      this.$store.dispatch('setCurrentItemToBeEdited', question)
    },
    moveQuestion(question) {},
    deleteQuestion(question) {
      console.log('here')
      this.$store.dispatch('questions/deleteQuestion', question.code)
    },
    chooseQuestion(question) {
      this.$store.dispatch('setCurrentItemToBeEdited', question)
    },
    selectMenu(code) {
      if (code === 2)
        this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
      this.selectedMenu = code
    },
    changeSubMenu(code) {
      this.whichSubMenu = code
    },
  },
}
</script>
