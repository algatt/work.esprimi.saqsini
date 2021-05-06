<template>
  <div
    class="flex relative items-center w-full bg-white h-6 rounded-l-md rounded-r-md border-2"
    :class="`border-${color}-600`"
  >
    <div
      class="relative shadow text-sm"
      style="min-height: 100%"
      :style="{ width: `${barWidth}%` }"
      :class="`bg-${color}-600`"
    ></div>
    <span
      class="font-bold h-full absolute w-full flex justify-center items-center left-0 top-0 text-sm"
      :class="barWidth < 60 ? `text-${color}-600` : 'text-white'"
    >
      {{ currentValue }}/{{ totalValue }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'LProgress',
  props: {
    currentValue: {
      type: Number,
      default: 0,
    },
    totalValue: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  computed: {
    barWidth() {
      const width = this.currentValue / this.totalValue
      return isNaN(width) ? 0 : width * 100
    },
  },
}
</script>

<style scoped></style>
