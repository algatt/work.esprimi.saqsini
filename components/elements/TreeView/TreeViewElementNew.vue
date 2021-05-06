<template>
  <div class="flex flex-col w-full my-1">
    <div class="flex justify-between items-center">
      <span
        class="flex flex-1 cursor-pointer transition duration-300 font-medium"
        :class="`hover:text-${color}-600`"
        @click="$emit('click', item.code)"
        ><span class="flex items-center relative" @click="setEditable">
          <i v-if="isChosen" class="fas fa-plus fa-fw text-blue-600"></i>
          <i v-else class="fas fa-plus fa-fw text-gray-300"></i>
          <TreeViewInput
            id="treeViewElementInput"
            :name="item.name"
            :is-editable="isEditable"
            @save="save($event)"
            @cancel="cancel"
          ></TreeViewInput> </span
      ></span>
    </div>
  </div>
</template>

<script>
import TreeViewInput from '~/components/elements/TreeView/TreeViewInput'
export default {
  name: 'TreeViewElement',
  components: { TreeViewInput },
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
        return null
      },
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
        const element = document.getElementById('treeViewElementInput')
        element.focus()
        element.select()
      })
    },
    save(name) {
      this.isEditable = false
      this.$emit('save', name)
    },

    cancel() {
      this.isEditable = false
      this.$emit('cancel')
    },
  },
}
</script>

<style scoped></style>
