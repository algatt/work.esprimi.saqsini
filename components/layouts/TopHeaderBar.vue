<template>
  <div
    class="w-full flex flex-wrap justify-between items-center h-auto bg-gray-100 py-3 px-2 md:mb-2"
  >
    <h6
      class="w-full md:w-auto text-lg font-semibold"
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
        ><button class="btn-primary mr-2" @click="emptySelectedItems">
          Clear Selection
        </button>
        <button class="btn-danger mr-2" @click="showModal = true">
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
    hasSideNav: {
      type: Array,
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
      this.$store.dispatch('deleteSelectedItems', this.which).then(() => {
        this.showModal = false
      })
    },
  },
}
</script>

<style scoped></style>
