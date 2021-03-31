<template>
  <div class="flex flex-wrap max-h-64 overflow-y-auto">
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
</template>

<script>
export default {
  name: 'ChartTypeIn',

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

  computed: {
    legendData() {
      return this.data.availableAnswers.map((el) => {
        return el.code
      })
    },
    datasets() {
      let temp = this.data.availableAnswers.map((el) => {
        return el.code.toLowerCase().trim()
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

      return temp
    },
  },
}
</script>
