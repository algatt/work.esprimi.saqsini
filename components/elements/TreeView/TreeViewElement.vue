<template>
  <div class="flex flex-col w-full">
    <div class="flex justify-between items-center">
      <span
        class="flex flex-1 cursor-pointer transition duration-300 font-medium"
        :class="`hover:text-${color}-600`"
        @click="$emit('click', item)"
        ><span class="flex items-center relative flex-1">
          <i
            v-if="isChosen"
            class="far fa-folder-open fa-fw"
            :class="`text-${color}-600`"
          ></i>
          <i v-else class="far fa-folder fa-fw text-gray-300"></i>
          <TreeViewInput
            id="treeViewElementInput"
            :name="item.name"
            :is-editable="isEditable"
            @save="save($event)"
            @cancel="cancel"
          ></TreeViewInput> </span
      ></span>

      <span class="flex items-center space-x-2">
        <button
          v-if="isChosen && !isEditable && item.code"
          class="text-gray-300 hover:text-blue-600 transition duration-300 focus:outline-none"
          :class="`hover:text-${color}-600`"
          @click.stop="setEditable"
        >
          <i class="far fa-edit fa-sm fa-fw"></i>
        </button>
        <button
          v-if="isChosen && !isEditable && item.code"
          class="text-gray-300 hover:text-red-600 transition duration-300 focus:outline-none"
          @click.stop="$emit('delete', item.code)"
        >
          <i class="far fa-trash-alt fa-sm fa-fw"></i>
        </button>
        <badge-base v-if="item.code !== null" size="xs">{{
          item[countField]
        }}</badge-base></span
      >
    </div>
    <div>
      <slot name="children"></slot>
    </div>
  </div>
</template>

<script>
import BadgeBase from '~/components/elements/BadgeBase'
import TreeViewInput from '~/components/elements/TreeView/TreeViewInput'
export default {
  name: 'TreeViewElement',
  components: { TreeViewInput, BadgeBase },
  props: {
    isChosen: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: 'blue',
    },
    item: {
      type: Object,
      required: false,
      default: () => {
        return { code: null, name: 'All' }
      },
    },
    countField: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isEditable: false,
    }
  },

  methods: {
    setEditable() {
      this.isEditable = true
      this.$nextTick(() => {
        document.getElementById('treeViewElementInput').focus()
      })
    },
    save(name) {
      this.isEditable = false
      this.$emit('save', name)
    },

    cancel() {
      this.isEditable = false
    },
  },
}
</script>

<style scoped></style>
