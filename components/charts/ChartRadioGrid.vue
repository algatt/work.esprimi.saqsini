<template>
  <div class="flex flex-col overflow-x-auto w-full">
    <div
      class="flex flex-col w-full"
      :style="{ minWidth: `${datasets.columns.length + 1 * minElWidth}px` }"
    >
      <div class="flex">
        <div
          class="border-b-2 py-2"
          :style="{
            width: `${100 / (datasets.columns.length + 1)}%`,
            minWidth: `${minElWidth}px`,
          }"
        ></div>
        <div
          v-for="(item, index) in datasets.columns"
          :key="index"
          class="font-semibold text-center border-b-2 py-2"
          :style="{
            width: `${100 / (datasets.columns.length + 1)}%`,
            minWidth: `${minElWidth}px`,
          }"
        >
          {{ item }}
        </div>
      </div>
    </div>
    <div
      v-for="(item, index) in Object.keys(datasets.responses)"
      :key="index"
      class="flex"
    >
      <div
        class="text-center font-semibold py-2 border-b-2"
        :style="{
          width: `${100 / (datasets.columns.length + 1)}%`,
          minWidth: `${minElWidth}px`,
        }"
      >
        {{ item }}
      </div>
      <div
        v-for="(score, index) in datasets.responses[item]"
        :key="index"
        class="text-center font-semibold py-2 border-b-2"
        :style="{
          width: `${100 / (datasets.columns.length + 1)}%`,
          minWidth: `${minElWidth}px`,
        }"
      >
        <span
          v-if="score === datasets.minValue"
          class="bg-red-100 text-red-700 rounded-lg px-2 py-0.5"
          >{{ score }}</span
        >
        <span
          v-else-if="score === datasets.maxValue"
          class="bg-green-100 text-green-700 rounded-lg px-2 py-0.5"
          >{{ score }}</span
        >
        <span v-else>{{ score }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartRadioGrid',

  props: {
    data: {
      type: Object,
      required: true,
    },
    selectedList: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      minElWidth: 100,
    }
  },
  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    datasets() {
      const data = {}

      const whichRows = this.selectedList.map((el) => {
        return el.code
      })

      data.rows = this.data.question.options
        .filter((el) => {
          return el.flags.includes('ROW')
        })
        .sort((a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        })
        .map((el) => {
          return el.value
        })
        .filter((el) => {
          return whichRows.includes(el)
        })

      data.columns = this.data.question.options
        .filter((el) => {
          return el.flags.includes('COLUMN')
        })
        .sort((a, b) => {
          return a.ordinalPosition > b.ordinalPosition ? 1 : -1
        })
        .map((el) => {
          return el.value
        })

      data.responses = {}
      data.rows.forEach((row) => {
        data.responses[row] = {}
        data.columns.forEach((col) => {
          data.responses[row][col] = 0
        })
      })
      this.data.responses.forEach((el) => {
        if (whichRows.includes(el.option))
          data.responses[el.option][el.value] += 1
      })

      Object.keys(data.responses).forEach((el) => {
        Object.keys(data.responses[el]).forEach((val) => {
          const value = data.responses[el][val]
          if (!data.minValue) data.minValue = value
          if (!data.maxValue) data.maxValue = value
          if (value < data.minValue) data.minValue = value
          if (value > data.maxValue) data.maxValue = value
        })
      })
      return data
    },
  },
}
</script>
