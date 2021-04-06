<template>
  <div
    class="flex flex-wrap relative justify-between items-center w-full xl:h-16"
    :class="$slots.extraContent ? 'h-16' : 'h-0'"
  >
    <div class="flex items-center">
      <h6 v-if="$slots.title" class="hidden xl:flex xl:w-auto">
        <slot name="title"> </slot>
      </h6>
      <div v-if="$slots.extraContent" class="w-full xl:w-auto">
        <slot name="extraContent"> </slot>
      </div>
    </div>
    <div class="flex flex-1 justify-end">
      <div
        class="flex fixed right-0 bottom-0 items-center pr-5 pb-5 lg:relative lg:p-0 z-20"
      >
        <div class="flex items-center">
          <slot name="extraButtons"></slot>
        </div>
        <div v-if="!hideMenu">
          <popup-menu class="ml-2"
            ><template v-slot:icon>
              <button-icon class="hidden lg:block"
                ><slot name="menuText"></slot>
                <template v-if="!$slots.menuText">Actions</template>
                <template v-slot:icon
                  ><i class="fas fa-caret-down"></i></template
              ></button-icon>
              <button-icon-rounded class="block lg:hidden">
                <i class="fas fa-ellipsis-v fa-fw"></i
              ></button-icon-rounded>
            </template>
            <template v-slot:menu>
              <template v-if="selectedItems === 0">
                <span v-if="!hideSelectAll" @click="selectAll"
                  ><i class="mr-1 fas fa-check-double fa-fw"></i>Select
                  All</span
                >
              </template>
              <template v-else>
                <span @click="emptySelectedItems"
                  ><i class="mr-1 fas fa-check-double fa-fw"></i> Clear
                  Selection</span
                >
                <span v-if="!hideDelete" @click="showModal = true"
                  ><i class="mr-1 fas fa-trash-alt fa-fw"></i>Delete
                  <template v-if="selectedItems === 1"
                    >{{ selectedItems }} item</template
                  >
                  <template v-else-if="selectedItems > 1"
                    >{{ selectedItems }} items</template
                  >
                </span>
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
import PopupMenu from '~/components/elements/PopupMenu'
import ButtonIcon from '~/components/elements/ButtonIcon'
import ButtonIconRounded from '~/components/elements/ButtonIconRounded'
export default {
  name: 'TopHeaderBar',
  components: {
    ButtonIconRounded,
    ButtonIcon,
    ModalConfirm,
    PopupMenu,
  },
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
      default: () => {
        return []
      },
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
    selectAll() {
      this.$store.dispatch('selectedItemsManageAll', this.items)
    },
  },
}
</script>
