<template>
  <div class="flex flex-col md:pr-3 py-2 md:py-0 w-full">
    <!-- title part -->
    <div class="font-semibold mb-2">
      <slot name="default"></slot>
    </div>

    <!-- start tree -->
    <TreeViewElement
      :is-chosen="!whichParentIsChosen"
      :color="color"
      @click="chooseParent($event)"
      >All</TreeViewElement
    >
    <TreeViewElement
      v-for="parent in items"
      :key="parent.code"
      class="pl-7"
      :is-chosen="
        whichParentIsChosen &&
        whichParentIsChosen.code === parent.code &&
        !whichChildIsChosen
      "
      :color="color"
      :count-field="countField"
      :item="parent"
      @click="chooseParent($event)"
      @save="$emit('updateParent', parent.code, $event)"
      @delete="deleteParent"
    >
      <template #children>
        <div
          class="flex flex-col"
          :class="
            whichParentIsChosen && whichParentIsChosen.code === parent.code
              ? 'h-full '
              : 'h-0 overflow-hidden'
          "
        >
          <TreeViewElement
            v-for="child in parent.children"
            :key="child.code"
            class="pl-7"
            :is-chosen="
              whichChildIsChosen && whichChildIsChosen.code === child.code
            "
            :color="color"
            :count-field="countField"
            :item="child"
            @click="chooseChild($event)"
            @save="$emit('updateChild', child.code, $event)"
            @delete="deleteChild(child.code)"
          ></TreeViewElement>

          <tree-view-element-new
            class="pl-7"
            :is-chosen="showNewChildInput === parent.code"
            :item="{ name: `New ${childName}`, code: null }"
            @click="showNewChildInput = parent.code"
            @save="
              $emit('saveChild', $event)
              showNewChildInput = false
            "
            @cancel="showNewChildInput = false"
          ></tree-view-element-new></div></template
    ></TreeViewElement>

    <tree-view-element-new
      class="pl-7"
      :is-chosen="showNewParentInput"
      :item="{ name: `New ${parentName}`, code: null }"
      @click="showNewParentInput = true"
      @save="
        $emit('saveParent', $event)
        showNewParentInput = false
      "
      @cancel="showNewParentInput = false"
    ></tree-view-element-new>
  </div>
</template>

<script>
import ConfirmModal from '@/components/elements/ConfirmModal'
import ModalService from '@/services/modal-services'
import TreeViewElement from '~/components/elements/TreeView/TreeViewElement'
import TreeViewElementNew from '~/components/elements/TreeView/TreeViewElementNew'
export default {
  name: 'TreeView',
  components: { TreeViewElement, TreeViewElementNew },
  props: {
    items: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: null,
    },
    countField: {
      type: String,
      default: null,
    },
    parentName: {
      type: String,
      default: 'Item',
    },
    childName: {
      type: String,
      default: 'Item',
    },
  },
  data() {
    return {
      whichParentIsChosen: null,
      whichChildIsChosen: null,
      showNewParentInput: false,
      showNewChildInput: false,
    }
  },
  computed: {
    totalCount() {
      return this.items.reduce((accumulator, currentValue) => {
        return accumulator + Number(currentValue[this.countField])
      }, 0)
    },
  },

  methods: {
    chooseParent(parent) {
      this.whichParentIsChosen = parent
      this.whichChildIsChosen = null
      this.$emit('changedOption', {
        parent: this.whichParentIsChosen,
        child: this.whichChildIsChosen,
      })
    },
    chooseChild(code) {
      this.whichChildIsChosen = code
      this.$emit('changedOption', {
        parent: this.whichParentIsChosen,
        child: this.whichChildIsChosen,
      })
    },

    deleteParent(code) {
      ModalService.open(ConfirmModal, {
        msg: `You are deleting ${this.parentName} ${this.whichParentIsChosen.name}`,
      }).then(() => {
        this.$emit('deleteParent', code)
        this.chooseParent(null)
      })
    },
    deleteChild(code) {
      ModalService.open(ConfirmModal, {
        msg: `You are deleting ${this.childName} ${this.whichChildIsChosen.name}`,
      }).then(() => {
        this.$emit('deleteChild', code)
      })
    },
  },
}
</script>

<style scoped></style>
