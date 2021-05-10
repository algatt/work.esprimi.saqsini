<template>
  <list-layout v-if="!loading">
    <div class="w-full my-3 flex justify-between flex-wrap">
      <div class="w-full md:w-6/12 flex justify-start">Left</div>
      <div class="w-full md:w-6/12 flex justify-start md:justify-end">
        Right
      </div>
    </div>

    <div class="w-full md:w-8/12 flex flex-col mx-auto">
      <survey-list-page-element
        v-for="section in sectionQuestions"
        :key="section.code"
        :section="section"
        :max-number="getMaxQuestionNumber"
        @dragover.prevent="onDropQuestion($event, section)"
      >
        <survey-list-question-element
          v-for="question in getQuestionsForSection(section)"
          :key="question.code"
          :question="question"
          :max-number="getMaxQuestionNumber"
          @dragstart="startDrag($event, question)"
          @dragend="endDrag($event, question)"
          @dragleave="endDrag($event, question)"
          @dragover.prevent.stop="onDropQuestion($event, question)"
        ></survey-list-question-element>
      </survey-list-page-element>
    </div>
  </list-layout>
  <div v-else>loading</div>
</template>

<script>
import ListLayout from '~/components/layouts/ListLayout'
import SurveyListPageElement from '~/components/surveys/SurveyListPageElement'
import SurveyListQuestionElement from '~/components/surveys/SurveyListQuestionElement'

export default {
  name: 'QuestionList',
  components: {
    SurveyListQuestionElement,
    SurveyListPageElement,
    ListLayout,
  },
  middleware: ['surveyBuilder'],
  layout: 'authlayout',

  data() {
    return {
      dragging: null,
      beingHovered: null,

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
    getQuestionPositions() {
      return this.sortedQuestions.map((el) => {
        return { question: el.code, position: el.ordinalPosition }
      })
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
  watch: {
    // working on
  },
  mounted() {
    window.addEventListener('dragover', this.checkPosition)
    this.loadQuestions()
    // await this.updateData()
    // this.showPreview = cookies.get('questionPreviewMode') === 'true'
    // if (this.survey.flags.includes('OUTDATED_LANGUAGE_PACK'))
    //   this.$toasted.show(
    //     'This survey has changed from last language generation. You need to re-generate the languages.'
    //   )
  },
  beforeDestroy() {
    window.removeEventListener('dragover', this.checkPosition)
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
    checkPosition(e) {
      if (e.y > window.innerHeight - 100)
        window.window.scrollBy({
          top: 50,
          left: 0,
          behavior: 'smooth',
        })
      if (e.y < 100)
        window.window.scrollBy({
          top: -50,
          left: 0,
          behavior: 'smooth',
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
    startDrag(event, item) {
      event.target.classList.add('dragging')
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('question', JSON.stringify(item))
    },
    endDrag(event) {
      event.target.classList.remove('dragging')
    },

    onDropQuestion(event, question) {
      const movedQuestion = JSON.parse(event.dataTransfer.getData('question'))

      let questions = JSON.parse(JSON.stringify(this.sortedQuestions))

      questions.find((el) => {
        return el.code === movedQuestion.code
      }).ordinalPosition = question.ordinalPosition + 0.5

      questions = questions.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })

      for (let i = 0; i < questions.length; i++)
        questions[i].ordinalPosition = i + 1

      this.$store.dispatch('questions/setQuestions', questions)

      this.dragging = null
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

    //   editQuestion(question) {
    //     this.$store.dispatch('setCurrentItemToBeEdited', question)
    //   },
    //   moveQuestion(question) {
    //     this.showMoveMenu = question
    //   },
    //   deleteQuestion(question) {
    //     this.cannotDeleteDueToBranching = []
    //     this.questions.forEach((el) => {
    //       const branching = JSON.parse(el.surveyOptions)
    //       branching.branching.rules.forEach((rule) => {
    //         rule.ruleList.forEach((rl) => {
    //           if (String(rl.questionNumber) === String(question.questionNumber)) {
    //             if (
    //               !this.cannotDeleteDueToBranching.find((findQuestion) => {
    //                 return (
    //                   String(findQuestion.questionNumber) ===
    //                   String(rl.questionNumber)
    //                 )
    //               })
    //             )
    //               this.cannotDeleteDueToBranching.push({
    //                 questionNumber: el.questionNumber,
    //                 name: el.name,
    //               })
    //           }
    //         })
    //       })
    //     })
    //
    //     if (this.cannotDeleteDueToBranching.length === 0)
    //       this.$store.dispatch('questions/deleteQuestion', question.code)
    //   },
    //   chooseQuestion(question) {
    //     this.$store.dispatch('setCurrentItemToBeEdited', question)
    //   },
    //   selectMenu(code) {
    //     this.$store.dispatch('setCurrentItemToBeEdited', this.survey)
    //     this.selectedMenu = code
    //   },
    //   changeSubMenu(code) {
    //     this.whichSubMenu = code
    //   },
    //   questionTypeText(question) {
    //     return QUESTION_TYPES[getQuestionType(question)].text
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
.dragging {
  @apply opacity-50;
}

.bigScreenPopup #bigScreenPopupChild {
  @apply opacity-0 transition-all duration-300;
}
.bigScreenPopup:hover #bigScreenPopupChild {
  @apply opacity-100 ease-in transition-all duration-300 h-10;
}
</style>
