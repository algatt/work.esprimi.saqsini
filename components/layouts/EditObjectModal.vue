<template>
  <div class="frosted p-0 md:p-8">
    <div
      class="check-height w-full self-start h-screen md:h-auto md:w-6/12 mx-auto flex flex-col bg-white relative rounded-none md:rounded-lg md:border md:border-gray-100 shadow-md"
      @click.stop
    >
      <div
        class="bg-primary p-3 text-white text-lg rounded-none md:rounded-t-lg"
      >
        <h5 class="pl-2">
          <slot name="title"></slot>
          <span v-if="!$slots.title && currentItemToBeEdited.code === -1"
            >New</span
          >
          <span v-if="!$slots.title && currentItemToBeEdited.code !== -1"
            >Edit</span
          >
        </h5>
      </div>
      <div class="flex flex-col p-5 overflow-y-auto">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditObjectModal',
  computed: {
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
  },
  mounted() {
    this.$store.dispatch('emptySelectedItems')
    document.documentElement.style.overflow = 'hidden'
    document.body.scroll = 'no'
  },
  destroyed() {
    document.documentElement.style.overflow = 'visible'
    document.body.scroll = 'yes'
    this.$emit('modalClosed')
  },
  methods: {
    cancelCurrentItem() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
    },
  },
}
</script>

<style></style>
