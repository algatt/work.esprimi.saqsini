<template>
  <list-layout v-if="!loading">
    <div class="w-full my-3 flex justify-between flex-wrap">
      <div class="w-full md:w-6/12 flex justify-start px-4">Left</div>
      <div class="w-full md:w-6/12 flex justify-start md:justify-end px-4">
        <LPopupMenu>
          <template #icon>
            <l-button>Settings<i class="fas fa-caret-down fa-fw"></i></l-button>
          </template>
          <template v-slot:menu>
            <button @click="showSurveySettings">
              <i class="fas fa-sliders-h fa-fw"></i>Settings
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
            <button @click="showPreview = !showPreview">
              <i class="fas fa-poll-h fa-fw"></i>Toggle View
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
      :original-survey="survey[0]"
      :questions="sortedQuestions"
    ></PreviewSurveyModal>
  </list-layout>
  <div v-else>loading</div>
</template>

<script>
import ListLayout from '~/components/layouts/ListLayout'
import SurveyListQuestion from '~/components/surveys/SurveyListQuestion'
import LPopupMenu from '~/components/LPopupMenu'
import ModalService from '~/services/modal-services'
import PlainModal from '~/components/layouts/PlainModal'
import PreviewSurveyModal from '~/components/surveys/PreviewSurveyModal'

