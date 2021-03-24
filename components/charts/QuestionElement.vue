<template>
  <div v-if="!loading" class="flex flex-wrap w-full">
    <div class="w-full md:w-3/12 flex flex-col">
      <multi-select
        :original-list="data.availableAnswers"
        :selected-list="selectedList"
        display-field="text"
        @selectedItems="updateChart"
      >
        <template v-slot:title>Available answers</template>
      </multi-select>

      <div class="flex px-3 w-full">
        <select class="select input w-full" @change="updateSelectedDemographic">
          <option :value="null">No Aggregation</option>
          <option
            v-for="(item, index) in data.demographicLabels"
            :key="index"
            :value="item"
          >
            {{
              item.substring(0, 1).toUpperCase() +
              item.substring(1, item.length)
            }}
          </option>
        </select>
      </div>
    </div>
    <div class="w-full md:w-9/12 flex flex-col p-5">
      <chart-multiple-choice
        v-if="data.question.type === 'MULTIPLE_CHOICE'"
        :data="data"
        :selected-list="selectedList"
        :selected-demographic="selectedDemographic"
      ></chart-multiple-choice>
      <chart-likert
        v-else-if="data.question.type === 'LIKERT'"
        :data="data"
        :selected-list="selectedList"
        :selected-demographic="selectedDemographic"
      ></chart-likert>
      <span v-else>work in progress</span>
    </div>
  </div>
</template>

<script>
import MultiSelect from '~/components/layouts/MultiSelect'
import ChartMultipleChoice from '~/components/charts/ChartMultipleChoice'
import ChartLikert from '~/components/charts/ChartLikert'
export default {
  name: 'QuestionElementVue',
  components: { ChartLikert, MultiSelect, ChartMultipleChoice },
  props: {
    data: {
      required: true,
      type: Object,
    },
  },
  data() {
    return {
      selectedList: [],
      selectedDemographic: null,
      loading: true,
    }
  },
  computed: {},
  mounted() {
    this.selectedList = this.data.availableAnswers
    this.loading = false
  },
  methods: {
    updateChart(newSelectedList) {
      this.selectedList = newSelectedList.sort((a, b) => {
        return a.code > b.code ? 1 : -1
      })
      this.$forceUpdate()
    },
    updateSelectedDemographic($event) {
      this.selectedDemographic = $event.target.value
    },
  },
}
</script>

<style scoped></style>
