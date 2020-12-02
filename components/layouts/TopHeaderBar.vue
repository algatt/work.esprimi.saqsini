<template>
  <div
    class="w-full flex flex-wrap justify-between items-center h-auto md:h-10 mb-3"
  >
    <h6
      class="w-full md:w-auto text-lg"
      :class="hasSideNav ? 'pl-0' : 'pl-0 md:pl-3'"
    >
      <slot name="title"> </slot>
    </h6>
    <div
      class="flex justify-start w-full md:w-auto md:justify-end pt-2 md:pt-0 items-center"
    >
      <template v-if="selectedItems === 0">
        <slot name="button"></slot
      ></template>
      <template v-else
        ><button class="btn-round-primary mr-2" @click="emptySelectedItems">
          <i class="fas fa-times fa-fw"></i>
        </button>
        <button class="btn-round-danger mr-2" @click="showModal = true">
          <i class="far fa-trash-alt fa-fw"></i>
        </button>
        <span v-if="selectedItems === 1"
          >{{ selectedItems }} item selected</span
        >
        <span v-else-if="selectedItems > 1"
          >{{ selectedItems }} items selected</span
        ></template
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
    hasSideNav: {
      type: Object,
      required: false,
      default: null,
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
