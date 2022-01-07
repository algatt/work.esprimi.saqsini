<template>
  <data-table
    :table-data="processedQuestions"
    :table-definition="tableQuestions"
    :enable-selection="true"
    :enable-delete-all="false"
    @selectItems="
      selected = $event
      $emit('update', selected)
    "
  >
    <template v-slot:headerLeft>
      <h5>Template Questions</h5>
      <l-input-button
        v-model="searchField"
        class="mb-2"
        placeholder="Search"
        @click="searchField = ''"
      >
        <i class="fas fa-times fa-fw text-gray-600"></i>
      </l-input-button>
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
  </data-table>
</template>

<script>
import DataTable from '~/components/elements/DataTable/DataTable'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import { getQuestionTypeText } from '~/services/question-helpers'

export default {
  name: 'SelectQuestionTemplate',
  components: { DataTable },
  props: {
    dataItem: {
      type: Object,
      required: false,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      loading: true,
      error: false,
      tableQuestions: [
        { title: 'Name', field: 'name', slot: 'name', sortable: true },
      ],
      QUESTION_TYPES,
      getQuestionTypeText,
      selected: [],
      searchField: '',
    }
  },
  computed: {
    processedQuestions() {
      const x = JSON.parse(JSON.stringify(this.questions))
      if (this.searchField === '') return x
      return x.filter((el) => {
        return (
          el.name.toLowerCase().includes(this.searchField) ||
          getQuestionTypeText(el.flags)
            .toLowerCase()
            .includes(this.searchField) ||
          el.tags.includes(this.searchField)
        )
      })
    },
    questions() {
      return this.$store.state.questionstempplate.items
    },
  },
  watch: {
    selected: {
      handler() {
        this.$emit('isValid', this.selected.length > 0)
      },
      deep: true,
    },
  },
  mounted() {
    this.$emit('isValid', false)
    this.$store
      .dispatch('questionstempplate/getQuestions', {})
      .then(() => {
        this.loading = false
      })
      .catch(() => {
        this.error = true
      })
  },
}
</script>

<style scoped></style>
