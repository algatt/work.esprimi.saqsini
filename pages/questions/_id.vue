<template>
  <div v-if="!loading" class="flex flex-col flex-wrap">
    <div class="flex md:hidden items-center justify-between mb-3 px-1">
      <h5 class="text-lg font-bold text-right">{{ survey.name }}</h5>
      <h6>{{ survey.referenceDate }}</h6>
    </div>
    <div
      class="w-full flex flex-wrap items-center justify-between bg-gray-100 py-4 md:py-2 rounded px-3"
    >
      <div
        class="flex items-center md:space-x-3 justify-around md:justify-start w-full md:w-auto"
      >
        <button
          v-for="menuOption in menu"
          :key="menuOption.code"
          class="flex-grow md:flex md:justify-center md:w-24 font-semibold hover:text-primary transition duration-300 focus:outline-none"
          :class="selectedMenu === menuOption.code ? 'text-primary' : null"
          @click="selectMenu(menuOption.code)"
        >
          <span class="hidden md:block">{{ menuOption.text }}</span>
          <i
            class="block md:hidden"
            :class="menuOption.icon"
            :title="menuOption.text"
          ></i>
        </button>
      </div>
      <div class="hidden md:flex items-center">
        <h5 class="text-lg font-bold">{{ survey.name }}</h5>
        <h5 class="ml-3">{{ survey.referenceDate }}</h5>
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
          :first-element="question.ordinalPosition === 1"
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
          <template v-slot:title>Survey Settings</template>
          <template v-slot:content>
            <survey-settings></survey-settings>
          </template>
        </edit-object-modal>
      </template>
      <template v-else-if="selectedMenu === 3">
        <edit-object-modal
          v-if="currentItemToBeEdited"
          @modalClosed="selectedMenu = 1"
        >
          <template v-slot:title>Language Settings</template>
          <template v-slot:content>
            <survey-language-settings></survey-language-settings>
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
      <template v-else-if="selectedMenu === 5">
        <edit-object-modal
          v-if="currentItemToBeEdited"
          @modalClosed="selectedMenu = 1"
        >
          <template v-slot:title>Collaborators</template>
          <template v-slot:content
            ><survey-collaborators></survey-collaborators>
          </template>
        </edit-object-modal>
      </template>
    </transition>

    <question-move-menu
      v-if="showMoveMenu"
      :question="showMoveMenu"
      :questions="questions"
      @close="showMoveMenu = false"
    ></question-move-menu>

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
import SurveyLanguageSettings from '~/components/surveys/SurveyLanguageSettings'
import QuestionMoveMenu from '~/components/surveys/QuestionMoveMenu'
import SurveyCollaborators from '~/components/surveys/SurveyCollaborators'

export default {
  name: 'QuestionList',
  components: {
    SurveyCollaborators,
    QuestionMoveMenu,
    PreviewSurveyModal,
    NewQuestion,
    Spinner,
    DisplayQuestion,
    NewQuestionToolbar,
    EditObjectModal,
    SurveySettings,
    SurveyLanguageSettings,
  },
  data() {
    return {
      menu: [
        { code: 1, text: 'Questions', icon: 'fas fa-question' },
        { code: 2, text: 'Settings', icon: 'fas fa-sliders-h' },
        { code: 3, text: 'Language', icon: 'fas fa-language' },
        { code: 4, text: 'Preview', icon: 'far fa-eye' },
        { code: 5, text: 'Collaborators', icon: 'fas fa-users' },
      ],
      selectedMenu: 1,
      showPreview: true,
      whichSubMenu: null,
      showMoveMenu: null,
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
    moveQuestion(question) {
      this.showMoveMenu = question
    },
    deleteQuestion(question) {
      this.$store.dispatch('questions/deleteQuestion', question.code)
    },
    chooseQuestion(question) {
      this.$store.dispatch('setCurrentItemToBeEdited', question)
    },
    selectMenu(code) {
      if (code === 2 || code === 3 || code === 5)
        this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
      this.selectedMenu = code
    },
    changeSubMenu(code) {
      this.whichSubMenu = code
    },
  },
}
</script>
