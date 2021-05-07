<template>
  <list-layout v-if="!loading">
    <div class="w-full my-3 flex justify-between flex-wrap">
      <div class="w-full md:w-6/12 flex justify-start">Left</div>
      <div class="w-full md:w-6/12 flex justify-start md:justify-end">
        Right
      </div>
    </div>
    <div
      v-for="page in parsedQuestionsSection"
      :key="page.code"
      class="border-2 border-gray-200 rounded shadow-sm mb-5 w-full md:w-7/12 mx-auto bg-gray-50"
    >
      <div class="flex flex-col">
        <div class="flex justify-center mt-3">
          <h6>
            {{ page.name }}
          </h6>
        </div>
        <div
          class="question-item transition-all duration-300 h-3 border-b-2 border-gray-200"
          :class="dragging ? 'bg-gray-100' : 'bg-gray-50'"
          @drop.stop="onDropQuestion($event, page)"
          @dragenter.prevent.stop
          @dragover.prevent.stop="overDrag($event, page)"
          @dragleave.prevent.stop="leaveDrag($event, page)"
        ></div>
      </div>

      <div
        v-for="question in getQuestionsForSection(page)"
        :key="question.code"
        class="bg-white flex flex-col cursor-pointer border-b border-gray-200"
        @mouseenter="beingHovered = question"
        @mouseleave="beingHovered = null"
      >
        <div
          class="flex flex-col px-4 py-6"
          draggable="true"
          @dragstart="startDrag($event, question)"
          @dragend.prevent="dragging = null"
          @dragenter.prevent
        >
          <div class="flex">
            <span class="font-bold font-lg mr-2 text-blue-600">{{
              question.questionNumber
            }}</span>
            <span>{{ question.name }}</span>
          </div>
        </div>
        <div
          class="question-item transition-all duration-100 flex justify-center"
          :class="[
            dragging ? 'bg-gray-100' : 'bg-white',
            beingHovered && !dragging && beingHovered.code === question.code
              ? 'h-10'
              : 'h-3',
          ]"
          @drop.stop="onDropQuestion($event, question)"
          @dragover.prevent="overDrag($event, question)"
          @dragleave.prevent="leaveDrag($event, question)"
        >
          <transition name="fade">
            <LPopupMenu
              v-if="
                beingHovered && !dragging && beingHovered.code === question.code
              "
            >
              <template v-slot:icon
                ><LButtonCircle><i class="fas fa-plus fa-fw"></i></LButtonCircle
              ></template>
              <template v-slot:menu>
                <button v-for="button in QUESTION_TYPES" :key="button.code">
                  <i :class="button.icon"></i>{{ button.text }}
                </button>
              </template></LPopupMenu
            ></transition
          >
        </div>
      </div>
    </div>
  </list-layout>
  <div v-else>loading</div>
</template>

<script>
import ListLayout from '~/components/layouts/ListLayout'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import LButtonCircle from '~/components/elements/LButtonCircle'

export default {
  name: 'QuestionList',
  components: { LButtonCircle, ListLayout },
  middleware: ['surveyBuilder'],

  data() {
    return {
      dragging: null,
      beingHovered: null,
      QUESTION_TYPES,

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
    parsedQuestionsSection() {
      return this.sortedQuestions.filter((el) => {
        return el.flags.includes('SECTION')
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
    overDrag(event) {
      if (
        event.target.classList &&
        event.target.classList.contains('question-item')
      )
        event.target.classList.add('over-drag')
    },
    leaveDrag(event) {
      if (
        event.target.classList &&
        event.target.classList.contains('question-item')
      )
        event.target.classList.remove('over-drag')
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
      this.dragging = item
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      event.dataTransfer.setData('question', JSON.stringify(item))
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
      this.leaveDrag(event)

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
    //   newQuestion(flag, ordinalPosition) {
    //     this.$store.dispatch('setCurrentItemToBeEdited', {
    //       code: -1,
    //       questionNumber: this.getMaxQuestionNumber(),
    //       surveyCode: Number(this.$route.params.id),
    //       flags: [flag],
    //       ordinalPosition,
    //       surveyOptions: JSON.stringify({}),
    //     })
    //   },
    //   getMaxQuestionNumber() {
    //     let max = null
    //     this.questions.forEach((el) => {
    //       if (Number(el.questionNumber)) {
    //         if (!max) max = Number(el.questionNumber)
    //         else if (max < Number(el.questionNumber))
    //           max = Number(el.questionNumber)
    //       }
    //     })
    //     return max + 1
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
.over-drag {
  @apply bg-gray-200 transition duration-100;
}

.fade-enter-active {
  transition: opacity 1s;
}

.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.bigScreenPopup #bigScreenPopupChild {
  @apply opacity-0 transition-all duration-300;
}
.bigScreenPopup:hover #bigScreenPopupChild {
  @apply opacity-100 ease-in transition-all duration-300 h-10;
}
</style>
