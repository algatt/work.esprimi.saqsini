<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700"> <slot></slot></span>
    <textarea
      :placeholder="placeholder"
      class="border-2 border-gray-200 rounded py-1.5 px-2 focus:border-primary focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
      :class="error ? 'border-red-600' : null"
      :disabled="disabled"
      :value="value"
      @input="updateValue($event.target.value)"
      @blur="$emit('blur')"
    />
    <span v-if="error" class="error">
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'TextAreaBase',
  props: {
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
      type: String,
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
