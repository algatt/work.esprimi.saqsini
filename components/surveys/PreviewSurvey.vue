<template>
  <div v-if="!loading" ref="surveyModal" class="flex flex-col p-5 h-full">
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
          {{ languageText['survey_title'] }}
        </h3>

        <popup-menu-vue
          v-if="
            !survey.flags.includes('OUTDATED_LANGUAGE_PACK') ||
            survey.flags.includes('HAS_LANGUAGE_PACK')
          "
          class="px-5 py-3"
          :class="survey.options.headerImage === '' ? null : 'frosted-area'"
          :style="{
            color: survey.options.textColour,
          }"
        >
          <template v-slot:menuButton
            ><span class="px-1"><i class="fas fa-globe fa-fw fa-lg"></i></span
          ></template>

          <template v-slot:menuItems>
            <div
              v-for="(language, index) in survey.languages"
              :key="language + index"
            >
              <button
                v-if="language !== currentLanguage"
                :style="{ backgroundColor: survey.options.backgroundColour }"
                class="px-5 py-2"
                @click="changeLanguage(language)"
              >
                <language-flag
                  v-if="false"
                  :iso="language"
                  :squared="false"
                ></language-flag>
                {{ getCountryFromLanguage(language) }}
              </button>
            </div>
          </template></popup-menu-vue
        >
      </div>
    </div>
    <div ref="questionsSection" class="w-full">
      <div
        v-for="question in questionsWithSectionsFiltered"
        :key="question.code"
        class="mb-5"
      >
        <display-question
          :key="question.code"
          class="rounded shadow-lg"
          :style="{ backgroundColor: survey.options.backgroundColour }"
          :language="currentLanguage"
          :language-text="languageText"
          :question="question"
          :existing-answer="getAnswer(question.code)"
          @answers="processAnswers($event, question)"
          @clearAnswers="clearAnswers(question)"
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
          {{ languageText['previous'] }}
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
          {{ languageText['next'] }}
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
          {{ languageText['finish'] }}
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
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import { SURVEY_LANGUAGE_GENERIC_TERMS } from '~/helpers/constants'

