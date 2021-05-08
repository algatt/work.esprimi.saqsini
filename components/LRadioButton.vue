<template>
  <div
    class="flex items-center justify-center transition duration-300 rounded-full border-gray-300 border-4 w-5 h-5 shadow-sm relative"
    :class="clicked ? `bg-${color}-600` : 'bg-gray-50'"
    @click.stop="clickToggle()"
  ></div>
</template>

<script>
export default {
  name: 'LRadioButton',
  props: {
    color: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  data() {
    return {
      clicked: false,
    }
  },
  methods: {
    clickToggle() {
      this.clicked = !this.clicked
      this.$emit('click', this.clicked)
    },
  },
}
</script>

<style scoped></style>
