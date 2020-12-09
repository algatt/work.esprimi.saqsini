<template>
  <div
    ref="surveyModal"
    :style="{ backgroundColor: survey.options.backgroundColour }"
  >
    <div
      class="h-48 bg-cover flex items-center"
      :style="{
        backgroundColor: survey.options.accentColour,
        backgroundImage: 'url(' + survey.options.headerImage + ')',
      }"
    >
      <p
        class="px-5 text-5xl font-bold tracking-wider py-3 shadow"
        :style="{
          color: survey.options.accentColour,
          backgroundColor: survey.options.backgroundColour,
        }"
      >
        {{ survey.name }}
      </p>
    </div>
    <div ref="questionsSection" class="h-full">
      <div
        v-for="question in questionsWithSectionsFiltered"
        :key="question.code"
        class="mb-16 p-6"
      >
        <display-question
          :question="question"
          @answers="processAnswers($event, question)"
        ></display-question>
      </div>
      <div class="flex items-center justify-center space-x-3 mb-5">
        <button
          v-if="enablePrevious"
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
          @click="showPreviousPage"
        >
          <i class="fas fa-chevron-circle-left fa-fw fa-sm mr-2"> </i>Previous
        </button>
        <button
          v-else
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
        >
          <i class="fas fa-ban fa-fw fa-sm mr-2"></i>Previous
        </button>
        <button
          v-if="!isFinalPage && enableNext"
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
          @click="showNextPage"
        >
          Next <i class="fas fa-chevron-circle-right fa-fw fa-sm ml-2"></i>
        </button>
        <button
          v-if="!isFinalPage && !enableNext"
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
        >
          Next <i class="fas fa-ban fa-fw fa-sm ml-2"></i>
        </button>
        <button
          v-if="isFinalPage && enableNext"
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
          :disabled="!enableNext"
          @click="finishSurvey"
        >
          Finish <i class="fas fa-flag-checkered fa-sm fa-fw ml-2"></i>
        </button>
        <button
          v-if="isFinalPage && !enableNext"
          class="w-28 focus:outline-none py-1 px-3 rounded font-bold flex flex-wrap items-center justify-center"
          :style="{
            backgroundColor: survey.options.accentColour,
            color: survey.options.backgroundColour,
          }"
        >
          Finish <i class="fas fa-ban fa-fw fa-sm ml-2"></i>
        </button>
      </div>
    </div>
    <div
      class="h-48 bg-cover"
      :style="{
        backgroundColor: survey.options.accentColour,
        backgroundImage: 'url(' + survey.options.footerImage + ')',
      }"
    ></div>
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
