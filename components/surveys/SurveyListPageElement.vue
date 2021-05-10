<template>
  <div
    class="bg-gray-100 p-5 mb-6 container rounded shadow flex flex-col border"
    @dragover="$emit('dragover', $event)"
  >
    <div class="flex justify-between">
      <h4 class="flex flex-1">{{ section.name }}</h4>
      <div class="w-28 flex justify-center">
        <LPopupMenu
          ><template v-slot:menu
            ><button @click="editQuestion(section)">
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
            @click="newQuestion(button.flag, section.ordinalPosition)"
          >
            <i :class="button.icon"></i>{{ button.text }}
          </button>
        </template></LPopupMenu
      >
    </div>
    <slot></slot>
  </div>
</template>

<script>
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/layouts/NewItemModal'
import { convertQuestionFromFormToApi } from '~/services/question-helpers'

export default {
  name: 'SurveyListPageElementVue',
  props: {
    section: {
      type: Object,
      required: true,
    },
    maxNumber: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      QUESTION_TYPES,
    }
  },
  methods: {
    editQuestion(question) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestion',
        dataItem: question,
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
          this.$toasted.error(
            `There was a problem creating the question ${error}`
          )
        })
    },
  },
}
</script>

<style scoped></style>
