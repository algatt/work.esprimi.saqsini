<template>
  <div class="flex flex-col items-center w-full">
    <div
      class="flex flex-wrap overflow-y-auto items-start justify-start w-full"
      :style="`min-height: ${REPORT_CHART_SETTINGS.minQuestionHeight}px`"
    >
      <div
        v-for="(item, index) in datasets"
        :key="index"
        class="p-2 my-2 mx-2 bg-gray-100 rounded"
      >
        <span>{{ item.text }}</span>
        <span
          v-if="item.count > 1"
          class="text-sm bg-primary rounded text-white font-semibold px-1 py-0.5"
          >{{ item.count }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { REPORT_CHART_SETTINGS } from '~/assets/settings/charts-settings'

export default {
  name: 'ChartTypeIn',

  props: {
    elements: {
      type: Array,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return { REPORT_CHART_SETTINGS }
  },

  computed: {
    datasets() {
      let temp = this.responses.map((el) => {
        return el.value.toLowerCase().trim()
      })

      const data = {}
      temp.forEach((el) => {
        if (data[el]) data[el]++
        else data[el] = 1
      })

      temp = []
      Object.keys(data).forEach((el) => {
        temp.push({ text: el, count: data[el] })
      })

      return temp.sort((a, b) => {
        return a.count > b.count ? -1 : 1
      })
    },
  },
}
</script>
