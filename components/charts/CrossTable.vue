<template>
  <table class="table-fixed w-11/12 mx-auto rounded border border-gray-200">
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
      v-for="(rows, index) in tableRows"
      :key="index"
      class="border-b border-gray-200"
    >
      <td
        v-for="(field, index) in rows"
        :key="index"
        class="text-center"
        :class="
          index === 0
            ? 'bg-gray-100 font-semibold py-2 '
            : field === maxValue
            ? 'text-green-600'
            : field === minValue
            ? 'text-red-600'
            : null
        "
      >
        {{ field }}
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'CrossTable',
  props: {
    data: {
      required: true,
      type: Array,
    },
  },
  data() {
    return {
      maxValue: null,
      minValue: null,
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
  },
}
</script>

<style scoped></style>
