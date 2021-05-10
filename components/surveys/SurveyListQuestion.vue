<template>
  <div>
    <div
      v-if="getQuestionType(question) !== 'Page'"
      class="cursor-move flex flex-col bg-white rounded border-t border-b"
      draggable="true"
      @dragstart="$emit('dragstart', $event)"
      @dragend="$emit('dragend', $event)"
      @dragover.prevent.stop="$emit('dragover', $event)"
      @drop="$emit('drop', $event)"
    >
      <div class="flex flex-wrap">
        <div class="flex flex-1 flex-col items-start pl-6 py-4 space-y-2">
          <h6>{{ question.name }}</h6>
          <div class="flex flex-wrap space-x-2">
            <l-badge>{{ getQuestionType(question) }}</l-badge>
            <l-badge v-if="hasBranching">Branching</l-badge>
          </div>
        </div>
        <div class="flex w-24 justify-center">
          <LPopupMenu
            ><template v-slot:menu
              ><button @click="editQuestion(question)">
                <i class="fas fa-edit fa-fw"></i>Edit
              </button>
              <button @click="deleteQuestion(question)">
                <i class="fas fa-trash-alt fa-fw"></i>Delete
              </button></template
            ></LPopupMenu
          >
        </div>
      </div>
      <div
        class="flex justify-center opacity-0 hover:opacity-100 transition duration-300 py-1"
      >
        <LPopupMenu>
          <template v-slot:icon
            ><LButtonCircle><i class="fas fa-plus fa-fw"></i></LButtonCircle
          ></template>
          <template v-slot:menu>
            <button
              v-for="button in QUESTION_TYPES"
              :key="button.code"
              @click="newQuestion(button.flag, question.ordinalPosition)"
            >
              <i :class="button.icon"></i>{{ button.text }}
            </button>
          </template></LPopupMenu
        >
      </div>
    </div>
    <div
      v-else
      class="container bg-gray-100 rounded shadow flex flex-col border pt-4 mb-4"
      @dragover="$emit('dragover', $event)"
    >
      <div class="flex flex-wrap">
        <div class="flex flex-1 flex-col space-y-2 pl-4">
          <h4 class="text-blue-600 font-bold">{{ question.name }}</h4>
          <div class="flex flex-wrap space-x-2">
            <l-badge v-if="hasBranching">Branching</l-badge>
            <l-badge v-if="hasDisqualify">Disqualify</l-badge>
          </div>
        </div>
        <div class="flex w-24 justify-center py-1">
          <LPopupMenu
            ><template v-slot:menu
              ><button @click="editQuestion(question)">
                <i class="fas fa-edit fa-fw"></i>Edit
              </button>
              <button @click="deleteQuestion(question)">
                <i class="fas fa-trash-alt fa-fw"></i>Delete
              </button>
            </template></LPopupMenu
          >
        </div>
      </div>
      <div
        class="flex justify-center opacity-0 hover:opacity-100 transition duration-300 py-1"
      >
        <LPopupMenu>
          <template v-slot:icon
            ><LButtonCircle><i class="fas fa-plus fa-fw"></i></LButtonCircle
          ></template>
          <template v-slot:menu>
            <button
              v-for="button in QUESTION_TYPES"
              :key="button.code"
              @click="newQuestion(button.flag, question.ordinalPosition)"
            >
              <i :class="button.icon"></i>{{ button.text }}
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
import NewItemModal from '~/components/layouts/NewItemModal'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import CloseModal from '~/components/elements/CloseModal'
import ConfirmModal from '~/components/elements/ConfirmModal'

export default {
  name: 'SurveyListQuestion',

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
      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestion',
        dataItem: {
          questionNumber: this.maxNumber,
          surveyCode: Number(this.$route.params.id),
          flags: [flag],
          ordinalPosition: ordinalPosition + 1,
          surveyOptions: JSON.stringify({}),
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
  },
}
</script>

<style scoped></style>
