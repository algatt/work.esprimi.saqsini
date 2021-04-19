<template>
  <button
    class="border rounded text-white flex items-center shadow transition duration-300 disabled:bg-gray-300 disabled:border-gray-400 focus:ring-1 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed focus:transition focus:duration-300"
    :class="bgColour"
    v-on:="$listeners"
    @click="$emit('click')"
  >
    <span
      v-if="$slots.leftIcon"
      class="py-1 px-0.5"
      :class="isDisabled ? 'bg-gray-300' : `bg-${hoverColour}`"
      ><slot name="leftIcon"></slot
    ></span>
    <span class="font-medium py-1 px-2 flex-1"><slot></slot></span>
    <span
      v-if="$slots.rightIcon"
      class="py-1 px-0.5"
      :class="isDisabled ? 'bg-gray-300' : `bg-${hoverColour}`"
      ><slot name="rightIcon"></slot
    ></span>
  </button>
</template>

<script>
export default {
  name: 'ButtonBasic',
  props: {
    colour: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  data() {
    return {
      baseNumber: 600,
      hoverNumber: 700,
    }
  },
  computed: {
    baseColour() {
      return `${this.colour}-${this.baseNumber}`
    },
    hoverColour() {
      return `${this.colour}-${this.hoverNumber}`
    },
    bgColour() {
      return `bg-${this.baseColour} hover:bg-${this.hoverColour} border-${this.hoverColour} focus:ring-${this.hoverColour}`
    },
    isDisabled() {
      return this.$attrs.disabled ? this.$attrs.disabled : false
    },
  },
  mounted() {
    if (this.colour === 'gray') {
      this.baseNumber -= 200
      this.hoverNumber -= 200
    }
  },
}
</script>

<style scoped></style>
