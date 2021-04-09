<template>
  <div v-if="!loading" class="flex flex-col flex-wrap">
    <template v-if="!error">
      <top-header-bar
        :which="selectedView === 'questions' ? 'questions' : 'invites'"
        :items="[]"
        :hide-select-all="true"
        :hide-delete="true"
        :disable-menu="selectedView === 'invites'"
      >
        <template v-slot:title>
          {{ survey.name }}
          <small class="ml-2 self-baseline font-normal">
            {{ survey.referenceDate }}
          </small>
        </template>
        <template v-slot:extraContent>
          <div class="xl:ml-6 ml-0 flex items-center">
            <contact-book-dropdown
              v-if="canUseContactBook"
              :disabled="getBranchingContactBook().length > 0"
              @changedList="updateData"
            ></contact-book-dropdown>
          </div>
        </template>
        <template v-slot:extraButtons>
          <menu-icon-button
            :active="selectedView === 'questions'"
            @click="selectedView = 'questions'"
          >
            Questions
            <template v-slot:icon>
              <i class="fas fa-question fa-fw" title="Questions"></i>
            </template>
          </menu-icon-button>
          <menu-icon-button
            :active="selectedView === 'invites'"
            @click="selectedView = 'invites'"
          >
            Outreach
            <template v-slot:icon>
              <i class="fas fa-paper-plane fa-fw" title="Outreach"></i>
            </template>
          </menu-icon-button>
        </template>
        <template
          v-if="selectedView === 'questions'"
          v-slot:menuButtonIfNotSelected
        >
          <span @click="selectMenu('settings')">
            <i class="fas fa-sliders-h fa-fw"></i>
            Settings
          </span>
          <span @click="selectMenu('language')">
            <i class="fas fa-language fa-fw"></i>
            Language
          </span>

          <span @click="selectMenu('collaborators')">
            <i class="fas fa-users fa-fw"></i>
            Collaborators
          </span>

          <span @click="selectMenu('invite_settings')">
            <i class="fas fa-envelope-open-text fa-fw"></i>
            Invite Settings
          </span>

          <span @click="selectMenu('preview')">
            <i class="fas fa-eye fa-fw"></i>
            Preview
          </span>

          <span @click="showPreviewToggle">
            <template v-if="showPreview">
              <i class="fas fa-question-circle fa-fw"></i>
              Show Title Only
            </template>
            <template v-else>
              <i v-if="!showPreview" class="fas fa-question-circle fa-fw"></i>
              Show Question Content
            </template>
          </span>
        </template>
      </top-header-bar>

      <div v-if="selectedView === 'invites'" class="flex flex-col w-full">
        <invites></invites>
      </div>
      <div v-else class="flex flex-col w-full">
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
            <div class="flex flex-col w-full bg-white p-5">
              <div class="flex w-full">
                <div class="flex flex-1 items-center">
                  <span
                    class="font-semibold text-gray-800"
                    :class="
                      question.flags.includes('SECTION')
                        ? 'text-2xl'
                        : 'text-xl'
                    "
                  >
                    {{ question.name }}
                  </span>
                  <span class="mx-2 text-primary font-bold text-lg">
                    {{ question.questionNumber }}
                  </span>
                </div>
                <div class="w-16 flex items-center justify-end">
                  <popup-menu>
                    <template v-slot:icon>
                      <button-icon-rounded bg-colour="gray">
                        <i class="fas fa-ellipsis-v fa-fw"></i>
                      </button-icon-rounded>
                    </template>
                    <template v-slot:menu>
                      <span @click="editQuestion(question)">
                        <i class="fa-fw fas fa-pencil-alt fa-sm"></i>
                        Edit
                      </span>
                      <span
                        v-if="question.ordinalPosition !== 1"
                        @click="moveQuestion(question)"
                      >
                        <i class="fa-fw fas fa-arrows-alt-v fa-sm"></i>
                        Move
                      </span>
                      <span
                        v-if="question.ordinalPosition !== 1"
                        @click="deleteQuestion(question)"
                      >
                        <i class="fa-fw fas fa-trash-alt fa-sm"></i>
                        Delete
                      </span>
                    </template>
                  </popup-menu>
                </div>
              </div>
              <div class="flex items-center py-2">
                <badge-base class="mr-1">
                  {{ questionTypeText(question) }}
                </badge-base>
                <badge-base
                  v-if="
                    JSON.parse(question.surveyOptions).branching.rules
                      .length !== 0
                  "
                >
                  branching
                </badge-base>
              </div>
              <display-question
                v-if="showPreview"
                :question="question"
                :language-text="languageText"
                class="w-full"
              ></display-question>
            </div>
            <div
              class="flex xl:hidden justify-center py-2 bg-white border-t-2 border-b-2 border-gray-100"
            >
              <popup-menu>
                <template v-slot:icon>
                  <button-icon-rounded bg-colour="blue">
                    <i class="fas fa-plus fa-fw fa-sm"></i>
                  </button-icon-rounded>
                </template>

                <template v-slot:menu>
                  <span
                    v-for="questionType in questionTypes"
                    :key="questionType.code"
                    @click="
                      newQuestion(
                        questionType.flag,
                        question.ordinalPosition + 1
                      )
                    "
                  >
                    <i class="fa-fw fa-sm" :class="questionType.icon"></i>
                    {{ questionType.text }}
                  </span>
                </template>
              </popup-menu>
            </div>
            <div
              class="bigScreenPopup hidden xl:flex h-5 cursor-pointer hover:h-10 hover:bg-white duration-500"
            >
              <div class="w-12 flex items-start justify-start">
                <i
                  id="bigScreenPopupIndicator"
                  class="fas fa-caret-right fa-fw text-gray-400 opacity-1"
                ></i>
              </div>
              <div class="flex flex-1 justify-center">
                <popup-menu id="bigScreenPopupChild" class="opacity-0">
                  <template v-slot:icon>
                    <button-icon-rounded bg-colour="blue">
                      <i class="fas fa-plus fa-fw fa-sm"></i>
                    </button-icon-rounded>
                  </template>

                  <template v-slot:menu>
                    <span
                      v-for="questionType in questionTypes"
                      :key="questionType.code"
                      @click="
                        newQuestion(
                          questionType.flag,
                          question.ordinalPosition + 1
                        )
                      "
                    >
                      <i class="fa-fw fa-sm" :class="questionType.icon"></i>
                      {{ questionType.text }}
                    </span>
                  </template>
                </popup-menu>
              </div>
              <div class="w-12"></div>
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
          <edit-object-modal custom-width="md:w-8/12">
            <template v-slot:secondTitle>Question</template>
            <template v-slot:content>
              <new-question></new-question>
            </template>
          </edit-object-modal>
        </template>
        <template v-if="selectedMenu === 'settings' && currentItemToBeEdited">
          <edit-object-modal
            custom-width="md:w-6/12"
            @modalClosed="selectedMenu = ''"
          >
            <template v-slot:title>Survey Settings</template>
            <template v-slot:content>
              <survey-settings></survey-settings>
            </template>
          </edit-object-modal>
        </template>
        <template v-if="selectedMenu === 'language' && currentItemToBeEdited">
          <edit-object-modal
            custom-width="md:w-6/12"
            @modalClosed="selectedMenu = ''"
          >
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
          <edit-object-modal
            custom-width="md:w-6/12"
            @modalClosed="selectedMenu = ''"
          >
            <template v-slot:title>Collaborators</template>
            <template v-slot:content>
              <survey-collaborators></survey-collaborators>
            </template>
          </edit-object-modal>
        </template>
        <template
          v-if="selectedMenu === 'invite_settings' && currentItemToBeEdited"
        >
          <edit-object-modal @modalClosed="selectedMenu = ''">
            <template v-slot:title>Invites Settings</template>
            <template v-slot:content>
              <survey-invites-settings></survey-invites-settings>
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
              >
                {{ item.questionNumber }}
              </span>
            </p>
          </div>
        </template>
      </modal-generic>
    </template>
    <template v-else>
      <info-box class="mt-2">
        <template v-slot:title>We have a problem!</template>
        <template v-slot:content>
          You have landed on this page incorrectly, make sure you have clicked
          on the correct links.
        </template>
      </info-box>
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
import PopupMenu from '~/components/elements/PopupMenu'
import Invites from '~/components/contacts/Invites'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import ContactBookDropdown from '~/components/contacts/ContactBookDropdown'
import ModalGeneric from '~/components/layouts/ModalGeneric'
import SurveyInvitesSettings from '~/components/surveys/SurveyInvitesSettings'
import MenuIconButton from '~/components/layouts/MenuIconButton'
import BadgeBase from '~/components/elements/BadgeBase'
import ButtonIconRounded from '~/components/elements/ButtonIconRounded'

