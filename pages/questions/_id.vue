<template>
  <list-layout v-if="!loading && !error">
    <div
      class="w-full flex justify-between flex-wrap fixed bg-gray-50 md:h-20 h-36 border-b border-gray-200"
      style="top: 3rem; left: 0rem; z-index: 2"
    >
      <div class="w-full md:w-6/12 flex justify-start items-center px-4">
        <h4 class="mr-5">{{ survey.name }}</h4>
        <contact-list-select
          v-if="contactLists.length > 0"
          :disabled="
            getBranchingContactBook().includes(selectedContactList.code)
          "
        ></contact-list-select>
      </div>
      <div
        class="w-full md:w-6/12 flex items-center justify-start md:justify-end space-x-2 px-4"
      >
        <l-button title="Toggle View" @click="toggleShowPreview">
          <i class="fas fa-poll-h fa-fw mr-1"></i
          ><span class="hidden md:block">Toggle View</span>
        </l-button>
        <l-button title="Show Preview" @click="showSurveyPreview = true">
          <i class="fas fa-eye fa-fw mr-1"></i
          ><span class="hidden md:block">Preview</span>
        </l-button>
        <LPopupMenu>
          <template #icon>
            <l-button
              >Settings<template v-slot:rightIcon
                ><i class="fas fa-caret-down fa-fw"></i></template
            ></l-button>
          </template>
          <template v-slot:menu>
            <button @click="editSurvey">
              <i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit Survey Details
            </button>

            <button @click="manageOutreach">
              <i class="fas fa-paper-plane fa-fw"></i>Manage Outreach
            </button>
            <nuxt-link
              :to="{
                name: 'surveys-responses-id',
                params: { id: survey.code },
              }"
              ><button>
                <i class="fas fa-chart-pie fa-fw"></i>View Responses
              </button></nuxt-link
            >
            <button @click="showLanguageSettings">
              <i class="fas fa-language fa-fw"></i>Language
            </button>
            <button @click="showCollaborators">
              <i class="fas fa-users fa-fw"></i>Collaborators
            </button>
            <button @click="showInviteSettings">
              <i class="fas fa-envelope-open-text fa-fw"></i>Invite Settings
            </button>

            <button v-if="canUseContactBook" @click="clearBranching">
              <i class="fas fa-code-branch fa-fw"></i>Clear Branching
            </button>
          </template>
        </LPopupMenu>
      </div>
    </div>

    <div class="w-full md:w-8/12 flex flex-col mx-auto md:mt-20 mt-36">
      <survey-list-question
        v-for="section in sectionQuestions"
        :key="section.code"
        :question="section"
        :show-preview="showPreview"
        :max-number="getMaxQuestionNumber"
      >
        <div
          v-for="question in getQuestionsForSection(section)"
          :id="`question-${question.code}`"
          :key="question.code"
        >
          <survey-list-question
            :question="question"
            :show-preview="showPreview"
            :max-number="getMaxQuestionNumber"
          ></survey-list-question>
        </div>
      </survey-list-question>
    </div>
    <PreviewSurveyModal
      v-if="showSurveyPreview"
      :original-survey="survey"
      :questions="sortedQuestions"
      @modalClosed="showSurveyPreview = false"
    ></PreviewSurveyModal>
  </list-layout>
  <page-load-error v-else-if="!loading && error"></page-load-error>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import cookies from 'js-cookie'
import ListLayout from '~/components/elements/ListLayout'
import SurveyListQuestion from '~/components/surveys/SurveyListQuestion'
import LPopupMenu from '~/components/LPopupMenu'
import ModalService from '~/services/modal-services'
import PlainModal from '~/components/elements/PlainModal'
import PreviewSurveyModal from '~/components/surveys/PreviewSurveyModal'

import NewItemModal from '~/components/elements/NewItemModal'
import ContactListSelect from '~/components/elements/ContactListSelect'
import PageLoadError from '~/components/elements/PageLoadError'
import Spinner from '~/components/elements/Spinner'

