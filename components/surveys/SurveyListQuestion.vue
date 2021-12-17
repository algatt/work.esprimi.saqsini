<template>
  <div>
    <div
      v-if="getQuestionType(question) !== 'Page'"
      class="flex flex-col bg-white rounded border-t border-b"
    >
      <div class="flex flex-wrap">
        <div
          class="flex flex-1 flex-col items-start pl-4 py-4 space-y-2"
          style="max-width: calc(100% - 6rem)"
        >
          <h6>
            <span>{{ question.questionNumber }} - {{ question.name }}</span>
          </h6>
          <div class="flex flex-wrap space-x-2">
            <l-badge>{{ getQuestionType(question) }}</l-badge>
            <div @click="showBranching = question.code">
              <l-badge
                v-if="hasBranching"
                class="hover:bg-gray-300 cursor-pointer"
                >Branching</l-badge
              >
            </div>
          </div>
          <div
            v-if="showBranching === question.code"
            class="flex flex-col bg-gray-100 border border-gray-200 rounded w-full p-3 2xl:relative"
          >
            <button
              class="absolute top-1 right-2 text-gray-300 hover:text-gray-500"
              @click="showBranching = null"
            >
              <i class="fas fa-times fa-fw"></i>
            </button>
            <div
              v-for="(item, indexBranch) in getBranchingDetails(question)"
              :key="indexBranch"
            >
              <div v-for="(rule, ruleIndex) in item.ruleList" :key="ruleIndex">
                <span class="font-bold"
                  >Question Number {{ rule.questionNumber }}</span
                ><span>&nbsp;must be one of the following</span>
                <div class="flex flex-wrap space-x-2 px-2 my-2">
                  <span
                    v-for="(option, optionIndex) in rule.options"
                    :key="optionIndex"
                    class="bg-gray-50 rounded border border-gray-200 px-2 py-0.5"
                  >
                    {{ option.name }}
                  </span>
                </div>
              </div>
              <div v-if="item.isAnd" class="my-3">
                <span v-if="item.isAnd === 'false'">or</span
                ><span v-else>and</span>
              </div>
            </div>
          </div>

          <div class="overflow-x-auto w-full">
            <display-question
              v-if="showPreview"
              :question="question"
            ></display-question>
          </div>
        </div>

        <div class="flex w-24 justify-end space-x-2 pr-3 pt-5 items-start">
          <button
            class="text-gray-300 hover:text-blue-500 transition duration-300"
            @click="editQuestion(question)"
          >
            <i class="fas fa-edit fa-fw"></i>
          </button>
          <button
            class="text-gray-300 hover:text-blue-500 transition duration-300"
            @click="moveQuestion(question)"
          >
            <i class="fas fa-arrows-alt fa-fw"></i>
          </button>
          <button
            class="text-gray-300 hover:text-red-500 transition duration-300"
            @click="deleteQuestion(question)"
          >
            <i class="fas fa-trash-alt fa-fw"></i>
          </button>
        </div>
      </div>
      <div class="flex justify-center py-3">
        <LPopupMenu>
          <template v-slot:icon
            ><button class="new-button">
              <i class="fas fa-plus fa-fw"></i></button
          ></template>
          <template v-slot:menu>
            <button
              v-for="button in QUESTION_TYPES"
              :key="button.code"
              @click="newQuestion(button.flag, question.ordinalPosition)"
            >
              <i :class="button.icon"></i>{{ button.text }}
            </button>
            <button @click="newQuestionFromTemplate(question.ordinalPosition)">
              <i class="fas fa-question fa-fw"></i>From Template
            </button>
          </template></LPopupMenu
        >
      </div>
    </div>
    <div
      v-else
      class="container rounded shadow flex flex-col border pt-4 mb-4"
      :class="{ 'bg-white': !showPreview }"
    >
      <div class="flex flex-wrap">
        <div class="flex flex-1 flex-col space-y-2 pl-4">
          <h5 class="text-blue-600 font-bold">
            <span>{{ question.questionNumber }} - {{ question.name }}</span>
          </h5>
          <div class="flex flex-wrap space-x-2">
            <div @click="showBranching = question.code">
              <l-badge
                v-if="hasBranching"
                class="hover:bg-gray-300 cursor-pointer"
                >Branching</l-badge
              >
            </div>
            <l-badge v-if="hasDisqualify">Disqualify</l-badge>
          </div>
          <div
            v-if="showBranching === question.code"
            class="flex flex-col bg-gray-100 border border-gray-200 rounded w-full p-3 2xl:relative"
          >
            <button
              class="absolute top-1 right-2 text-gray-300 hover:text-gray-500"
              @click="showBranching = null"
            >
              <i class="fas fa-times fa-fw"></i>
            </button>
            <div
              v-for="(item, indexBranch) in getBranchingDetails(question)"
              :key="indexBranch"
            >
              <div v-for="(rule, ruleIndex) in item.ruleList" :key="ruleIndex">
                <span class="font-bold"
                  >Question Number {{ rule.questionNumber }}</span
                ><span>&nbsp;must be one of the following</span>
                <div class="flex flex-wrap space-x-2 px-2 my-2">
                  <span
                    v-for="(option, optionIndex) in rule.options"
                    :key="optionIndex"
                    class="bg-gray-50 rounded border border-gray-200 px-2 py-0.5"
                  >
                    {{ option.name }}
                  </span>
                </div>
              </div>
              <div v-if="item.isAnd" class="my-3">
                <span v-if="item.isAnd === 'false'">or</span
                ><span v-else>and</span>
              </div>
            </div>
          </div>

          <display-question
            v-if="showPreview"
            :question="question"
            class="w-full text-xl font-semibold"
          ></display-question>
        </div>

        <div class="flex w-24 justify-end space-x-2 pr-3 py-1 items-start">
          <button
            class="text-gray-300 hover:text-blue-500 transition duration-300"
            @click="editQuestion(question)"
          >
            <i class="fas fa-edit fa-fw"></i>
          </button>
          <button
            v-if="question.ordinalPosition !== 1"
            class="text-gray-300 hover:text-blue-500 transition duration-300"
            @click="moveQuestion(question)"
          >
            <i class="fas fa-arrows-alt fa-fw"></i>
          </button>
          <button
            v-if="question.ordinalPosition !== 1"
            class="text-gray-300 hover:text-red-500 transition duration-300"
            @click="deleteQuestion(question)"
          >
            <i class="fas fa-trash-alt fa-fw"></i>
          </button>
        </div>
      </div>
      <div class="flex justify-center transition py-3">
        <LPopupMenu>
          <template v-slot:icon
            ><button class="new-button">
              <i class="fas fa-plus fa-fw"></i></button
          ></template>
          <template v-slot:menu>
            <button
              v-for="button in QUESTION_TYPES"
              :key="button.code"
              @click="newQuestion(button.flag, question.ordinalPosition)"
            >
              <i :class="button.icon"></i>{{ button.text }}
            </button>
            <button @click="newQuestionFromTemplate(question.ordinalPosition)">
              <i class="fas fa-question fa-fw"></i>From Template
            </button>
          </template></LPopupMenu
        >
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import {
  convertQuestionFromFormToApi,
  getQuestionTypeText,
} from '~/services/question-helpers'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import CloseModal from '~/components/elements/CloseModal'
import ConfirmModal from '~/components/elements/ConfirmModal'
import PlainModal from '~/components/elements/PlainModal'
import DisplayQuestion from '~/components/surveys/DisplayQuestion'

