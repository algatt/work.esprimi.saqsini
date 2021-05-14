<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700"> <slot></slot></span>
    <input
      v-bind="$attrs"
      class="border-2 border-gray-200 rounded py-1.5 px-2 focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
      :class="[
        error ? 'border-red-600' : null,
        color ? `focus:border-${color}-600` : `focus:border-primary`,
      ]"
      :value="value"
      v-on="$listeners"
      @input="$emit('update', $event.target.value)"
    />
    <span v-if="error" class="text-sm text-red-600 px-1 py-1">
      {{ error }}
    </span>
  </div>
</template>

<script>
export default {
  name: 'InputBase',
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    error: {
      type: String,
      required: false,
      default: null,
    },
    color: {
      type: String,
      default: null,
    },
    value: {
      type: [String, Number],
      default: '',
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