export default {
  name: 'QuestionList',
  components: {
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
      // selectedMenu: '',
      // selectedView: 'questions',
      // showPreview: null,
      // whichSubMenu: null,
      // showMoveMenu: null,
      // error: false,
      // loading: true,
      // cannotDeleteDueToBranching: [],
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    survey() {
      return this.$store.state.surveys.items
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

    // canUseContactBook() {
    //   return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    // },
    // languageText() {
    //   const data = {}
    //   Object.keys(SURVEY_LANGUAGE_GENERIC_TERMS).forEach((el) => {
    //     data[el] = this.survey.translatedText[
    //       SURVEY_LANGUAGE_GENERIC_TERMS[el]
    //     ].text
    //   })
    //   return data
    // },
    // questions() {
    //   return this.$store.getters.getSortedItems('questions').sort((a, b) => {
    //     return a.ordinalPosition > b.ordinalPosition ? 1 : -1
    //   })
    // },
    // questionsWithSections() {
    //   const x = JSON.parse(JSON.stringify(this.questions))
    //   let page = 0
    //   x.forEach((el) => {
    //     if (el.flags.includes('SECTION')) page++
    //     el.page = page
    //   })
    //   return x
    // },
    // questionsNumberOfSections() {
    //   const x = this.questionsWithSections.map((el) => {
    //     return el.page
    //   })
    //   return new Set(x).size
    // },
    // unparsedSurvey() {
    //   return this.$store.getters.getItems('surveys')[0]
    // },
    // survey() {
    //   return parseSurveyToForm(this.unparsedSurvey)
    // },
    //
    // currentItemToBeEdited() {
    //   return this.$store.state.currentItemToBeEdited
    // },
    // questionTypes() {
    //   return QUESTION_TYPES
    // },
  },

  mounted() {
    this.loadQuestions()
    this.$store.dispatch('contactlist/getContactLists', {})
    this.$store.dispatch('surveys/getSurveyByCode', this.$route.params.id)
    window.setInterval(this.updateQuestionNumbers, 5000)
    // await this.updateData()
    // this.showPreview = cookies.get('questionPreviewMode') === 'true'
    // if (this.survey.flags.includes('OUTDATED_LANGUAGE_PACK'))
    //   this.$toasted.show(
    //     'This survey has changed from last language generation. You need to re-generate the languages.'
    //   )
  },

  methods: {
    loadQuestions() {
      this.$store.dispatch('setLoading', true)
      this.$store
        .dispatch('questions/getQuestionsBySurvey', {
          code: this.$route.params.id,
        })
        .then(() => {
          this.$store.dispatch('setLoading', false)
        })
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
        dataItem: this.survey[0],
      }).then((response) => {
        this.$store.dispatch('surveys/updateSurvey', response)
      })
    },
    showLanguageSettings() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyLanguageSettings',
        dataItem: this.survey[0],
        options: {
          close: true,
        },
      })
    },
    showCollaborators() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyCollaborators',
        dataItem: this.survey[0],
        options: {
          close: true,
        },
      })
    },
    showInviteSettings() {
      ModalService.open(PlainModal, {
        whichComponent: 'SurveyInvitesSettings',
        dataItem: this.survey[0],
      }).then((response) => {
        this.$store.dispatch('surveys/updateSurvey', response)
      })
    },

    //   async updateData() {
    //     this.error = false
    //     this.loading = true
    //
    //     try {
    //       if (this.canUseContactBook)
    //         await this.$store.dispatch('contactlist/getContactLists', {
    //           limit: 100,
    //           offset: 0,
    //         })
    //
    //       await this.$store.dispatch(
    //         'surveys/getSurveyByCode',
    //         this.$route.params.id
    //       )
    //
    //       await this.$store.dispatch('questions/getQuestionsBySurvey', {
    //         limit: 1000,
    //         offset: 0,
    //         code: this.$route.params.id,
    //       })
    //
    //       if (
    //         this.canUseContactBook &&
    //         this.getBranchingContactBook().length > 0
    //       ) {
    //         const tempLists = this.$store.getters.getItems('contactlist')
    //         await this.$store.dispatch(
    //           'setContactList',
    //           tempLists.find((el) => {
    //             return el.code === this.getBranchingContactBook()[0]
    //           })
    //         )
    //       }
    //     } catch {
    //       this.error = true
    //     } finally {
    //       this.loading = false
    //     }
    //   },

    //   getQuestionContent(question) {
    //     return parseQuestionToForm(question).text
    //   },
    //   showPreviewToggle() {
    //     this.showPreview = !this.showPreview
    //     cookies.set('questionPreviewMode', this.showPreview)
    //   },
    //   getBranchingContactBook() {
    //     const code = []
    //     for (const i in this.questions) {
    //       const tempQuestion = JSON.parse(this.questions[i].surveyOptions)
    //       if (tempQuestion.branching.rules.length > 0) {
    //         tempQuestion.branching.rules.forEach((rule) => {
    //           rule.ruleList.forEach((ruleList) => {
    //             if (ruleList.contactListCode) {
    //               code.push(ruleList.contactListCode)
    //             }
    //           })
    //         })
    //       }
    //     }
    //     return code
    //   },
    //   clearBranching() {
    //     const promise = new Promise((resolve, reject) => {
    //       this.questions.forEach((question) => {
    //         const obj = JSON.parse(JSON.stringify(question))
    //         const branching = JSON.parse(obj.surveyOptions).branching
    //
    //         if (branching.rules) {
    //           branching.rules.forEach((rule) => {
    //             rule.ruleList = rule.ruleList.filter((el) => {
    //               return !el.contactListCode
    //             })
    //           })
    //
    //           branching.rules = branching.rules.filter((el) => {
    //             return el.ruleList.length > 0
    //           })
    //
    //           branching.rules.forEach((rule) => {
    //             const len = rule.ruleList.length
    //             if (len > 0 && rule.ruleList[len - 1].isAnd)
    //               delete rule.ruleList[len - 1].isAnd
    //           })
    //
    //           if (branching.rules.length > 0) {
    //             delete branching.rules[branching.rules.length - 1].isAnd
    //           }
    //         }
    //
    //         const surveyOptions = JSON.parse(obj.surveyOptions)
    //         surveyOptions.branching = branching
    //         obj.surveyOptions = JSON.stringify(surveyOptions)
    //
    //         this.$store.dispatch('updateItem', {
    //           which: 'questions',
    //           item: obj,
    //         })
    //
    //         if (obj.ordinalPosition === this.questions.length) resolve()
    //       })
    //     })
    //
    //     promise.then(() => {
    //       this.$toasted.show('Contact List branching removed')
    //     })
    //   },
    //   getQuestionsInPage(page) {
    //     return this.questionsWithSections.filter((el) => {
    //       return el.page === page
    //     })
    //   },
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