export default {
  name: 'SurveyListQuestion',
  components: { DisplayQuestion },
  props: {
    question: {
      type: Object,
      required: true,
    },
    maxNumber: {
      type: Number,
      required: true,
    },
    showPreview: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  data() {
    return {
      QUESTION_TYPES,
      showBranching: null,
    }
  },
  computed: {
    questions() {
      return this.$store.getters['questions/sortedQuestions']
    },
    hasBranching() {
      const surveyOptions = JSON.parse(this.question.surveyOptions)
      return (
        surveyOptions.branching && surveyOptions.branching.rules?.length > 0
      )
    },
    hasDisqualify() {
      const surveyOptions = JSON.parse(this.question.surveyOptions)
      return (
        surveyOptions.disqualify && surveyOptions.disqualify.rules?.length > 0
      )
    },
  },
  methods: {
    getQuestionType(question) {
      return getQuestionTypeText(question.flags)
    },
    editQuestion(question) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestion',
        options: { header: `Edit ${question.name}` },
        dataItem: question,
      })
        .then((question) => {
          this.$store.dispatch(
            'questions/updateQuestion',
            convertQuestionFromFormToApi(question)
          )
        })
        .then(() => {
          this.$toasted.show(`Question updated`)
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error(
              `There was a problem upating the question ${error}`
            )
        })
    },
    newQuestion(flag, ordinalPosition) {
      const dataItem = {
        questionNumber: this.maxNumber,
        surveyCode: Number(this.$route.params.id),
        flags: [flag === 'MULTIPLE_CHOICE_IMAGE' ? 'MULTIPLE_CHOICE' : flag],
        ordinalPosition: ordinalPosition + 1,
        surveyOptions: {},
      }

      if (flag === 'MULTIPLE_CHOICE_IMAGE')
        dataItem.surveyOptions.isMultipleChoiceImage = true

      dataItem.surveyOptions = JSON.stringify(dataItem.surveyOptions)

      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestion',
        options: {
          header: 'New Question',
        },
        dataItem,
      })
        .then((question) => {
          this.$store.dispatch(
            'questions/newQuestion',
            convertQuestionFromFormToApi(question)
          )
        })
        .then(() => {
          this.$toasted.show(`Question created`)
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error(
              `There was a problem creating the question ${error}`
            )
        })
    },
    newQuestionFromTemplate(ordinalPosition) {
      ModalService.open(PlainModal, {
        whichComponent: 'SelectQuestionTemplate',
        options: {
          saveName: 'Select',
          saveIcon: 'fas fa-check fa-fw',
        },
      }).then((result) => {
        ModalService.open(NewItemModal, {
          whichComponent: 'NewQuestion',
          dataItem: {
            surveyCode: Number(this.$route.params.id),
            flags: result.flags,
            ordinalPosition: ordinalPosition + 1,
            surveyOptions: result.surveyOptions,
            name: result.name,
            options: result.options,
            text: result.text,
          },
        })
          .then((question) => {
            this.$store.dispatch(
              'questions/newQuestion',
              convertQuestionFromFormToApi(question)
            )
          })
          .then(() => {
            this.$toasted.show(`Question created`)
          })
          .catch((error) => {
            if (error !== 'dismissed')
              this.$toasted.error(
                `There was a problem creating the question ${error}`
              )
          })
      })
    },
    deleteQuestion(question) {
      this.cannotDeleteDueToBranching = []
      this.questions.forEach((el) => {
        const branching = JSON.parse(el.surveyOptions)
        branching.branching.rules.forEach((rule) => {
          rule.ruleList.forEach((rl) => {
            if (String(rl.questionNumber) === String(question.questionNumber)) {
              if (
                !this.cannotDeleteDueToBranching.find((findQuestion) => {
                  return (
                    String(findQuestion.questionNumber) ===
                    String(rl.questionNumber)
                  )
                })
              )
                this.cannotDeleteDueToBranching.push({
                  questionNumber: el.questionNumber,
                  name: el.name,
                })
            }
          })
        })
      })

      if (this.cannotDeleteDueToBranching.length === 0)
        ModalService.open(ConfirmModal, {
          msg: 'This question will be deleted.',
        }).then(() => {
          this.$store.dispatch('questions/deleteQuestion', question.code)
          this.$toasted.show(`Question ${question.name} deleted`)
        })
      else
        ModalService.open(CloseModal, {
          header: 'Cannot delete question',
          msg: `This question can't be deleted since it's used for branching.`,
        })
    },
    moveQuestion(question) {
      ModalService.open(PlainModal, {
        whichComponent: 'QuestionMoveMenu',
        dataItem: question,
        options: {
          header: `Move question ${question.name} after...`,
        },
      })
    },
    getBranchingDetails(question) {
      const surveyOptions = JSON.parse(question.surveyOptions)
      if (
        !surveyOptions.branching ||
        !surveyOptions.branching.rules ||
        surveyOptions.branching.rules.length === 0
      )
        return null
      return surveyOptions.branching.rules
    },
  },
}
</script>

<style scoped>
.new-button {
  @apply flex items-center justify-center rounded-full bg-gray-50 w-6 h-6 text-gray-300 hover:bg-blue-600 hover:text-white hover:border-blue-700 transition duration-300 border border-gray-300;
}
</style>
