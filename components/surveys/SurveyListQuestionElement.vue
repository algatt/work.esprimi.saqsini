<template>
  <div>
    <div
      class="bg-white my-2 p-4 draggable cursor-move rounded border flex flex-wrap"
      draggable="true"
      @dragstart="$emit('dragstart', $event)"
      @dragend="$emit('dragend', $event)"
      @dragover.prevent.stop="$emit('dragover', $event)"
      @drop="$emit('drop', $event)"
    >
      <div class="flex flex-1 flex-col items-start">
        <h6 class="mb-1">{{ question.name }}</h6>
        <l-badge>{{ getQuestionType(question) }}</l-badge>
      </div>

      <div class="w-20 flex justify-center">
        <LPopupMenu
          ><template v-slot:menu
            ><button @click="editQuestion(question)">
              <i class="fas fa-edit fa-fw"></i>Edit
            </button></template
          ></LPopupMenu
        >
      </div>
    </div>
    <div
      class="flex justify-center opacity-0 hover:opacity-100 transition duration-300"
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
</template>

<script>
import {
  convertQuestionFromFormToApi,
  getQuestionTypeText,
} from '~/services/question-helpers'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/layouts/NewItemModal'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'

export default {
  name: 'SurveyListQuestionElementVue',

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
  },
}
</script>

<style scoped></style>
