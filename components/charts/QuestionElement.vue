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

      <div class="flex w-full">
        <select
          v-if="['MULTIPLE_CHOICE', 'LIKERT'].includes(data.question.type)"
          class="select input w-full"
          @change="updateSelectedDemographic"
        >
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
        <div
          v-if="data.question.type === 'RANKING'"
          class="flex flex-col w-full"
        >
          <select v-model="selectedDemographic" class="input select w-full">
            <option :value="null">No Filter</option>
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

          <multi-select
            v-if="selectedDemographic"
            :original-list="availableDemographics"
            :selected-list="selectedListForRanking"
            display-field="name"
            @selectedItems="updateChartRanking"
          >
            <template v-slot:title>Select values</template>
          </multi-select>
        </div>
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
      <chart-ranking
        v-else-if="data.question.type === 'RANKING'"
        :data="data"
        :selected-list="selectedList"
        :selected-demographic="selectedListForRanking"
      ></chart-ranking>
      <span v-else>{{ data }}</span>
    </div>
  </div>
</template>

<script>
import MultiSelect from '~/components/layouts/MultiSelect'
import ChartMultipleChoice from '~/components/charts/ChartMultipleChoice'
import ChartLikert from '~/components/charts/ChartLikert'
import ChartRanking from '~/components/charts/ChartRanking'
export default {
  name: 'QuestionElementVue',
  components: { ChartRanking, ChartLikert, MultiSelect, ChartMultipleChoice },
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
      selectedListForRanking: [],
      loading: true,
    }
  },
  computed: {
    availableDemographics() {
      return this.data.demographics[this.selectedDemographic].map((el) => {
        return { name: el, code: el, type: this.selectedDemographic }
      })
    },
  },
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
    updateChartRanking(newList) {
      this.selectedListForRanking = newList
      this.$forceUpdate()
    },
    updateSelectedDemographic($event) {
      this.selectedDemographic = $event.target.value
    },
  },
}
</script>

<style scoped></style>
