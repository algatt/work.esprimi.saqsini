<template>
  <span class="text-sm rounded px-1.5 py-0.5 border" :class="badgeStyle"
    ><slot></slot
  ></span>
</template>

<script>
export default {
  name: 'BadgeBase',
  props: {
    bgColour: {
      type: String,
      required: false,
      default: 'gray',
    },
  },
  computed: {
    colour() {
      return `${this.bgColour}-100`
    },
    colourDarker() {
      return `${this.bgColour}-200`
    },
    badgeStyle() {
      return `bg-${this.colour} border-${this.colourDarker} text-${this.bgColour}-800`
    },
  },
}
</script>

<style scoped></style>
