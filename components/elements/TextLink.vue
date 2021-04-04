<template>
  <button
    class="font-semibold border-b border-transparent transition duration-300 cursor-pointer focus:outline-none active:outline-none focus:ring-0"
    :class="linkColour"
    @click="$emit('click')"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'TextLink',
  props: {
    colour: {
      type: String,
      required: false,
      default: 'primary',
    },
  },
  computed: {
    linkColour() {
      if (this.colour === 'primary')
        return `text-primary hover:border-primary hover:text-primary-darker`
      return `text-${this.colour}-500 hover:border-${this.colour}-500 hover:text-${this.colour}-600`
    },
  },
}
</script>

<style scoped></style>
