<template>
  <div class="frosted p-0 md:p-8">
    <div
      class="check-height mx-auto bg-white rounded-none md:border md:border-gray-100 shadow-md overflow-y-auto relative w-full md:w-10/12"
      @click.stop
    >
      <div
        class="bg-primary p-3 text-white text-lg sticky top-0 left-0 z-30"
        style="height: 50px"
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
      <div class="flex p-5" style="height: calc(100% - 50px)">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditObjectModal',
  props: {
    width: {
      type: String,
      required: false,
      default: 'md:w-6/12',
    },
  },
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
