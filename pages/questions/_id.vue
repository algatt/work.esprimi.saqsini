<template>
  <div v-if="!loading" class="flex flex-col flex-wrap">
    <top-header-bar
      :which="selectedView === 'questions' ? 'questions' : 'invites'"
      :items="selectedView === 'questions' ? [] : invites"
      class="w-full"
      :hide-select-all="selectedView === 'questions'"
      :hide-delete="true"
      ><template v-slot:title
        >{{ survey.name }}
        <small class="ml-2 self-baseline font-normal">{{
          survey.referenceDate
        }}</small></template
      >
      <template v-slot:extraButtons>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6"
          :class="
            selectedView === 'questions'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'questions'"
        >
          <i class="xl:pr-2 fas fa-question fa-fw" title="Questions"></i>
          <span class="hidden md:block">Questions</span>
        </button>
        <button
          class="items-center md:flex md:justify-center font-semibold hover:text-primary transition duration-300 focus:outline-none py-3 mr-6"
          :class="
            selectedView === 'invites'
              ? 'text-primary border-b-2 border-primary'
              : 'text-gray-500'
          "
          @click="selectedView = 'invites'"
        >
          <i class="xl:pr-2 fas fa-paper-plane fa-fw" title="Invites"></i>
          <span class="hidden md:block">Outreach</span>
        </button>
      </template>
      <template
        v-if="selectedView === 'questions'"
        v-slot:menuButtonIfNotSelected
      >
        <button class="w-full" @click="selectMenu('settings')">
          <span class="popup-menu-button">
            <i class="fas fa-sliders-h fa-fw mr-1"></i>Settings</span
          >
        </button>
        <button class="w-full" @click="selectMenu('language')">
          <span class="popup-menu-button">
            <i class="fas fa-language fa-fw mr-1"></i>Language</span
          >
        </button>
        <button class="w-full" @click="selectMenu('collaborators')">
          <span class="popup-menu-button">
            <i class="fas fa-users fa-fw mr-1"></i>Collaborators</span
          >
        </button>
        <button class="w-full" @click="selectMenu('preview')">
          <span class="popup-menu-button">
            <i class="fas fa-eye fa-fw mr-1"></i>Preview</span
          >
        </button>
        <button class="w-full" @click="showPreviewToggle">
          <span class="popup-menu-button">
            <template v-if="showPreview">
              <i class="fas fa-question-circle fa-fw mr-1"></i>Show Title
              Only</template
            >
            <template v-else
              ><i
                v-if="!showPreview"
                class="fas fa-question-circle fa-fw mr-1"
              ></i
              >Show Question Content</template
            >
          </span>
        </button>
      </template>
      <template v-else v-slot:menuButtonIfNotSelected>
        <button class="w-full" @click="invite()">
          <span class="popup-menu-button">
            <i class="fas fa-paper-plane fa-fw mr-1"></i>Invite</span
          >
        </button>
      </template></top-header-bar
    >

    <div v-if="selectedView === 'invites'">
      <invites @contacts="checkContacts"></invites>
    </div>
    <div v-else class="flex flex-col">
      <div
        v-for="iteration in questionsNumberOfSections"
        :key="'page' + iteration"
        class="mt-5 w-full md:w-8/12 mx-auto flex flex-col border-2 border-gray-100 rounded shadow p-3"
      >
        <div
          v-for="question in getQuestionsInPage(iteration)"
          :key="question.code"
          class="flex"
        >
          <div class="flex flex-1">
            <div
              v-if="question.flags.includes('SECTION')"
              class="flex flex-col pb-4 mb-3"
            >
              <div class="flex items-baseline">
                <h5>Page</h5>
                <p class="ml-2">{{ question.name }}</p>
              </div>
              <div v-if="showPreview">
                <p>{{ getQuestionContent(question) }}</p>
              </div>
            </div>
            <div v-else class="flex flex-col mb-1 p-3 w-full">
              <div class="flex">
                <div
                  class="w-12 text-primary text-2xl text-center font-semibold"
                >
                  {{ question.ordinalPosition }}
                </div>

                <div class="flex flex-1 items-center pl-1">
                  {{ question.name }}
                </div>
              </div>
              <display-question
                v-if="showPreview"
                :question="question"
                class="p-3 w-full"
                :default-style="true"
              >
              </display-question>
            </div>
          </div>
          <div class="flex w-32 justify-end items-center px-3">
            <popup-menu direction="center" class="mr-2">
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
    </div>

    <transition name="fade">
      <template
        v-if="
          selectedView === 'questions' &&
          currentItemToBeEdited &&
          currentItemToBeEdited.surveyCode
        "
      >
        <edit-object-modal>
          <template v-slot:content>
            <new-question></new-question>
          </template>
        </edit-object-modal>
      </template>
      <template v-if="selectedMenu === 'settings' && currentItemToBeEdited">
        <edit-object-modal @modalClosed="selectedMenu = ''">
          <template v-slot:title>Survey Settings</template>
          <template v-slot:content>
            <survey-settings></survey-settings>
          </template>
        </edit-object-modal>
      </template>
      <template v-if="selectedMenu === 'language' && currentItemToBeEdited">
        <edit-object-modal @modalClosed="selectedMenu = ''">
          <template v-slot:title>Language Settings</template>
          <template v-slot:content>
            <survey-language-settings></survey-language-settings>
          </template>
        </edit-object-modal>
      </template>
      <template v-if="selectedMenu === 'preview' && currentItemToBeEdited">
        <preview-survey-modal
          :survey="survey"
          :questions="questions"
          @modalClosed="selectedMenu = ''"
        ></preview-survey-modal>
      </template>
      <template
        v-if="selectedMenu === 'collaborators' && currentItemToBeEdited"
      >
        <edit-object-modal @modalClosed="selectedMenu = ''">
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
  parseQuestionToForm,
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
import Invites from '~/components/contacts/Invites'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'

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
    Invites,
    TopHeaderBar,
  },
  data() {
    return {
      selectedMenu: '',
      selectedView: 'questions',
      showPreview: null,
      whichSubMenu: null,
      showMoveMenu: null,
      invites: [],
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
    questionsWithSections() {
      const x = JSON.parse(JSON.stringify(this.questions))
      let page = 0
      x.forEach((el) => {
        if (el.flags.includes('SECTION')) page++
        el.page = page
      })
      return x
    },
    questionsNumberOfSections() {
      const x = this.questionsWithSections.map((el) => {
        return el.page
      })
      return new Set(x).size
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
      this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
      this.selectedMenu = code
    },
    changeSubMenu(code) {
      this.whichSubMenu = code
    },
    questionText(question) {
      return QUESTION_TYPES[getQuestionType(question)].text
    },
    getQuestionContent(question) {
      return parseQuestionToForm(question).text
    },
    showPreviewToggle() {
      this.showPreview = !this.showPreview
      cookies.set('questionPreviewMode', this.showPreview)
    },
    invite() {
      alert('todo')
    },
    checkContacts(result) {
      this.invites = result
    },
    getQuestionsInPage(page) {
      return this.questionsWithSections.filter((el) => {
        return el.page === page
      })
    },
  },
}
</script>
