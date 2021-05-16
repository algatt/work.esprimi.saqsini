<template>
  <div>
    <nuxt-link
      :to="{ name: item.link }"
      class="hidden px-4 py-2 md:flex flex-col text-white text-sm my-1 hover:bg-white rounded transition duration-300"
      :class="color ? `hover:text-${color}-600` : `hover:text-primary`"
      @click.native="$emit('click')"
    >
      <span class="flex items-center"
        ><i :class="item.icon" class="w-6 text-left"></i>{{ item.header }}</span
      >
      <span class="flex flex-wrap text-xs text-left w-48 pl-6 mt-1">{{
        item.text
      }}</span>
    </nuxt-link>
    <nuxt-link
      :to="{ name: item.link }"
      class="block md:hidden mb-2 py-1 px-2 rounded hover:bg-white transition duration-300 flex justify-between items-center"
      :class="color ? `hover:text-${color}-600` : `hover:text-primary`"
      style="min-width: 10rem"
      @click.native="$emit('click')"
    >
      <span class="w-6"><i :class="item.icon"></i></span>
      <span class="w-full pl-3 text-left">{{ item.header }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'MenuChild',
  props: {
    item: {
      type: Object,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
  },
}
</script>

<style scoped></style>
