<template>
  <div v-if="!loading" class="flex flex-col flex-wrap">
    <template v-if="!error">
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
        <template v-slot:extraContent>
          <div class="xl:ml-6 ml-0 flex items-center">
            <contact-book-dropdown
              :disabled="getBranchingContactBook().length > 0"
              @changedList="updateData"
            ></contact-book-dropdown>
          </div>
        </template>
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
          class="mt-5 w-full md:w-8/12 mx-auto flex flex-col border-2 border-gray-100 rounded shadow p-6 bg-gray-100 mb-5"
        >
          <div
            v-for="question in getQuestionsInPage(iteration)"
            :key="question.code"
            class="relative"
          >
            <div
              class="flex flex-col w-full bg-white border border-gray-200 rounded p-5"
            >
              <div class="flex w-full">
                <div class="flex flex-1 items-center">
                  <span
                    class="font-semibold text-gray-800"
                    :class="
                      question.flags.includes('SECTION')
                        ? 'text-2xl'
                        : 'text-xl'
                    "
                    >{{ question.name }}</span
                  >
                  <span
                    class="text-white font-bold text-sm bg-primary ml-2 rounded flex items-center justify-center px-1.5 shadow-sm"
                    >{{ question.questionNumber }}</span
                  >
                </div>
                <div class="w-16 flex items-center justify-end">
                  <popup-menu class="mr-2">
                    <template v-slot:menuButton
                      ><button class="btn-link-rounded">
                        <i class="fas fa-ellipsis-v fa-fw"></i></button
                    ></template>
                    <template v-slot:menuItems>
                      <button class="w-full" @click="editQuestion(question)">
                        <span class="popup-menu-button">
                          <i class="fa-fw fas fa-pencil-alt fa-sm"></i
                          >Edit</span
                        >
                      </button>
                      <button
                        v-if="question.ordinalPosition !== 1"
                        class="w-full"
                        @click="moveQuestion(question)"
                      >
                        <span class="popup-menu-button">
                          <i class="fa-fw fas fa-arrows-alt-v fa-sm"></i
                          >Move</span
                        >
                      </button>
                      <button
                        v-if="question.ordinalPosition !== 1"
                        class="w-full"
                        @click="deleteQuestion(question)"
                      >
                        <span class="popup-menu-button">
                          <i class="fa-fw fas fa-trash-alt fa-sm"></i
                          >Delete</span
                        >
                      </button>
                    </template>
                  </popup-menu>
                </div>
              </div>
              <div class="flex items-center py-2">
                <span
                  class="text-sm bg-gray-100 rounded border border-gray-200 text-gray-600 px-1 py-0.5 mr-1"
                  >{{ questionTypeText(question) }}</span
                >
                <span
                  v-if="
                    JSON.parse(question.surveyOptions).branching.rules
                      .length !== 0
                  "
                  class="text-sm bg-gray-100 rounded border border-gray-200 text-gray-600 px-1 py-0.5"
                  >branching</span
                >
              </div>
              <display-question
                v-if="showPreview"
                :question="question"
                :language-text="languageText"
                class="p-3 w-full"
              >
              </display-question>
            </div>
            <div
              class="absolute z-20 mx-auto left-0 right-0 flex justify-center"
              style="bottom: -10px"
            >
              <popup-menu>
                <template v-slot:menuButton
                  ><span class="btn-link-rounded"
                    ><i class="fas fa-plus fa-fw"></i></span
                ></template>
                <template v-slot:menuItems>
                  <button
                    v-for="questionType in questionTypes"
                    :key="questionType.code"
                    @click="
                      newQuestion(
                        questionType.flag,
                        question.ordinalPosition + 1
                      )
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
          <edit-object-modal width="md:w-11/12">
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
            :original-survey="unparsedSurvey"
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

      <modal-generic
        v-if="cannotDeleteDueToBranching.length !== 0"
        @cancel="cannotDeleteDueToBranching = []"
      >
        <template v-slot:title>Cannot Delete</template>
        <template v-slot:body>
          <div class="flex flex-col mb-5">
            <p class="mb-4">
              This question is being used for branching by the following
              questions
            </p>
            <p
              v-for="(item, index) in cannotDeleteDueToBranching"
              :key="index"
              class="my-2"
            >
              <span>{{ item.name }}</span>
              <span
                class="bg-primary text-white text-sm font-semibold rounded-lg px-1 py-0.5"
                >{{ item.questionNumber }}</span
              >
            </p>
          </div>
        </template>
      </modal-generic>
    </template>
    <template v-else>
      <info-box class="mt-2"
        ><template v-slot:title>We have a problem!</template
        ><template v-slot:content
          >You have landed on this page incorrectly, make sure you have clicked
          on the correct links.</template
        ></info-box
      >
    </template>
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
import {
  QUESTION_TYPES,
  SURVEY_LANGUAGE_GENERIC_TERMS,
} from '~/helpers/constants'
import PopupMenu from '~/components/layouts/PopupMenu'
import Invites from '~/components/contacts/Invites'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import ContactBookDropdown from '~/components/contacts/ContactBookDropdown'
import ModalGeneric from '~/components/layouts/ModalGeneric'

