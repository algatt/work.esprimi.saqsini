<template>
  <div class="frosted">
    <div
      class="check-height mx-auto bg-white rounded-none md:border md:border-gray-100 shadow-md overflow-y-auto relative w-full"
      :class="customWidth"
      @click.stop
    >
      <div
        class="bg-primary p-4 text-white text-lg sticky top-0 left-0 z-30 flex items-center"
        style="height: 50px"
      >
        <h5>
          <slot name="title"></slot>
          <span v-if="!$slots.title && currentItemToBeEdited.code === -1"
            >New <slot name="secondTitle"></slot
          ></span>
          <span v-if="!$slots.title && currentItemToBeEdited.code !== -1"
            >Edit <slot name="secondTitle"></slot
          ></span>
        </h5>
      </div>

      <div class="flex p-5 items-stretch" style="height: calc(100% - 50px)">
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EditObjectModal',
  props: {
    customWidth: {
      type: String,
      required: false,
      default: 'md:w-8/12',
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
