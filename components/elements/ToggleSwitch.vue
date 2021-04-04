<template>
  <div class="flex flex-col">
    <label
      v-if="$slots.label"
      class="flex items-center font-semibold mb-2 text-gray-700"
      ><slot name="label"></slot
    ></label>
    <div class="flex items-center space-x-2">
      <p><slot name="leftLabel"></slot></p>
      <div
        class="w-10 h-5 flex items-center rounded-full p-1 duration-300 ease-in-out cursor-pointer"
        :class="buttonStyle"
        @click.stop="
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
    bgColour: {
      required: false,
      type: String,
      default: 'blue',
    },
  },
  data() {
    return {
      toggleActive: false,
    }
  },
  computed: {
    colourNumber() {
      return this.bgColour === 'gray' ? 300 : 600
    },
    colour() {
      return `${this.bgColour}-${this.colourNumber}`
    },
    colourDarker() {
      return `${this.bgColour}-${this.colourNumber + 100}`
    },
    buttonStyle() {
      if (this.disabled) return `bg-gray-300 border-gray-300 text-gray-200`
      else
        return `bg-${this.toggleActive ? this.colour : 'gray-300'} border-${
          this.colourDarker
        } focus:ring-${this.colour}  focus:bg-${this.colourDarker}`
    },
  },
  mounted() {
    this.toggleActive = this.checked
  },
}
</script>

<style scoped></style>

<!--
:class="
          toggleActive
            ? 'bg-primary'
            : changeColour
            ? 'bg-gray-300'
            : 'bg-primary'
        "
-->
