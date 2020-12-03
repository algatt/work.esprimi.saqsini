<template>
  <div v-if="!loading" class="flex flex-wrap">
    <div class="w-full flex items-end justify-between border-b border-gray-200">
      <div class="flex items-center space-x-3">
        <button
          v-for="menuOption in menu"
          :key="menuOption.code"
          class="w-20 font-semibold hover:text-primary pb-2 border-b-2 border-transparent hover:border-primary transition duration-300 focus:outline-none"
          :class="selectedMenu === menuOption.code ? 'border-primary' : null"
          @click="selectedMenu = menuOption.code"
        >
          {{ menuOption.text }}
        </button>
      </div>
      <div>
        <h5 class="text-lg font-bold text-right">{{ survey.name }}</h5>
        <h6>{{ survey.referenceDate }}</h6>
      </div>
    </div>
    <div class="mt-3 w-full flex flex-col">
      <div v-for="question in questions" :key="question.code">
        <display-question
          :question="question"
          @selectQuestion="chooseQuestion"
        ></display-question>
        <new-question-toolbar
          @newQuestion="newQuestion($event, question.ordinalPosition + 1)"
        ></new-question-toolbar>
      </div>
      <div v-if="questions.length === 0">
        <new-question-toolbar
          @newQuestion="newQuestion($event, questions.length + 1)"
        ></new-question-toolbar>
      </div>
    </div>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:content>
          <new-question></new-question>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import Spinner from '~/components/layouts/Spinner'
import DisplayQuestion from '~/components/surveys/DisplayQuestion'
import NewQuestionToolbar from '~/components/surveys/NewQuestionToolBar'
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import NewQuestion from '~/components/surveys/NewQuestion'
import EditObjectModal from '~/components/layouts/EditObjectModal'

export default {
  name: 'QuestionList',
  components: {
    NewQuestion,
    Spinner,
    DisplayQuestion,
    NewQuestionToolbar,
    EditObjectModal,
  },
  data() {
    return {
      menu: [
        { code: 1, text: 'Questions' },
        { code: 2, text: 'Settings' },
        { code: 3, text: 'Language' },
        { code: 4, text: 'Preview' },
      ],
      selectedMenu: 1,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    questions() {
      return this.$store.getters.getItems('questions')
    },
    survey() {
      return parseSurveyToForm(this.$store.getters.getItems('surveys'))
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('surveys/getSurveyByCode', this.$route.params.id),
      this.$store.dispatch('questions/getQuestionsBySurvey', {
        limit: 1000,
        offset: 0,
        code: this.$route.params.id,
      }),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  methods: {
    newQuestion(flag, ordinalPosition) {
      this.$store.dispatch('setCurrentItemToBeEdited', {
        code: -1,
        surveyCode: Number(this.$route.params.id),
        flags: [flag],
        ordinalPosition,
      })
    },
    chooseQuestion(question) {
      this.$store.dispatch('setCurrentItemToBeEdited', question)
    },
  },
}
</script>

<style scoped></style>
