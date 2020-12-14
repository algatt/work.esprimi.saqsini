<template>
  <div class="flex flex-col">
    <label v-if="$slots.label" class="label"><slot name="label"></slot></label>
    <div class="flex items-center space-x-2">
      <p><slot name="leftLabel"></slot></p>
      <div
        class="w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out"
        :class="
          toggleActive
            ? 'bg-primary'
            : changeColour
            ? 'bg-gray-300'
            : 'bg-primary'
        "
        @click="
          toggleActive = !toggleActive
          $emit('clicked', toggleActive)
        "
      >
        <div
          class="bg-white w-4 h-4 rounded-full shadow-md transform duration-300 ease-in-out"
          :class="{ 'translate-x-4': toggleActive }"
        ></div>
      </div>
      <p><slot name="rightLabel"></slot></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToggleSwitch',
  props: {
    checked: {
      required: false,
      type: Boolean,
      default: false,
    },
    changeColour: {
      required: false,
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      toggleActive: false,
    }
  },
  mounted() {
    this.toggleActive = this.checked
  },
}
</script>

<style scoped></style>
