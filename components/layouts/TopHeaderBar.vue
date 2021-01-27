<template>
  <div
    class="w-full flex-wrap justify-between items-center h-auto p-4 flex fixed xl:relative bottom-0 right-0"
  >
    <h6 class="hidden xl:flex xl:w-auto text-2xl font-semibold">
      <slot name="title"> </slot>
    </h6>
    <div class="flex w-full xl:w-auto justify-end items-center">
      <template v-if="selectedItems === 0">
        <slot name="button"></slot
      ></template>
      <template v-else
        ><button class="btn btn-primary mr-2" @click="emptySelectedItems">
          Clear Selection
        </button>
        <button class="btn btn-danger mr-2" @click="showModal = true">
          Delete
          <span v-if="selectedItems === 1">{{ selectedItems }} item</span>
          <span v-else-if="selectedItems > 1">{{ selectedItems }} items</span>
        </button>
      </template>
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
  },
  data() {
    return {
      showModal: false,
    }
  },
  computed: {
    selectedItems() {
      return this.$store.state.selectedItems.length
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
  },
}
</script>

<style scoped></style>
