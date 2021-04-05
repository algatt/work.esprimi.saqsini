<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700"> <slot></slot></span>
    <select
      class="border-2 border-gray-200 rounded py-1.5 px-2 focus:border-primary focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
      :disabled="disabled"
      @change="updateValue($event.target.value)"
    >
      <slot name="options"></slot>
    </select>
  </div>
</template>

<script>
export default {
  name: 'SelectBase',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },

    value: {
      type: [String, Number, Boolean],
      required: false,
      default: () => {
        return undefined
      },
    },
  },
  methods: {
    updateValue(value) {
      this.$emit('input', isNaN(value) ? value : Number(value))
    },
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
