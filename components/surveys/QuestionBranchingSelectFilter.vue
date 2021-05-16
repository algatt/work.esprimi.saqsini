<template>
  <div class="w-full flex">
    <div class="flex w-full md:w-8/12 justify-between items-start">
      <l-select
        v-if="rule.hasOwnProperty('questionNumber')"
        class="flex flex-1"
        :value="rule.questionNumber"
        @input="$emit('updateQuestion', $event)"
      >
        <template v-slot:options>
          <option
            v-for="ques in questions"
            :key="ques.code"
            :value="String(ques.questionNumber)"
            :selected="
              String(ques.questionNumber) === String(rule.questionNumber)
            "
          >
            {{ getQuestionText(ques).text }}
          </option>
        </template>
      </l-select>
      <l-select
        v-else
        class="flex flex-1"
        :value="rule.name"
        @input="$emit('updateFilter', $event)"
      >
        <template v-slot:options>
          <option
            v-for="(filter, filterIndex) in Object.keys(filters)"
            :key="filterIndex"
            :value="filter"
            :selected="filter === rule.name"
          >
            {{ filter }}
          </option></template
        >
      </l-select>
      <div class="w-12 flex justify-center pt-2">
        <l-button-circle color="red" @click="$emit('deleteQuestion')">
          <i class="far fa-trash-alt fa-fw"></i>
        </l-button-circle>
      </div>
    </div>
    <div class="w-full md:w-4/12 flex items-start">
      <multi-select
        v-if="rule.hasOwnProperty('questionNumber')"
        class="w-full"
        :original-list="getCurrentQuestionOptions(rule.questionNumber)"
        :selected-list="rule.options"
        @selectedItems="$emit('manageOptions', $event)"
        ><template v-slot:title>Select</template></multi-select
      >
      <multi-select
        v-else
        class="w-full"
        :original-list="getCurrentFilterOptions(rule.name)"
        :selected-list="rule.options"
        @selectedItems="$emit('manageOptions', $event)"
        ><template v-slot:title>Select</template></multi-select
      >
    </div>
  </div>
</template>

<script>
import { parseQuestionToForm } from '~/helpers/parseSurveyObjects'
import MultiSelect from '~/components/elements/MultiSelect'

export default {
  name: 'QuestionBranchingSelectFilter',
  components: { MultiSelect },
  props: {
    condition: {
      type: Object,
      required: true,
    },
    rule: {
      type: Object,
      required: true,
    },
    question: {
      type: Object,
      required: true,
    },
  },
  computed: {
    questions() {
      const x = JSON.parse(
        JSON.stringify(this.$store.getters['questions/sortedQuestions'])
      )
      return x.filter((el) => {
        return (
          el.ordinalPosition < this.question.ordinalPosition &&
          !el.flags.includes('SECTION') &&
          el.options.length !== 0
        )
      })
    },
    filters() {
      return this.$store.state.invitations.filters
    },
  },
  methods: {
    getQuestionText(question) {
      return parseQuestionToForm(question)
    },
    getCurrentQuestionOptions(questionNumber) {
      const x = this.questions.find((el) => {
        return String(el.questionNumber) === String(questionNumber)
      })

      if (x.flags.includes('RANKING')) {
        const data = []
        x.options.forEach((el) => {
          for (let i = 1; i <= x.options.length; i++) {
            data.push({
              code: `${el.value} (${i})`,
              name: `${el.value} (${i})`,
            })
          }
        })
        return data
      } else if (x.flags.includes('RADIO_GRID')) {
        const data = []
        const rows = x.options.filter((el) => {
          return el.flags.includes('ROW')
        })
        const columns = x.options.filter((el) => {
          return el.flags.includes('COLUMN')
        })
        rows.forEach((row) => {
          columns.forEach((column) => {
            data.push({
              code: `${row.value} (${column.value})`,
              name: `${row.value} (${column.value})`,
            })
          })
        })
        return data
      } else {
        return x
          ? x.options.map((el) => {
              return { code: el.value, name: el.value }
            })
          : []
      }
    },
    getCurrentFilterOptions(filterName) {
      const x = this.filters[filterName]

      return x || []
    },
  },
}
</script>

<style scoped></style>
