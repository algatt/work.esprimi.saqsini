<template>
  <list-layout v-if="!loading">
    <div class="w-full mt-3 mb-6 flex justify-between flex-wrap">
      <div class="w-full md:w-6/12 flex justify-start items-center px-4">
        <h4 class="mt-2 mr-5">{{ survey.name }}</h4>
        <l-select
          v-if="canUseContactBook"
          :value="selectedContactList.code"
          :disabled="
            getBranchingContactBook().includes(selectedContactList.code)
          "
          @input="changeContactBook"
          ><template v-slot:options
            ><option v-for="cl in contactLists" :key="cl.code" :value="cl.code">
              {{ cl.name }}
            </option></template
          ></l-select
        >
      </div>
      <div class="w-full md:w-6/12 flex justify-start md:justify-end px-4">
        <LPopupMenu>
          <template #icon>
            <l-button
              >Settings<template v-slot:rightIcon
                ><i class="fas fa-caret-down fa-fw"></i></template
            ></l-button>
          </template>
          <template v-slot:menu>
            <button @click="showSurveySettings">
              <i class="fas fa-sliders-h fa-fw"></i>Settings
            </button>
            <button @click="manageOutreach">
              <i class="fas fa-paper-plane fa-fw"></i>Manage Outreach
            </button>
            <button @click="showLanguageSettings">
              <i class="fas fa-language fa-fw"></i>Language
            </button>
            <button @click="showCollaborators">
              <i class="fas fa-users fa-fw"></i>Collaborators
            </button>
            <button @click="showInviteSettings">
              <i class="fas fa-envelope-open-text fa-fw"></i>Invite Settings
            </button>
            <button @click="showSurveyPreview = true">
              <i class="fas fa-eye fa-fw"></i>Preview
            </button>
            <button @click="toggleShowPreview">
              <i class="fas fa-poll-h fa-fw"></i>Toggle View
            </button>
            <button @click="clearBranching">
              <i class="fas fa-code-branch fa-fw"></i>Clear Branching
            </button>
          </template>
        </LPopupMenu>
      </div>
    </div>

    <div class="w-full md:w-8/12 flex flex-col mx-auto">
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
  <div v-else>loading</div>
</template>

<script>
import cookies from 'js-cookie'
import ListLayout from '~/components/layouts/ListLayout'
import SurveyListQuestion from '~/components/surveys/SurveyListQuestion'
import LPopupMenu from '~/components/LPopupMenu'
import ModalService from '~/services/modal-services'
import PlainModal from '~/components/layouts/PlainModal'
import PreviewSurveyModal from '~/components/surveys/PreviewSurveyModal'
import LSelect from '~/components/LSelect'

export default {
  name: 'QuestionList',
  components: {
    LSelect,
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
    this.loadData().then(() => {
      window.setInterval(this.updateQuestionNumbers, 5000)
      this.showPreview = cookies.get('questionPreviewMode') === 'true'
      if (this.survey.flags.includes('OUTDATED_LANGUAGE_PACK'))
        this.$toasted.show(
          'This survey has changed from last language generation. You need to re-generate the languages.'
        )
    })
  },

  methods: {
    loadData() {
      return new Promise((resolve, reject) => {
        const promises = [
          this.$store.dispatch('contactlist/getContactLists', {}),
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
          this.loading = false
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
    showSurveySettings() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveySettings',
        dataItem: this.survey,
      })
        .then((response) => {
          this.$store.dispatch('surveys/updateSurvey', response)
        })
        .catch(() => {})
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
        this.$toasted.show('Contact List branching removed')
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
