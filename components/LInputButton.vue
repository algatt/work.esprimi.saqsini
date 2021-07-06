<template>
  <div class="flex flex-col">
    <span class="font-semibold mb-2 text-gray-700">
      <slot name="label"></slot
    ></span>
    <div class="w-full relative flex items-stretch rounded">
      <input
        v-bind="$attrs"
        class="flex w-full border-2 border-gray-200 rounded-l py-1.5 px-2 focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
        :class="[error ? 'border-red-600' : null, `focus:border-${color}-600`]"
        :value="value"
        @input="$emit('update', $event.target.value)"
        @keyup="$emit('keyup', $event.target.value)"
        @blur="$emit('blur')"
        @focus="$emit('focus')"
      />

      <div
        class="flex items-stretch justify-items-stretch border-t-2 border-r-2 border-b-2 border-grey-200 rounded-r"
      >
        <button
          :class="buttonStyle"
          :disabled="buttonDisabled"
          @click="$emit('click')"
        >
          <slot></slot>
        </button>
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
  inheritAttrs: false,
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    color: {
      type: String,
      default: 'blue',
    },
    error: {
      type: String,
      required: false,
      default: null,
    },
    buttonDisabled: {
      type: Boolean,
      default: false,
    },
    buttonColor: {
      type: String,
      default: 'blue',
    },
    value: {
      type: [String, Number],
      required: false,
      default: () => {
        return undefined
      },
    },
  },
  computed: {
    buttonStyle() {
      return `text-${this.buttonColor}-600 bg-gray-100 px-2 hover:text-${this.buttonColor}-700 transition duration-300 disabled:text-gray-400`
    },
  },
}
</script>

<style scoped></style>
