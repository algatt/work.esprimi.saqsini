<template>
  <div
    v-if="survey"
    ref="surveyModal"
    class="flex flex-col p-5 bg-white rounded shadow-lg border border-gray-400"
  >
    <div class="flex flex-wrap items-center rounded w-full p-5 relative">
      <img
        :src="`${survey.options.headerImage}`"
        :class="survey.options.headerAlignment"
        style="height: 12rem"
      />

      <div
        class="flex flex-col absolute"
        :class="
          survey.options.headerAlignment === 'mr-auto' ? 'right-0' : 'left-0'
        "
      >
        <h3
          :class="[
            survey.options.headerImage === ''
              ? null
              : 'bg-white bg-opacity-90 rounded-r',
            survey.options.theme.accentText,
          ]"
        >
          {{ languageText['survey_title'] }}
        </h3>

        <l-popup-menu
          v-if="
            survey.flags.includes('HAS_LANGUAGE_PACK_FILE') &&
            !survey.flags.includes('OUTDATED_LANGUAGE_PACK')
          "
          class="mt-2"
          :class="[
            survey.options.headerImage === '' ? null : 'bg-white bg-opacity-90',
            survey.options.theme.accentText,
          ]"
        >
          <template v-slot:icon>
            <span
              class="border-2 px-2 rounded"
              :class="survey.options.theme.borderColour"
            >
              <i class="far fa-flag fa-fw"></i
              ><i class="fas fa-caret-down"></i></span
          ></template>

          <template v-slot:menu>
            <div
              v-for="(language, index) in survey.languages"
              :key="language + index"
            >
              <button
                v-if="language !== currentLanguage"
                class="px-5 py-2 w-full"
                @click="changeLanguage(language)"
              >
                {{ getCountryFromLanguage(language) }}
              </button>
            </div>
          </template></l-popup-menu
        >
      </div>
    </div>
    <div ref="questionsSection" class="w-full flex flex-col">
      <template v-if="started">
        <template v-if="!disqualify">
          <div
            v-for="question in processedQuestions"
            :key="question.code"
            :class="
              question.page === currentPage && question.validity
                ? 'border rounded shadow border-gray-200 mb-5'
                : null
            "
          >
            <display-question
              v-if="question.page === currentPage && question.validity"
              :id="`question${question.code}`"
              :key="`${question.code} ${currentLanguage}`"
              class="rounded border-2 border-transparent transition duration-300"
              :display-style="survey.options.theme"
              :language="currentLanguage"
              :language-text="languageText"
              :question="question"
              :existing-answer="
                getAnswerByQuestionNumber(question.questionNumber)
              "
              @answers="processAnswers($event, question)"
              @clearAnswers="clearAnswers(question)"
            ></display-question></div
        ></template>
        <!--        <template v-else>-->
        <!--          <div class="rounded bg-white shadow p-5">-->
        <!--            Unfortunately, you are uneligible to participate in this survey.-->
        <!--            Thank you for your time.-->
        <!--          </div>-->
        <!--        </template>-->
      </template>

      <template v-else>
        <div class="rounded shadow bg-white">
          <display-question
            :key="`${processedQuestions[0].code} ${currentLanguage}`"
            class="w-full rounded mb-5"
            :display-style="survey.options.theme"
            :language="currentLanguage"
            :language-text="languageText"
            :question="processedQuestions[0]"
          ></display-question>
        </div>
        <div class="flex items-center justify-center">
          <button
            class="w-28 rounded-lg font-semibold"
            :class="survey.options.theme.buttons"
            @click="started = true"
          >
            {{ languageText['start'] }}
          </button>
        </div>
      </template>

      <div v-if="started && !disqualify" class="flex justify-center h-8 mt-5">
        <div class="flex justify-center relative space-x-3">
          <button
            :disabled="!enablePrevious"
            class="w-28 font-semibold rounded-lg"
            :class="survey.options.theme.buttons"
            @click="showPreviousPage"
          >
            {{ languageText['previous'] }}
          </button>

          <button
            v-if="!enableNext"
            class="h-8 flex items-stretch w-28 absolute right-0"
            @click="scrollToUnansweredQuestion"
          ></button>
          <button
            v-if="!isFinalPage"
            :disabled="!enableNext"
            class="w-28 font-semibold rounded-lg"
            :class="survey.options.theme.buttons"
            @click="showNextPage"
          >
            {{ languageText['next'] }}
          </button>

          <button
            v-else
            :disabled="!enableNext"
            class="w-28 font-semibold rounded-lg"
            :class="survey.options.theme.buttons"
            @click="finishSurvey"
          >
            {{ languageText['finish'] }}
          </button>
        </div>

        <!--        <button-->
        <!--          v-if="!enableNext"-->
        <!--          class="absolute top-0 left-0 w-full h-full"-->
        <!--          @click="scrollToUnansweredQuestion()"-->
        <!--        ></button>-->
      </div>
    </div>

    <div class="flex flex-wrap items-center rounded w-full p-5 relative mt-5">
      <img
        :src="`${survey.options.footerImage}`"
        :class="survey.options.footerAlignment"
        style="height: 12rem"
      />
    </div>
  </div>