export default {
  name: 'QuestionList',
  middleware: ['surveyBuilder'],
  components: {
    ButtonIconRounded,
    BadgeBase,
    MenuIconButton,
    SurveyInvitesSettings,
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
      error: false,
      loading: true,
      cannotDeleteDueToBranching: [],
    }
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACT_BOOK')
    },
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
        if (this.canUseContactBook)
          await this.$store.dispatch('contactlist/getContactLists', {
            limit: 100,
            offset: 0,
          })

        await this.$store.dispatch(
          'surveys/getSurveyByCode',
          this.$route.params.id
        )

        await this.$store.dispatch('questions/getQuestionsBySurvey', {
          limit: 1000,
          offset: 0,
          code: this.$route.params.id,
        })

        if (
          this.canUseContactBook &&
          this.getBranchingContactBook().length > 0
        ) {
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
        questionNumber: this.getMaxQuestionNumber(),
        surveyCode: Number(this.$route.params.id),
        flags: [flag],
        ordinalPosition,
        surveyOptions: JSON.stringify({}),
      })
    },
    getMaxQuestionNumber() {
      let max = null
      this.questions.forEach((el) => {
        if (Number(el.questionNumber)) {
          if (!max) max = Number(el.questionNumber)
          else if (max < Number(el.questionNumber))
            max = Number(el.questionNumber)
        }
      })
      return max + 1
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

<style scoped>
.bigScreenPopup #bigScreenPopupChild {
  @apply opacity-0 transition-all duration-300;
}
.bigScreenPopup:hover #bigScreenPopupChild {
  @apply opacity-100 ease-in transition-all duration-300;
}

.bigScreenPopup #bigScreenPopupIndicator {
  @apply opacity-100 transition-all duration-500;
}
.bigScreenPopup:hover #bigScreenPopupIndicator {
  @apply opacity-0 ease-in transition-all duration-100;
}

.bigScreenPopup {
  @apply border-t-2 border-b-2 border-gray-100 bg-gray-50;
  transition-property: height, background-color;
}

.bigScreenPopup:hover {
  @apply bg-white border-gray-100 bg-gray-50;
}
</style>
