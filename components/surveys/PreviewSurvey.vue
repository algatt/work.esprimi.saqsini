<template>
  <div
    ref="surveyModal"
    :style="{ backgroundColor: survey.options.accentColour }"
    class="flex flex-col p-5 h-full w-full rounded overflow-y-auto"
  >
    <div class="absolute" style="top: 5px; right: 5px">
      <button class="btn-link-rounded" @click="finishSurvey">
        <i class="fas fa-times fa-fw fa-3xl text-gray-800"></i>
      </button>
    </div>
    <div
      class="h-32 bg-cover flex flex-wrap items-center rounded w-full mb-5"
      :style="{
        backgroundColor: survey.options.backgroundColour,
        backgroundImage: 'url(' + survey.options.headerImage + ')',
      }"
    >
      <div class="w-full h-32 flex justify-between items-center">
        <h3
          class="px-5 py-3"
          :class="survey.options.headerImage === '' ? null : 'frosted-area'"
          :style="{
            color:
              survey.options.headerImage === ''
                ? survey.options.textColour
                : survey.options.backgroundColour,
          }"
        >
          {{ survey.name }}
        </h3>

        <popup-menu-vue
          class="px-5 py-3"
          :class="survey.options.headerImage === '' ? null : 'frosted-area'"
          :style="{
            color: survey.options.textColour,
          }"
          ><template v-slot:menuButton
            ><span class="px-1"
              ><language-flag
                :iso="currentLanguage"
                :squared="false"
              ></language-flag></span
          ></template>

          <template v-slot:menuItems
            ><div
              v-for="(language, index) in survey.languages"
              :key="language + index"
            >
              <button
                v-if="language !== currentLanguage"
                :style="{ backgroundColor: survey.options.backgroundColour }"
                @click="currentLanguage = language"
              >
                <language-flag :iso="language" :squared="false"></language-flag>
              </button></div></template
        ></popup-menu-vue>
      </div>
    </div>
    <div ref="questionsSection" class="w-full">
      <div
        v-for="question in questionsWithSectionsFiltered"
        :key="question.code"
        class="mb-5"
      >
        <display-question
          class="rounded shadow-lg"
          :style="{ backgroundColor: survey.options.backgroundColour }"
          :language="currentLanguage"
          :question="question"
          :existing-answer="getAnswer(question.code)"
          @answers="processAnswers($event, question)"
        ></display-question>
      </div>
      <div class="flex items-center justify-center space-x-3 my-5">
        <button
          :disabled="!enablePrevious"
          class="w-28 focus:outline-none py-1.5 px-3 rounded font-bold flex flex-wrap items-center justify-center shadow"
          :class="
            survey.options.backgroundColour === '#000000'
              ? 'disabled:bg-gray-700'
              : 'disabled:bg-gray-200'
          "
          :style="
            !enablePrevious
              ? {
                  // color: survey.options.backgroundColour,
                  color: '#666666',
                  cursor: 'not-allowed',
                }
              : {
                  backgroundColor: survey.options.backgroundColour,
                  color: survey.options.accentColour,
                }
          "
          @click="showPreviousPage"
        >
          <i class="fas fa-backward fa-fw py-1"></i>
        </button>

        <button
          v-if="!isFinalPage"
          :disabled="!enableNext"
          class="w-28 focus:outline-none py-1.5 px-3 rounded font-bold flex flex-wrap items-center justify-center shadow"
          :class="
            survey.options.backgroundColour === '#000000'
              ? 'disabled:bg-gray-700'
              : 'disabled:bg-gray-200'
          "
          :style="
            !enableNext
              ? {
                  color: '#666666',
                  cursor: 'not-allowed',
                }
              : {
                  backgroundColor: survey.options.backgroundColour,
                  color: survey.options.accentColour,
                }
          "
          @click="showNextPage"
        >
          <i class="fas fa-forward fa-fw py-1"></i>
        </button>

        <button
          v-else
          :disabled="!enableNext"
          class="w-28 focus:outline-none py-1.5 px-3 rounded font-bold flex flex-wrap items-center justify-center shadow"
          :class="
            survey.options.backgroundColour === '#000000'
              ? 'disabled:bg-gray-700'
              : 'disabled:bg-gray-200'
          "
          :style="
            !enableNext
              ? {
                  color: '#666666',
                  cursor: 'not-allowed',
                }
              : {
                  backgroundColor: survey.options.backgroundColour,
                  color: survey.options.accentColour,
                }
          "
          @click="finishSurvey"
        >
          <i class="fas fa-check-circle fa-fw py-1"></i>
        </button>
      </div>
    </div>
    <div
      v-if="survey.options.footerImage !== ''"
      class="w-full h-32 bg-cover flex flex-wrap items-center rounded"
      :style="{
        backgroundColor: survey.options.backgroundColour,
        backgroundImage: 'url(' + survey.options.footerImage + ')',
      }"
    ></div>
  </div>
</template>

<script>
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
import LanguageFlag from '~/components/layouts/LanguageFlag'
import PopupMenuVue from '~/components/layouts/PopupMenu'
export default {
  name: 'PreviewSurvey',
  components: { PopupMenuVue, DisplayQuestion, LanguageFlag },
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
      currentLanguage: 'en',
    }
  },
  computed: {
    enableNext() {
      for (const cnt of this.questionsWithSectionsFiltered) {
        if (cnt.flags.includes('IS_MANDATORY') && !this.getAnswer(cnt.code))
          return false
      }
      return true
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
    getAnswer(code) {
      const x = this.answers.find((el) => {
        return el.code === code
      })
      return x && x.answers ? x.answers : null
    },
  },
}
</script>

<style scoped>
.frosted-area {
  background: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
</style>
