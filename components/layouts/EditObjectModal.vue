<template>
  <div class="frosted p-0 md:p-8">
    <div
      class="check-height w-full self-start h-screen md:h-auto md:w-6/12 mx-auto flex flex-col bg-white relative rounded-none md:rounded-lg md:border md:border-gray-100 shadow-md"
      @click.stop
    >
      <div
        class="bg-primary p-3 text-white text-lg rounded-none md:rounded-t-lg"
      >
        <h6>
          <slot name="title"></slot>
          <span v-if="!$slots.title && currentItemToBeEdited.code === -1"
            >New</span
          >
          <span v-if="!$slots.title && currentItemToBeEdited.code !== -1"
            >Edit</span
          >
        </h6>
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

<style>
.frosted {
  @apply flex fixed top-0 left-0 w-full h-screen;
  background: rgba(255, 255, 255, 0.25);
  box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}

@media only screen and (min-width: 768px) {
  .check-height {
    max-height: 90%;
  }
}

@media only screen and (max-width: 768px) {
  .check-height {
    max-height: 100%;
  }
}
</style>
