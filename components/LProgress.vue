<template>
  <div
    class="flex relative items-center w-full bg-white h-6 border-2 rounded"
    :class="color ? `border-${color}-600` : `border-primary`"
  >
    <div
      class="absolute shadow text-sm left-0"
      style="top: -1px; height: calc(100% + 1px)"
      :style="{ width: `calc(${barWidth}% + 1px)` }"
      :class="color ? `bg-${color}-600` : `bg-primary`"
    ></div>
    <span
      :title="`${currentValue} / ${totalValue}`"
      class="font-bold h-full absolute w-full flex justify-center items-center left-0 top-0 text-xs h-4"
    >
      <span class="bg-white px-1 rounded-md bg-opacity-50"
        >{{ barWidth }}%
      </span>
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
      default: null,
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