export default {
  name: 'QuestionList',
  components: {
    ModalGeneric,
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
    ContactBookDropdown,
  },
  data() {
    return {
      selectedMenu: '',
      selectedView: 'questions',
      showPreview: null,
      whichSubMenu: null,
      showMoveMenu: null,
      invites: [],
      error: false,
      loading: true,
      cannotDeleteDueToBranching: [],
    }
  },
  computed: {
    languageText() {
      const data = {}
      Object.keys(SURVEY_LANGUAGE_GENERIC_TERMS).forEach((el) => {
        data[el] = this.survey.translatedText[
          SURVEY_LANGUAGE_GENERIC_TERMS[el]
        ].text
      })
      return data
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
    unparsedSurvey() {
      return this.$store.getters.getItems('surveys')[0]
    },
    survey() {
      return parseSurveyToForm(this.unparsedSurvey)
    },

    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    questionTypes() {
      return QUESTION_TYPES
    },
  },
  async mounted() {
    await this.updateData()
    this.showPreview = cookies.get('questionPreviewMode') === 'true'
    if (this.survey.flags.includes('OUTDATED_LANGUAGE_PACK'))
      this.$toasted.show(
        'This survey has changed from last language generation. You need to re-generate the languages.'
      )
  },

  methods: {
    async updateData() {
      this.error = false
      this.loading = true

      try {
        await this.$store.dispatch('contactlist/getContactLists', {
          limit: 100,
          offset: 0,
        })
        console.log('contact list')
        await this.$store.dispatch(
          'surveys/getSurveyByCode',
          this.$route.params.id
        )
        console.log('survey')
        await this.$store.dispatch('questions/getQuestionsBySurvey', {
          limit: 1000,
          offset: 0,
          code: this.$route.params.id,
        })

        if (this.getBranchingContactBook().length > 0) {
          const tempLists = this.$store.getters.getItems('contactlist')
          await this.$store.dispatch(
            'setContactList',
            tempLists.find((el) => {
              return el.code === this.getBranchingContactBook()[0]
            })
          )
        }
      } catch {
        this.error = true
      } finally {
        this.loading = false
      }
    },
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
      this.cannotDeleteDueToBranching = []
      this.questions.forEach((el) => {
        const branching = JSON.parse(el.surveyOptions)
        branching.branching.rules.forEach((rule) => {
          rule.ruleList.forEach((rl) => {
            if (String(rl.questionNumber) === String(question.questionNumber)) {
              if (
                !this.cannotDeleteDueToBranching.find((findQuestion) => {
                  return (
                    String(findQuestion.questionNumber) ===
                    String(rl.questionNumber)
                  )
                })
              )
                this.cannotDeleteDueToBranching.push({
                  questionNumber: el.questionNumber,
                  name: el.name,
                })
            }
          })
        })
      })

      if (this.cannotDeleteDueToBranching.length === 0)
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
    questionTypeText(question) {
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
    getBranchingContactBook() {
      const code = []
      for (const i in this.questions) {
        const tempQuestion = JSON.parse(this.questions[i].surveyOptions)
        if (tempQuestion.branching.rules.length > 0) {
          tempQuestion.branching.rules.forEach((el) => {
            if (!code.includes(el.contactListCode))
              code.push(el.contactListCode)
          })
        }
      }
      return code
    },
    getQuestionsInPage(page) {
      return this.questionsWithSections.filter((el) => {
        return el.page === page
      })
    },
  },
}
</script>
