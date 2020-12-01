<template>
  <div
    class="w-11/12 mx-auto flex flex-wrap justify-between px-1 h-16 items-center mb-3 md:mb-0"
  >
    <h6 class="text-lg w-full md:w-8/12 mb-1 md:mb-0">
      <slot name="title"> </slot>
    </h6>
    <div
      v-if="selectedItems === 0"
      class="w-full md:w-4/12 flex justify-start md:justify-end"
    >
      <slot name="button"></slot>
    </div>
    <div v-else>
      <button class="btn-round-primary mr-2" @click="emptySelectedItems">
        <i class="fas fa-times fa-fw"></i>
      </button>
      <button class="btn-round-danger mr-2" @click="showModal = true">
        <i class="far fa-trash-alt fa-fw"></i>
      </button>
      <span v-if="selectedItems === 1">{{ selectedItems }} item selected</span>
      <span v-else-if="selectedItems > 1"
        >{{ selectedItems }} items selected</span
      >
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
      this.$store.dispatch('deleteSelectedItems', this.which)
    },
  },
}
</script>

<style scoped></style>