</template>

<script>
import {
  SURVEY_LANGUAGE_GENERIC_TERMS,
  PREFERRED_LANGUAGE,
} from '@/assets/settings/survey-settings'
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
import { convertSurveyFromApiToForm } from '~/services/survey-helpers'
import LPopupMenu from '~/components/LPopupMenu'

export default {
  name: 'PreviewSurvey',
  components: { LPopupMenu, DisplayQuestion },
  props: {
    originalSurvey: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
    showStart: {
      type: Boolean,
      required: false,
      default: false,
    },
    hasToken: {
      type: Boolean,
      required: false,
      default: false,
    },
    invitation: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
    existingAnswers: {
      type: Array,
      required: false,
      default: () => {
        return []
      },
    },
  },

  data() {
    return {
      answers: [],
      currentPage: 1,
      currentLanguage: PREFERRED_LANGUAGE,
      survey: null,
      started: true,
      disqualify: false,
    }
  },
  computed: {
    invitationFilters() {
      if (Object.keys(this.invitation).length > 0)
        return JSON.parse(this.invitation.filter)
      return {}
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
    enableNext() {
      for (const cnt of this.processedQuestionsCurrentPage) {
        if (!cnt.flags.includes('SECTION'))
          if (
            cnt.validity === true &&
            cnt.flags.includes('IS_MANDATORY') &&
            this.getAnswerByQuestionNumber(cnt.questionNumber).length === 0
          )
            return false
      }
      return true
    },
    requiredQuestionsNotFilled() {
      const which = []
      for (const cnt of this.processedQuestionsCurrentPage) {
        if (!cnt.flags.includes('SECTION'))
          if (
            cnt.validity === true &&
            cnt.flags.includes('IS_MANDATORY') &&
            this.getAnswerByQuestionNumber(cnt.questionNumber).length === 0
          )
            which.push(cnt)
      }
      return which
    },
    enablePrevious() {
      return this.currentPage > 1
    },

    isFinalPage() {
      return (
        this.currentPage ===
        this.processedQuestions
          .map((el) => {
            return el.page
          })
          .reduce((a, b) => {
            return Math.max(a, b)
          })
      )
    },

    processedQuestions() {
      let questions = JSON.parse(JSON.stringify(this.questions))
      questions = questions.sort((a, b) => {
        return a.ordinalPosition > b.ordinalPosition ? 1 : -1
      })
      let page = 0
      questions.forEach((el) => {
        if (el.flags.includes('SECTION')) page++
        el.page = page
        el.validity = this.getConditionState(el.surveyOptions)
      })
      const whichSectionsAreValid = questions
        .filter((el) => {
          return el.flags.includes('SECTION') && el.validity === true
        })
        .map((el) => {
          return el.page
        })
      questions.forEach((el) => {
        if (
          !el.flags.includes('SECTION') &&
          !whichSectionsAreValid.includes(el.page)
        )
          el.validity = false
      })
      return questions
    },
    processedQuestionsCurrentPage() {
      return this.processedQuestions.filter((el) => {
        return el.page === this.currentPage
      })
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
    this.survey = convertSurveyFromApiToForm(
      JSON.parse(JSON.stringify(this.originalSurvey))
    )
    if (this.existingAnswers.length > 0) {
      this.existingAnswers.forEach((el) => {
        this.processAnswers(el.answers, el)
      })
    }

    if (
      this.getConditionState(
        this.processedQuestions[0].surveyOptions,
        'disqualify'
      )
    ) {
      this.disqualify = true
      this.$emit('disqualifySurvey')
    }
  },
  methods: {
    getConditionState(surveyOptions, which = 'branching') {
      const branching = JSON.parse(surveyOptions)
      let rules = {}
      if (which === 'branching') rules = branching.branching.rules
      else rules = branching.disqualify.rules

      if (rules.length !== 0) {
        const rulesOutcome = {}
        let finalOutcome = ''
        for (const rule in rules) {
          rulesOutcome[rule] = ''
          rules[rule].ruleList.forEach((branchingRule) => {
            const operator = Object.prototype.hasOwnProperty.call(
              branchingRule,
              'isAnd'
            )
              ? branchingRule.isAnd === 'true'
                ? ' && '
                : ' || '
              : ''

            // console.log(operator)

            if (branchingRule.questionNumber) {
              const existingAnswers = this.getAnswerByQuestionNumber(
                branchingRule.questionNumber
              ) // all available answers for this question

              let foundAnswer = false
              for (const i in existingAnswers) {
                const temp = branchingRule.options.map((el) => {
                  return { questionOption: el.code, value: el.name }
                })

                const originalQuestion = this.questions.find((el) => {
                  return (
                    String(el.questionNumber) ===
                    String(branchingRule.questionNumber)
                  )
                })

                if (originalQuestion.flags.includes('RADIO_GRID')) {
                  const value = `${existingAnswers[i].questionOption} (${existingAnswers[i].value})`

                  if (
                    temp.find((el) => {
                      return el.questionOption === value
                    })
                  ) {
                    foundAnswer = true
                    break
                  }
                } else if (
                  temp.find((el) => {
                    return el.value === existingAnswers[i].value
                  })
                ) {
                  foundAnswer = true
                  break
                }
              }

              rulesOutcome[rule] += `${foundAnswer}${operator}`
            } else {
              // TODO: when implementing contactbook
              const availableValues = branchingRule.options.map((el) => {
                return el.name
              })

              const invitiationValue = this.invitationFilters[
                branchingRule.filterName
              ]
              rulesOutcome[rule] += `${availableValues.includes(
                invitiationValue
              )}${operator}`
            }
          })

          const operator = Object.prototype.hasOwnProperty.call(
            rules[rule],
            'isAnd'
          )
            ? rules[rule].isAnd === 'true'
              ? ' && '
              : ' || '
            : ''
          finalOutcome += `${this.evaluateBooleanExpression(
            rulesOutcome[rule]
          )}${operator}`
        }

        // if (which === 'disqualify') console.log('disqualify')
        // else console.log('branching')
        // console.log(rulesOutcome)
        //
        // console.log(finalOutcome)
        // console.log(this.evaluateBooleanExpression(finalOutcome))

        return this.evaluateBooleanExpression(finalOutcome)
      }

      return which !== 'disqualify'
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
        const surveyOptions = JSON.parse(question.surveyOptions)
        if (answers.length < surveyOptions.maxChoice) {
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

      const whichSectionsAreValid = this.processedQuestions
        .filter((el) => {
          return el.validity === true
        })
        .map((el) => {
          return el.code
        })

      this.answers = this.answers.filter((el) => {
        return whichSectionsAreValid.includes(el.code)
      })

      if (this.hasToken) this.$emit('changedAnswers', this.answers)
    },
    showPreviousPage() {
      const whichPage = this.processedQuestions
        .filter((el) => {
          return (
            el.page < this.currentPage &&
            el.flags.includes('SECTION') &&
            el.validity === true
          )
        })
        .map((el) => {
          return el.page
        })
        .reduce((a, b) => {
          return Math.max(a, b)
        })
      this.currentPage = whichPage
      this.$refs.surveyModal.scrollIntoView()
    },
    showNextPage() {
      const whichPage = this.processedQuestions
        .filter((el) => {
          return (
            el.page > this.currentPage &&
            el.flags.includes('SECTION') &&
            el.validity === true
          )
        })
        .map((el) => {
          return el.page
        })
        .reduce((a, b) => {
          return Math.min(a, b)
        })

      const question = this.processedQuestions.find((el) => {
        return el.page === whichPage && el.flags.includes('SECTION')
      })

      // console.log(this.getConditionState(question.surveyOptions, 'disqualify'))

      if (this.getConditionState(question.surveyOptions, 'disqualify')) {
        this.disqualify = true
        this.$emit('disqualifySurvey')
      } else this.currentPage = whichPage

      this.$refs.surveyModal.scrollIntoView()
    },
    finishSurvey() {
      this.$emit('finishSurvey')
    },
    getAnswerByQuestionNumber(questionNumber) {
      const code = this.questions.find((el) => {
        return String(el.questionNumber) === String(questionNumber)
      }).code
      const x = this.answers.find((el) => {
        return el.code === code
      })
      return x && x.answers ? x.answers : []
    },
    changeLanguage(language) {
      this.currentLanguage = language
      this.survey = convertSurveyFromApiToForm(this.originalSurvey, language)
    },
    getCountryFromLanguage(code) {
      const CountryLanguage = require('country-language')

      const x = CountryLanguage.getLanguage(code).nativeName[0]
      return x.substring(0, 1).toUpperCase() + x.substring(1, x.length)
    },
    scrollToUnansweredQuestion() {
      const whichQuestion = this.requiredQuestionsNotFilled[0].code
      const question = document.getElementById(`question${whichQuestion}`)
      question.scrollIntoView({ behavior: 'smooth' })
      question.classList.toggle('required-question')
      setTimeout(() => {
        question.classList.toggle('required-question')
      }, 4000)
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

.required-question {
  @apply border-red-400 transition duration-300;
}
</style>
