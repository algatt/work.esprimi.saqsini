<template>
  <list-layout v-if="!loading && !error">
    <data-table
      :table-data="questions"
      :table-definition="tableQuestions"
      @deleteAll="deleteMultipleQuestions"
    >
      <template v-slot:headerLeft>
        <h5>Template Questions</h5>
      </template>
      <template v-slot:headerRight>
        <LPopupMenu>
          <template v-slot:icon
            ><new-item-button>New Question</new-item-button></template
          >
          <template v-slot:menu>
            <button
              v-for="button in QUESTION_TYPES"
              :key="button.code"
              @click="newQuestion(button.flag)"
            >
              <i :class="button.icon"></i>{{ button.text }}
            </button>
          </template></LPopupMenu
        >
      </template>
      <template v-slot:name="slotProps">
        <div class="flex items-center space-x-3">
          <span>{{ slotProps.item.name }}</span>
          <l-badge>{{ getQuestionTypeText(slotProps.item.flags) }}</l-badge>
          <l-badge
            v-for="(tag, index) in slotProps.item.tags"
            :key="index"
            color="blue"
            >{{ tag }}</l-badge
          >
        </div>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editQuestion(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </LPopupMenu>
        </div>
      </template>
    </data-table>
  </list-layout>
  <page-load-error v-else-if="!loading && error"></page-load-error>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import ListLayout from '~/components/elements/ListLayout'
import PageLoadError from '~/components/elements/PageLoadError'
import Spinner from '~/components/elements/Spinner'
import DataTable from '~/components/elements/DataTable/DataTable'
import NewItemButton from '~/components/elements/NewItemButton'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import {
  convertQuestionFromFormToApi,
  getQuestionTypeText,
} from '~/services/question-helpers'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import LPopupMenu from '~/components/LPopupMenu'

export default {
  name: 'QuestionTemplates',
  components: {
    LPopupMenu,
    NewItemButton,
    DataTable,
    ListLayout,
    PageLoadError,
    Spinner,
  },
  layout: 'authlayout',
  data() {
    return {
      loading: true,
      error: false,
      tableQuestions: [
        { title: 'Name', field: 'name', slot: 'name', sortable: true },
        { title: '', slot: 'actions' },
      ],
      QUESTION_TYPES,
      getQuestionTypeText,
    }
  },
  computed: {
    questions() {
      return this.$store.state.questionstempplate.items
    },
  },
  mounted() {
    this.$store
      .dispatch('questionstempplate/getQuestions', {})
      .then(() => {
        this.loading = false
      })
      .catch(() => {
        this.error = true
      })
  },
  methods: {
    newQuestion(flag) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestionTemplate',
        dataItem: {
          flags: [flag],
          tags: [],
          surveyOptions: JSON.stringify({}),
        },
      })
        .then((question) => {
          this.$store.dispatch(
            'questionstempplate/newQuestion',
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
    editQuestion(item) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewQuestionTemplate',
        dataItem: item,
      })
        .then((question) => {
          this.$store.dispatch(
            'questionstempplate/updateQuestion',
            convertQuestionFromFormToApi(question)
          )
        })
        .then(() => {
          this.$toasted.show(`Question updated`)
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error(
              `There was a problem updating the question ${error}`
            )
        })
    },
    deleteMultipleQuestions(questions) {
      const calls = []
      for (const question in questions) {
        calls.push(
          this.$store.dispatch(
            'questionstempplate/deleteQuestion',
            questions[question].code
          )
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${questions.length} questions deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the questions')
        })
    },
  },
}
</script>

<style scoped></style>
