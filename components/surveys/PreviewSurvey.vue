<template>
  <div ref="surveyModal">
    <div
      class="relative"
      :style="`backgroundColor: ${survey.options.accentColour}`"
    >
      <img :src="survey.options.headerImage" class="h-48 w-full object-cover" />
    </div>
    <div ref="questionsSection" class="h-full">
      <div
        v-for="question in questionsWithSectionsFiltered"
        :key="question.code"
        class="mb-16 p-6"
      >
        {{ question.page }}
        <display-question
          :question="question"
          @answers="processAnswers($event, question)"
        ></display-question>
      </div>
      <div class="flex items-center justify-center space-x-3 mb-5">
        <button
          class="btn-primary w-20"
          :disabled="!enablePrevious"
          @click="showPreviousPage"
        >
          Previous
        </button>
        <button
          v-if="!isFinalPage"
          class="btn-primary w-20"
          :disabled="!enableNext"
          @click="showNextPage"
        >
          Next
        </button>
        <button
          v-if="isFinalPage"
          class="btn-primary w-20"
          :disabled="!enableNext"
          @click="finishSurvey"
        >
          Finish
        </button>
      </div>
    </div>
    <div
      class="relative"
      :style="`backgroundColor: ${survey.options.accentColour}`"
    >
      <img :src="survey.options.footerImage" class="h-48 w-full object-cover" />
    </div>
  </div>
</template>

<script>
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
export default {
  name: 'PreviewSurvey',
  components: { DisplayQuestion },
  props: {
    survey: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },

  data() {
    return {
      answers: [],
      currentPage: 1,
    }
  },
  computed: {
    enableNext() {
      const currentAnswersInThisPage = this.answers.filter((el) => {
        return el.page === this.currentPage
      }).length

      const currentQuestionsInThisPage = this.questionsWithSectionsFiltered.filter(
        (el) => {
          return !el.flags.includes('SECTION')
        }
      ).length

      return currentAnswersInThisPage === currentQuestionsInThisPage
    },
    enablePrevious() {
      return this.currentPage > 1
    },
    isFinalPage() {
      let pages = this.questionsWithSections.map((el) => {
        return el.page
      })
      pages = Math.max(...pages)
      return pages === this.currentPage
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
    questionsWithSectionsFiltered() {
      return this.questionsWithSections.filter((el) => {
        return el.page === this.currentPage
      })
    },
  },
  created() {},
  methods: {
    processAnswers(answers, question) {
      if (question.flags.includes('RANKING')) {
        if (answers.length !== question.options.length) {
          this.answers = this.answers.filter((el) => {
            return el.code !== question.code
          })
          return
        }
      }

      if (answers[0] === '' || answers.length === 0) {
        this.answers = this.answers.filter((el) => {
          return el.code !== question.code
        })
        return
      }

      this.answers = this.answers.filter((el) => {
        return el.code !== question.code
      })
      this.answers.push({
        code: question.code,
        answers,
        page: this.currentPage,
      })
    },
    showPreviousPage() {
      this.currentPage--
      this.$refs.surveyModal.scrollIntoView()
    },
    showNextPage() {
      this.currentPage++
      this.$refs.surveyModal.scrollIntoView()
    },
    finishSurvey() {
      this.$emit('finishSurvey')
    },
  },
}
</script>

<style scoped></style>
