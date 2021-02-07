<template>
  <div
    class="w-full flex-wrap justify-between items-center flex relative h-auto lg:h-24"
  >
    <div class="flex">
      <h6
        v-if="$slots.title"
        class="hidden xl:flex xl:w-auto text-lg font-semibold text-gray-700"
      >
        <slot name="title"> </slot>
      </h6>
      <h6
        v-if="$slots.smallTitle"
        class="flex xl:hidden w-full text-lg font-semibold text-gray-700"
      >
        <slot name="smallTitle"></slot>
      </h6>
      <div v-if="$slots.extraContent" class="w-full xl:w-auto">
        <slot name="extraContent"> </slot>
      </div>

      <div v-if="!$slots.title && !$slots.extraContent && !$slots.smallTitle">
        &nbsp;
      </div>
    </div>
    <div class="flex flex-1 justify-end">
      <div
        class="flex fixed bottom-0 right-0 pb-5 pr-5 lg:relative lg:p-0 items-center"
      >
        <div class="flex items-center">
          <slot name="extraButtons"></slot>
        </div>
        <div v-if="!hideMenu">
          <popup-menu class="ml-2">
            <template v-slot:menuButton
              ><button class="hidden lg:flex items-center btn btn-primary">
                <span>Actions<i class="fas fa-caret-down fa-fw ml-1"></i></span>
              </button>
              <button class="flex lg:hidden btn btn-round-primary">
                <span><i class="fas fa-ellipsis-v fa-fw"></i></span></button
            ></template>
            <template v-slot:menuItems>
              <template v-if="selectedItems === 0">
                <button v-if="!hideSelectAll" class="w-full" @click="selectAll">
                  <span class="popup-menu-button"
                    ><i class="fas fa-check-double fa-fw mr-1"></i>Select
                    All</span
                  >
                </button>
              </template>
              <template v-else>
                <button
                  ref="clearAll"
                  class="w-full"
                  @click="emptySelectedItems"
                >
                  <span class="popup-menu-button"
                    ><i class="fas fa-check-double fa-fw mr-1"></i> Clear
                    Selection</span
                  >
                </button>
                <button
                  v-if="!hideDelete"
                  class="w-full"
                  @click="showModal = true"
                >
                  <span class="popup-menu-button"
                    ><i class="fas fa-trash-alt fa-fw mr-1"></i>Delete&nbsp;
                    <span v-if="selectedItems === 1"
                      >{{ selectedItems }} item</span
                    >
                    <span v-else-if="selectedItems > 1"
                      >{{ selectedItems }} items</span
                    >
                  </span>
                </button>
                <slot name="menuButtonIfSelected"></slot>
              </template>
              <slot name="menuButtonIfNotSelected"></slot>
            </template>
          </popup-menu>
        </div>
      </div>
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
    hideMenu: {
      type: Boolean,
      default: false,
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