export default {
  name: 'PreviewSurvey',
  components: { PopupMenuVue, DisplayQuestion, LanguageFlag },
  props: {
    surveyProp: {
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
      originalSurvey: null,
      survey: null,
      loading: true,
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
    enableNext() {
      for (const cnt of this.questionsWithSectionsFiltered) {
        if (
          cnt.flags.includes('IS_MANDATORY') &&
          this.getAnswer(cnt.code).length === 0
        )
          return false
      }
      return true
    },
    enablePrevious() {
      return this.currentPage > 1
    },
    totalPages() {
      let pages = this.questionsWithSections.map((el) => {
        return el.page
      })
      pages = Math.max(...pages)
      return pages
    },
    isFinalPage() {
      return this.totalPages === this.currentPage
    },
    questionsWithSections() {
      let x = JSON.parse(JSON.stringify(this.questions))
      x = x.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
      let page = 0
      x.forEach((el) => {
        if (el.flags.includes('SECTION')) page++
        el.page = page
      })
      return x
    },
    questionsWithSectionsFiltered() {
      const questionsOnThisPage = this.questionsWithSections.filter((el) => {
        return el.page === this.currentPage
      })

      const finalResult = []
      questionsOnThisPage.forEach((el) => {
        if (this.getConditionState(el.surveyOptions)) finalResult.push(el)
      })

      return finalResult
    },
  },
  watch: {
    answers: {
      handler() {
        this.$emit('answers', this.answers)
      },
      deep: true,
    },
  },
  mounted() {
    this.$store
      .dispatch('surveys/getSurveyByCode', this.surveyProp.code)
      .then((response) => {
        this.originalSurvey = response
        this.survey = parseSurveyToForm(this.originalSurvey)
        this.loading = false
      })
  },
  methods: {
    getConditionState2(surveyOptions) {
      let branching = JSON.parse(surveyOptions)
      branching = branching.branching

      if (branching.rules.length !== 0) {
        const matching = {
          true: 0,
          false: 0,
        }
        branching.rules.forEach((iter) => {
          if (iter.type === 'question') {
            const answer = this.getAnswer(iter.parentObject.code)

            if (answer.length === 0) matching.false++
            let matchAtLeastOne = 0
            answer.forEach((eachAnswer) => {
              iter.condition.forEach((eachCondition) => {
                // matching[eachAnswer === eachCondition]++
                if (eachAnswer === eachCondition) matchAtLeastOne++
              })
            })
            matching[matchAtLeastOne > 0]++
          }
        })

        // if (branching.anyAreMet === true) {
        //   if (matching.true > 0 && matching.false === 0) {
        //     // finalResult.push(el)
        //     return true
        //   }
        // } else if (branching.anyAreMet === false) {
        //   if (matching.true > 0) {
        //     // finalResult.push(el)
        //     return true
        //   }
        // }
      } else {
        // finalResult.push(el)
        return true
      }
      return false
    },
    getConditionState(surveyOptions) {
      const branching = JSON.parse(surveyOptions)
      const rules = branching.branching.rules

      if (rules.length !== 0) {
        const rulesOutcome = {}
        let finalOutcome = ''
        for (const rule in rules) {
          rulesOutcome[rule] = ''
          rules[rule].questions.forEach((question) => {
            const operator = Object.prototype.hasOwnProperty.call(
              question,
              'isAnd'
            )
              ? question.isAnd
                ? ' && '
                : ' || '
              : ''
            if (question.code) {
              const existingAnswers = this.getAnswer(question.code)
              let foundAnswer = false
              for (const i in existingAnswers) {
                const temp = question.options.map((el) => {
                  return el.code
                })

                if (temp.includes(existingAnswers[i].code)) {
                  foundAnswer = true
                  break
                }
              }

              rulesOutcome[rule] += `${foundAnswer}${operator}`
            } else {
              // TODO: when implementing contactbook
              rulesOutcome[rule] += `${true}${operator}`
            }
          })
          const operator = Object.prototype.hasOwnProperty.call(
            rules[rule],
            'isAnd'
          )
            ? rules[rule].isAnd
              ? ' && '
              : ' || '
            : ''
          finalOutcome += `${this.evaluateBooleanExpression(
            rulesOutcome[rule]
          )}${operator}`
        }
        // console.log(rulesOutcome)
        //
        // console.log(finalOutcome)
        // console.log(this.evaluateBooleanExpression(finalOutcome))
        return this.evaluateBooleanExpression(finalOutcome)
      }
      return true
    },
    evaluateBooleanExpression(obj) {
      // eslint-disable-next-line no-new-func
      return Function('"use strict";return (' + obj + ')')()
    },
    clearAnswers(question) {
      this.answers = this.answers.filter((el) => {
        return el.code !== question.code
      })
    },
    processAnswers(answers, question) {
      if (question.flags.includes('RANKING')) {
        if (answers.length !== question.options.length) {
          this.answers = this.answers.filter((el) => {
            return el.code !== question.code
          })
          return
        }
      }

      if (question.flags.includes('RADIO_GRID')) {
        const totalAnswersRequired = question.options.filter((el) => {
          return el.flags.includes('ROW')
        }).length
        if (answers.length !== totalAnswersRequired) {
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
        questionType: question.flags,
        answers,
        page: this.currentPage,
      })
    },
    showPreviousPage() {
      this.currentPage--
      this.$refs.surveyModal.scrollIntoView()
    },
    showNextPage() {
      let currentPage = this.currentPage + 1

      while (currentPage <= this.totalPages) {
        const x = this.questionsWithSections.filter((el) => {
          return el.page === currentPage
        })
        if (this.getConditionState(x[0].surveyOptions)) {
          this.currentPage = currentPage
          break
        }
        currentPage++
      }

      this.$refs.surveyModal.scrollIntoView()
    },
    finishSurvey() {
      this.$emit('finishSurvey')
    },
    getAnswer(code) {
      const x = this.answers.find((el) => {
        return el.code === code
      })
      return x && x.answers ? x.answers : []
    },
    changeLanguage(language) {
      this.currentLanguage = language
      this.survey = parseSurveyToForm(this.originalSurvey, language)
    },
    getCountryFromLanguage(code) {
      const CountryLanguage = require('country-language')

      const x = CountryLanguage.getLanguage(code).nativeName[0]
      return x.substring(0, 1).toUpperCase() + x.substring(1, x.length)
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
