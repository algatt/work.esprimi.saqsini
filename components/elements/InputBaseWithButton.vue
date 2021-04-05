<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700"> <slot></slot></span>
    <div class="w-full relative flex items-stretch rounded">
      <input
        :type="type"
        :placeholder="placeholder"
        class="flex w-full border-2 border-gray-200 rounded-l py-1.5 px-2 focus:border-primary focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
        :class="error ? 'border-red-600' : null"
        :disabled="disabled"
        :value="value"
        @input="updateValue($event.target.value)"
        @keyup="$emit('keyup', $event.target.value)"
      />

      <div
        class="flex items-stretch justify-items-stretch border-t-2 border-r-2 border-b-2 border-grey-200 rounded-r"
      >
        <slot name="button"></slot>
      </div>
    </div>
    <span v-if="error" class="error">
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputBase',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    disabled: {
      type: Boolean,
      default: false,
    },

    placeholder: {
      type: String,
      required: false,
      default: '',
    },
    error: {
      type: String,
      required: false,
      default: null,
    },
    value: {
      type: [String, Number],
      required: false,
      default: () => {
        return undefined
      },
    },
  },

  methods: {
    updateValue(value) {
      this.$emit('input', value)
    },
  },
}
</script>

<style scoped></style>
