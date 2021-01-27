<template>
  <div v-if="!loading" class="flex flex-col flex-wrap">
    <div class="flex md:hidden items-baseline justify-between px-2 py-2">
      <h6>{{ survey.name }}</h6>
      <p>{{ survey.referenceDate }}</p>
    </div>
    <div
      class="w-full flex flex-wrap items-baseline justify-between bg-white py-4 md:py-2 rounded px-3"
    >
      <div
        class="flex items-center md:space-x-3 justify-around md:justify-start w-full md:w-auto border-b-2 border-gray-100"
      >
        <button
          v-for="menuOption in menu"
          :key="menuOption.code"
          class="flex-grow items-center md:flex md:justify-center md:w-44 font-semibold hover:text-primary transition duration-300 focus:outline-none py-2"
          :class="
            selectedMenu === menuOption.code
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectMenu(menuOption.code)"
        >
          <i class="mr-2" :class="menuOption.icon" :title="menuOption.text"></i>
          <span class="hidden md:block">{{ menuOption.text }}</span>
        </button>
      </div>
      <div class="hidden md:flex items-center space-x-2">
        <h6>{{ survey.name }}</h6>
        <p>{{ survey.referenceDate }}</p>
      </div>
    </div>
    <div class="mt-5 w-full md:w-8/12 mx-auto flex flex-col">
      <div v-for="question in questions" :key="question.code" class="relative">
        <div
          class="border border-gray-100 shadow rounded w-full mx-auto flex items-stretch"
        >
          <div
            class="w-12 flex justify-center items-center p-5 text-white text-lg rounded-l bg-primary"
          >
            {{ question.ordinalPosition }}
          </div>
          <div v-if="!showPreview" class="flex flex-col flex-grow p-3">
            <span
              class="mb-2"
              :class="
                question.flags.includes('SECTION')
                  ? 'font-semibold'
                  : 'font-medium'
              "
              >{{ question.name }}</span
            >
            <div class="flex">
              <span
                class="text-sm bg-gray-100 rounded border border-gray-200 px-2 text-gray-700 mr-2"
                >{{ questionText(question).toLowerCase() }}</span
              >
              <span
                v-if="
                  JSON.parse(question.surveyOptions).branching.rules.length !==
                  0
                "
                title="Has Branching"
                class="text-sm bg-gray-100 rounded border border-gray-200 px-2 text-gray-700 mr-2"
                >branching</span
              >
            </div>
          </div>
          <display-question
            v-else
            :question="question"
            class="p-8 w-full"
            :default-style="true"
          ></display-question>
          <div class="w-12 flex justify-center items-center p-5">
            <popup-menu direction="center">
              <template v-slot:menuButton
                ><button class="btn-link-rounded">
                  <i class="fas fa-ellipsis-v fa-fw"></i></button
              ></template>
              <template v-slot:menuItems>
                <button class="w-full" @click="editQuestion(question)">
                  <span class="popup-menu-button">
                    <i class="fa-fw fas fa-pencil-alt fa-sm"></i>Edit</span
                  >
                </button>
                <button
                  v-if="question.ordinalPosition !== 1"
                  class="w-full"
                  @click="moveQuestion(question)"
                >
                  <span class="popup-menu-button">
                    <i class="fa-fw fas fa-arrows-alt-v fa-sm"></i>Move</span
                  >
                </button>
                <button
                  v-if="question.ordinalPosition !== 1"
                  class="w-full"
                  @click="deleteQuestion(question)"
                >
                  <span class="popup-menu-button">
                    <i class="fa-fw fas fa-trash-alt fa-sm"></i>Delete</span
                  >
                </button>
              </template>
            </popup-menu>
          </div>
        </div>

        <div class="flex justify-center my-2 p-2">
          <popup-menu direction="center">
            <template v-slot:menuButton
              ><span class="btn-link-rounded"
                ><i class="fas fa-plus fa-fw"></i></span
            ></template>
            <template v-slot:menuItems>
              <button
                v-for="questionType in questionTypes"
                :key="questionType.code"
                @click="
                  newQuestion(questionType.flag, question.ordinalPosition + 1)
                "
              >
                <span class="popup-menu-button">
                  <i class="fa-fw fa-sm" :class="questionType.icon"></i
                  >{{ questionType.text }}</span
                >
              </button>
            </template>
          </popup-menu>
        </div>
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
      <button class="btn-round-primary" @click="showPreviewToggle">
        <i v-if="!showPreview" class="fas fa-eye fa-fw"></i>
        <i v-else class="fas fa-eye-slash fa-fw"></i>
      </button>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import cookies from 'js-cookie'
import Spinner from '~/components/layouts/Spinner'
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
import {
  getQuestionType,
  parseSurveyToForm,
} from '~/helpers/parseSurveyObjects'
import NewQuestion from '~/components/surveys/NewQuestion'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import SurveySettings from '~/components/surveys/SurveySettings'
import PreviewSurveyModal from '~/components/surveys/PreviewSurveyModal'
import SurveyLanguageSettings from '~/components/surveys/SurveyLanguageSettings'
import QuestionMoveMenu from '~/components/surveys/QuestionMoveMenu'
import SurveyCollaborators from '~/components/surveys/SurveyCollaborators'
import { QUESTION_TYPES } from '~/helpers/constants'
import PopupMenu from '~/components/layouts/PopupMenu'

export default {
  name: 'QuestionList',
  components: {
    SurveyCollaborators,
    QuestionMoveMenu,
    PreviewSurveyModal,
    NewQuestion,
    Spinner,
    DisplayQuestion,
    EditObjectModal,
    SurveySettings,
    SurveyLanguageSettings,
    PopupMenu,
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
      showPreview: null,
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
    questionTypes() {
      return QUESTION_TYPES
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
  mounted() {
    this.showPreview = cookies.get('questionPreviewMode') === 'true'
  },
  methods: {
    newQuestion(flag, ordinalPosition) {
      this.$store.dispatch('setCurrentItemToBeEdited', {
        code: -1,
        questionNumber: ordinalPosition,
        surveyCode: Number(this.$route.params.id),
        flags: [flag],
        ordinalPosition,
        surveyOptions: JSON.stringify({}),
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
    questionText(question) {
      return QUESTION_TYPES[getQuestionType(question)].text
    },
    showPreviewToggle() {
      this.showPreview = !this.showPreview
      cookies.set('questionPreviewMode', this.showPreview)
    },
  },
}
</script>
