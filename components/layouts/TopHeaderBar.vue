<template>
  <div
    class="w-full flex-wrap justify-between items-center h-16 flex relative px-2"
  >
    <h6
      v-if="$slots.title"
      class="hidden xl:flex xl:w-auto text-2xl font-semibold pl-2"
    >
      <slot name="title"> </slot>
    </h6>
    <div v-else class="w-full xl:w-auto">
      <slot name="extraContent"> </slot>
    </div>

    <div
      class="flex w-full xl:w-auto justify-end items-center space-x-2 fixed bottom-0 right-0 xl:relative z-10 p-3 xl:p-0"
    >
      <template v-if="selectedItems === 0">
        <button
          v-if="!hideSelectAll"
          class="btn btn-primary"
          @click="selectAll"
        >
          Select All
        </button>
      </template>
      <template v-else>
        <button
          v-if="!hideDelete"
          class="btn btn-danger"
          @click="showModal = true"
        >
          Delete
          <span v-if="selectedItems === 1">{{ selectedItems }} item</span>
          <span v-else-if="selectedItems > 1">{{ selectedItems }} items</span>
        </button>
        <button
          ref="clearAll"
          class="btn btn-primary"
          @click="emptySelectedItems"
        >
          Clear Selection
        </button>
      </template>
      <slot name="button"></slot>
    </div>

    <modal-confirm
      v-if="showModal"
      @cancel="showModal = false"
      @confirm="deleteSelectedItems"
    >
      <template v-slot:title>Warning</template>
      <template v-slot:message
        ><p>
          You are deleting
          <template v-if="selectedItems === 1">this record. </template>
          <template v-else> {{ selectedItems }} items.</template>
        </p>
        <p>Are you sure?</p>
      </template>
    </modal-confirm>
  </div>
</template>

<script>
import ModalConfirm from '~/components/layouts/ModalConfirm'
export default {
  name: 'TopHeaderBar',
  components: { ModalConfirm },
  props: {
    which: {
      type: String,
      required: true,
    },
    hideDelete: {
      type: Boolean,
      default: false,
    },
    hideSelectAll: {
      type: Boolean,
      default: false,
    },
    items: {
      type: Array,
      required: false,
    },
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    selectedItems() {
      const x = this.$store.state.selectedItems.length
      this.$nextTick(() => {
        if (x > 0) this.$refs.clearAll.focus()
      })
      return x
    },
  },
  methods: {
    emptySelectedItems() {
      this.$store.dispatch('emptySelectedItems')
    },

    deleteSelectedItems() {
      this.$store.dispatch('deleteSelectedItems', this.which).then(() => {
        this.showModal = false
      })
    },
    selectAll() {
      this.$store.dispatch('selectedItemsManageAll', this.items)
    },
  },
}
</script>

<style scoped></style>
