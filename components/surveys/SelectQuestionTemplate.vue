<template>
  <data-table
    :table-data="questions"
    :table-definition="tableQuestions"
    :enable-selection="false"
  >
    <template v-slot:headerLeft>
      <h5>Template Questions</h5>
    </template>
    <template v-slot:headerRight> </template>
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
        <l-text-link
          v-if="selected !== slotProps.item.code"
          @click="selectQuestion(slotProps.item)"
          >Select</l-text-link
        >
        <div
          v-else
          class="bg-green-600 rounded-full font-bold text-white text-sm h-5 w-5 flex items-center justify-center"
        >
          <i class="fas fa-check fa-fw"></i>
        </div>
      </div>
    </template>
  </data-table>
</template>

<script>
import DataTable from '~/components/elements/DataTable/DataTable'
import { QUESTION_TYPES } from '~/assets/settings/survey-settings'
import { getQuestionTypeText } from '~/services/question-helpers'
import LTextLink from '~/components/LTextLink'

export default {
  name: 'SelectQuestionTemplate',
  components: { LTextLink, DataTable },
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
        { title: '', slot: 'actions' },
      ],
      QUESTION_TYPES,
      getQuestionTypeText,
      selected: null,
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
    selectQuestion(item) {
      this.selected = item.code
      this.$emit('update', item)
    },
  },
}
</script>

<style scoped></style>
