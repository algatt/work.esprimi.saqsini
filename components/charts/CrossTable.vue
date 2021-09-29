<template>
  <div
    class="flex flex-col w-full overflow-auto max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-none px-5 mx-auto"
  >
    <div ref="crossTable">
      <table
        class="table flex-1 rounded border border-gray-200"
        :style="{ minWidth: `${tableHeader.length * minElWidth}px` }"
      >
        <caption v-if="details.xTitle" class="mb-5">
          <span class="flex w-full justify-center font-semibold text-lg">
            {{ details.xTitle }} {{ details.xOption }}</span
          >
          <span class="flex w-full justify-center">compared to </span>
          <span class="flex w-full justify-center font-semibold text-lg">
            {{ details.yTitle }} {{ details.yOption }}</span
          >
        </caption>
        <tr class="bg-gray-100">
          <th
            v-for="(header, index) in tableHeader"
            :key="index"
            class="text-center py-2 border-b border-gray-200"
            :style="{ width: `${100 / tableColumns}%` }"
          >
            {{ header }}
          </th>
        </tr>
        <tr
          v-for="(rows, rowIndex) in tableRows"
          :key="rowIndex"
          class="border-b border-gray-200"
        >
          <td
            v-for="(field, index) in rows"
            :key="index"
            class="text-center"
            :class="index === 0 ? 'bg-gray-100 font-semibold py-2 ' : null"
          >
            <span class="flex flex-col items-center py-2">
              <span
                v-if="field === minValue"
                class="bg-red-100 text-red-700 rounded-lg px-2 py-0.5"
                >{{ field }}</span
              >
              <span
                v-else-if="field === maxValue"
                class="bg-green-100 text-green-700 rounded-lg px-2 py-0.5"
                >{{ field }}</span
              >
              <span v-else>{{ field }}</span>
              <span v-if="index !== 0 && !hidePercentages">
                {{ calculatePercentage(field, totalCount) }}%</span
              >
            </span>
          </td>
        </tr>
      </table>
    </div>
    <div class="flex justify-end py-5">
      <l-button @click="copyTableToClipboard">
        Copy
        <template v-slot:rightIcon
          ><i class="fas fa-clipboard fa-fw"></i></template
      ></l-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CrossTable',
  props: {
    data: {
      required: true,
      type: Array,
    },
    details: {
      required: false,
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      maxValue: null,
      minValue: null,
      totalCount: null,
      minElWidth: 150,
      hidePercentages: false,
    }
  },
  computed: {
    tableHeader() {
      return this.data[0]
    },
    tableRows() {
      return this.data.slice(1, this.data.length)
    },
    tableColumns() {
      return this.data[0].length
    },
  },
  mounted() {
    this.maxValue = this.getMaxValue()
    this.minValue = this.getMinValue()
    this.totalCount = this.getTotalCount()
  },
  methods: {
    getMaxValue() {
      let maxValue = null
      for (let i = 1; i < this.data.length; i++) {
        for (let j = 1; j < this.data[i].length; j++) {
          const val = this.data[i][j]
          maxValue = !maxValue ? val : val > maxValue ? val : maxValue
        }
      }
      return maxValue
    },
    getMinValue() {
      let minValue = null
      for (let i = 1; i < this.data.length; i++) {
        for (let j = 1; j < this.data[i].length; j++) {
          const val = this.data[i][j]
          minValue = !minValue ? val : val < minValue ? val : minValue
        }
      }
      return minValue
    },
    getTotalCount() {
      let totalCount = 0
      for (let i = 1; i < this.data.length; i++) {
        for (let j = 1; j < this.data[i].length; j++) {
          const val = this.data[i][j]
          totalCount += val
        }
      }
      return totalCount
    },
    calculatePercentage(value, total) {
      const x = Math.round((value / total) * 100)
      return isNaN(x) ? 0 : x
    },
    copyTableToClipboard() {
      this.hidePercentages = true
      this.$nextTick(() => {
        navigator.clipboard
          .writeText(this.$refs.crossTable.innerHTML)
          .then(() => {
            this.$toasted.show(
              'Table copied to clipboard. You can paste it in Excel.'
            )
            this.hidePercentages = false
          })
      })
    },
  },
}
</script>

<style scoped></style>
