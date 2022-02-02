<template>
  <div
    class="flex relative items-center w-full h-7 border-2 border-gray-300 rounded-lg"
  >
    <div
      class="absolute rounded"
      style="
        top: 2px;
        right: 2px;
        left: 2px;
        bottom: 2px;
        height: calc(100% - 4px);
      "
      :class="
        barWidth === 100
          ? color
            ? `bg-${color}-600`
            : `bg-primary`
          : `bg-gray-200`
      "
      :style="{ width: `calc(${barWidth}% - 4px)` }"
    ></div>
    <span
      :title="`${currentValue} / ${totalValue}`"
      class="font-bold h-full absolute w-full flex justify-center items-center left-0 top-0 text-xs h-4"
    >
      <span class="bg-white px-1 mt-2 rounded-md bg-opacity-50"
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
      return isNaN(width) ? 0 : Math.round(width * 100)
    },
  },
}
</script>

<style scoped></style>
