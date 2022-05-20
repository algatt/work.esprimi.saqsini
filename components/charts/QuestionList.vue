<template>
  <div class="flex flex-col space-y-5 px-1 lg:px-10 relative">
    <div class="fixed bottom-5 right-5 z-40">
      <l-popup-menu>
        <template #icon
          ><button
            class="bg-blue-600 h-8 w-8 rounded-full text-white hover:bg-blue-300 active:bg-blue-700 transition duration-300"
          >
            <i class="fas fa-search fa-fw"></i></button
        ></template>
        <template #menu>
          <button @click="expandAll">Expand All</button>
          <button @click="collapseAll">Collapse All</button>
          <button
            v-for="page in pages"
            :key="page.ordinalPosition"
            @click="scrollPage(page)"
          >
            {{ page.name }}
          </button>
        </template>
      </l-popup-menu>
    </div>
    <div
      v-for="page in pages"
      :id="`${page.name}_${page.ordinalPosition}`"
      :key="`${page.ordinalPosition}_${page.expanded}`"
      class="flex flex-col border border-gray-200 rounded"
      style="scroll-margin: 50px"
    >
      <div
        class="flex justify-between font-semibold text-lg cursor-pointer hover:bg-gray-100 p-4 rounded transition duration-300"
        @click="
          page.expanded = !page.expanded
          $forceUpdate()
        "
      >
        <span>{{ page.name }}</span>
        <div class="flex items-center space-x-3">
          <span
            class="text-white bg-blue-600 rounded px-1 py-0 text-base rounded"
            >{{ page.children.length }}</span
          >
          <span>
            <i v-if="!page.expanded" class="fas fa-caret-down fa-fw"></i>
            <i v-else class="fas fa-caret-up fa-fw"></i>
          </span>
        </div>
      </div>
      <div v-if="page.expanded" class="space-y-5 p-4">
        <div class="flex border-b-2 border-gray-100 pb-4">
          {{ page.title }}
        </div>
        <div
          v-for="item in page.children"
          :key="item.questionNumber"
          class="flex flex-col items-start rounded border-b-2 border-gray-100 pb-4"
        >
          <div class="flex space-x-3 mb-2">
            <div class="flex flex-col items-start">
              <span class="font-semibold px-2 py-0.5 bg-gray-100 rounded">{{
                item.questionNumber
              }}</span>
            </div>
            <div class="flex flex-col items-start">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-lg">{{ item.name }}</span>
                <span class="text-sm bg-gray-100 rounded px-1 py-0.5">{{
                  getQuestionTypeText(item.flags)
                }}</span>
              </div>
              <span class="italic">{{ getQuestionTitle(item) }}</span>
            </div>
          </div>

          <question-element
            :question="item"
            :responses="getResponses(item)"
          ></question-element>
        </div>
      </div>
    </div>
    <template v-if="false">
      <div
        v-for="item in processedQuestions"
        :key="item.code"
        class="flex flex-col"
      >
        <div v-if="getQuestionTypeText(item.flags) === 'Page'" class="flex">
          <span class="text-lg font-bold">{{ item.name }}</span>
        </div>
        <div
          v-else
          class="flex flex-col items-start border-2 border-gray-200 rounded p-5"
        >
          <div class="flex space-x-3 mb-2">
            <div class="flex flex-col items-start">
              <span class="font-semibold px-2 py-0.5 bg-gray-100 rounded">{{
                item.questionNumber
              }}</span>
            </div>
            <div class="flex flex-col items-start">
              <div class="flex items-center space-x-2">
                <span class="font-semibold text-lg">{{ item.name }}</span>
                <span class="text-sm bg-gray-100 rounded px-1 py-0.5">{{
                  getQuestionTypeText(item.flags)
                }}</span>
              </div>
              <span class="italic">{{ getQuestionTitle(item) }}</span>
            </div>
          </div>

          <question-element
            :question="item"
            :responses="getResponses(item)"
          ></question-element>
        </div></div
    ></template>
  </div>
</template>

<script>
import {
  convertQuestionFromApiToForm,
  getQuestionTypeText,
} from '@/services/question-helpers'
import QuestionElement from '@/components/charts/QuestionElement'
import LPopupMenu from '@/components/LPopupMenu'

export default {
  name: 'ChartsQuestionList',
  components: { LPopupMenu, QuestionElement },
  data() {
    return {
      getQuestionTypeText,
    }
  },
  computed: {
    surveyData() {
      return JSON.parse(JSON.stringify(this.$store.state.surveys.surveyData))
    },
    processedQuestions() {
      return JSON.parse(JSON.stringify(this.surveyData)).questions.sort(
        (a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        }
      )
    },
    pages() {
      const pages = this.processedQuestions
        .filter((el) => {
          return getQuestionTypeText(el.flags) === 'Page'
        })
        .map((el) => {
          return {
            name: el.name,
            title: this.getQuestionTitle(el),
            ordinalPosition: el.ordinalPosition,
            children: [],
            expanded: false,
          }
        })

      for (let i = 0; i < pages.length; i++) {
        const nextPage = pages[i + 1] === undefined ? null : pages[i + 1]
        pages[i].children = this.processedQuestions.filter((el) => {
          if (nextPage)
            return (
              el.ordinalPosition > pages[i].ordinalPosition &&
              el.ordinalPosition < nextPage.ordinalPosition
            )
          else return el.ordinalPosition > pages[i].ordinalPosition
        })
      }

      return pages
    },
  },

  methods: {
    getResponses(question) {
      return this.surveyData.responses
        .filter((response) => {
          return response.questionCode === question.code
        })
        .map((response) => {
          return {
            questionCode: response.questionCode,
            token: response.token,
            option: response.option,
            value: response.value,
          }
        })
    },
    getQuestionTitle(question) {
      return convertQuestionFromApiToForm(question).text
    },
    scrollPage(page) {
      document
        .getElementById(`${page.name}_${page.ordinalPosition}`)
        .scrollIntoView({ behavior: 'smooth' })
    },
    expandAll() {
      this.pages.forEach((el) => {
        el.expanded = true
      })
      this.$forceUpdate()
    },
    collapseAll() {
      this.pages.forEach((el) => {
        el.expanded = false
      })
      this.$forceUpdate()
    },
  },
}
</script>
