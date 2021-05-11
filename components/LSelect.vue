<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700"> <slot></slot></span>
    <select
      v-model="selectedOption"
      class="border-2 border-gray-200 rounded py-1.5 pl-2 pr-7 focus:border-primary focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
      :disabled="disabled"
      @input="
        $emit(
          'input',
          isNaN($event.target.value)
            ? $event.target.value
            : Number($event.target.value)
        )
      "
    >
      <option v-if="value === undefined" :value="undefined" selected disabled>
        Select an option
      </option>
      <slot name="options"></slot>
    </select>
  </div>
</template>

<script>
export default {
  name: 'LSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      default: () => {
        return undefined
      },
    },
  },
  data() {
    return {
      selectedOption: null,
    }
  },
  watch: {
    value(newValue) {
      this.selectedOption = newValue
    },
  },
  mounted() {
    this.selectedOption = this.value
  },
}
</script>

<style scoped>
select {
  @apply appearance-none;
  background-image: url('/dropdown.svg');
  background-repeat: no-repeat;
  background-position: right 0.5em top 50%;
  background-size: 1em auto;
}

select option {
  font-family: 'Quicksand', sans-serif;
}
</style>