export default {
  name: 'QuestionList',
  components: {
    Spinner,
    PageLoadError,
    ContactListSelect,
    PreviewSurveyModal,
    LPopupMenu,
    SurveyListQuestion,
    ListLayout,
  },
  middleware: ['surveyBuilder'],
  layout: 'authlayout',
  data() {
    return {
      beingHovered: null,
      showPreview: true,
      showSurveyPreview: false,
      loading: true,
      error: false,
    }
  },
  computed: {
    survey() {
      return this.$store.state.surveys.items[0]
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
    selectedContactList() {
      return this.$store.state.selectedContactList
    },
    sortedQuestions() {
      const x = JSON.parse(JSON.stringify(this.$store.state.questions.items))
      return x.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
    },
    sectionQuestions() {
      return this.sortedQuestions.filter((el) => {
        return el.flags.includes('SECTION')
      })
    },
    getMaxQuestionNumber() {
      let max = null
      this.sortedQuestions.forEach((el) => {
        if (Number(el.questionNumber)) {
          if (!max) max = Number(el.questionNumber)
          else if (max < Number(el.questionNumber))
            max = Number(el.questionNumber)
        }
      })
      return max + 1
    },

    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },
  },

  mounted() {
    this.loading = true
    this.loadData()
      .then(() => {
        this.showPreview = cookies.get('questionPreviewMode') === 'true'
        if (this.survey.flags.includes('OUTDATED_LANGUAGE_PACK'))
          this.$toasted.show(
            'This survey has changed from last language generation. You need to re-generate the languages.'
          )
      })
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },

  methods: {
    loadData() {
      return new Promise((resolve, reject) => {
        const promises = [
          this.$store.dispatch('categories/getCategories', {}),
          this.$store.dispatch(
            'surveys/getSurveyByCode',
            this.$route.params.id
          ),
          this.$store.dispatch('questions/getQuestionsBySurvey', {
            code: this.$route.params.id,
          }),
        ]
        if (this.canUseContactBook)
          promises.push(this.$store.dispatch('contactlist/getContactLists', {}))
        if (
          this.canUseContactBook &&
          this.getBranchingContactBook().length > 0
        ) {
          let tempLists = this.$store.state.contactlist.items
          tempLists = tempLists.find((el) => {
            return el.code === this.getBranchingContactBook()[0]
          })
          promises.push(this.$store.dispatch('setContactList', tempLists))
        }
        Promise.all(promises).then(() => {
          resolve()
        })
      })
    },

    getBranchingContactBook() {
      const code = []
      for (const i in this.sortedQuestions) {
        const tempQuestion = JSON.parse(this.sortedQuestions[i].surveyOptions)
        if (tempQuestion.branching.rules.length > 0) {
          tempQuestion.branching.rules.forEach((rule) => {
            rule.ruleList.forEach((ruleList) => {
              if (ruleList.contactListCode) {
                code.push(ruleList.contactListCode)
              }
            })
          })
        }
      }
      return code
    },

    getQuestionsForSection(section) {
      const nextSection = this.sortedQuestions
        .filter((el) => {
          return el.ordinalPosition > section.ordinalPosition
        })
        .find((el) => {
          return el.flags.includes('SECTION')
        })

      let temp = this.sortedQuestions.filter((el) => {
        return el.ordinalPosition > section.ordinalPosition
      })

      if (nextSection)
        temp = temp.filter((el) => {
          return el.ordinalPosition < nextSection.ordinalPosition
        })
      return temp
    },
    manageOutreach() {
      this.$router.push({
        name: 'surveys-invites-id',
        params: { id: this.$route.params.id },
      })
    },
    showLanguageSettings() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyLanguageSettings',
        dataItem: this.survey,
        options: {
          close: true,
        },
      })
    },
    showCollaborators() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyCollaborators',
        dataItem: this.survey,
        options: {
          close: true,
        },
      })
    },
    showInviteSettings() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyInvitesSettings',
        dataItem: this.survey,
      })
        .then((response) => {
          this.$store.dispatch('surveys/updateSurvey', response)
        })
        .catch(() => {})
    },
    toggleShowPreview() {
      this.showPreview = !this.showPreview
      cookies.set(
        'questionPreviewMode',
        this.showPreview === true ? 'true' : 'false'
      )
    },
    changeContactBook(code) {
      const contactList = this.contactLists.find((el) => {
        return el.code === code
      })
      this.$store.dispatch('setContactList', contactList)
    },

    editSurvey() {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewSurvey',
        dataItem: this.survey,
        options: { header: `Edit ${this.survey.name}` },
      })
        .then((response) => {
          this.$store
            .dispatch('surveys/updateSurvey', response)
            .then((survey) => {
              this.$store.dispatch('categories/getCategories')
              this.$toasted.show(`Survey ${survey.name} updated`)
            })
            .catch(() => {
              this.$toasted.error('There was a problem updating the survey')
            })
        })
        .catch(() => {})
    },

    clearBranching() {
      const promise = new Promise((resolve, reject) => {
        this.sortedQuestions.forEach((question) => {
          const obj = JSON.parse(JSON.stringify(question))
          const branching = JSON.parse(obj.surveyOptions).branching

          if (branching.rules) {
            branching.rules.forEach((rule) => {
              rule.ruleList = rule.ruleList.filter((el) => {
                return !el.contactListCode
              })
            })

            branching.rules = branching.rules.filter((el) => {
              return el.ruleList.length > 0
            })

            branching.rules.forEach((rule) => {
              const len = rule.ruleList.length
              if (len > 0 && rule.ruleList[len - 1].isAnd)
                delete rule.ruleList[len - 1].isAnd
            })

            if (branching.rules.length > 0) {
              delete branching.rules[branching.rules.length - 1].isAnd
            }
          }

          const surveyOptions = JSON.parse(obj.surveyOptions)
          surveyOptions.branching = branching
          obj.surveyOptions = JSON.stringify(surveyOptions)

          this.$store.dispatch('questions/updateQuestion', obj)

          if (obj.ordinalPosition === this.sortedQuestions.length) resolve()
        })
      })
      promise.then(() => {
        this.$toasted.show('Branching removed')
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
  @apply opacity-100 ease-in transition-all duration-300 h-10;
}
</style>
