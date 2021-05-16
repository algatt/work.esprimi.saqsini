<template>
  <LPopupMenu>
    <template #icon>
      <l-button :color="color"
        ><span class="hidden md:flex items-center"
          >Selection
          <span
            v-if="howManySelected > 0"
            class="ml-2 rounded-lg bg-white text-sm flex items-center px-1 font-semibold bg-opacity-75"
            :class="color ? `text-${color}-600` : `text-primary`"
            >{{ howManySelected }}</span
          ></span
        >
        <span class="flex md:hidden"
          ><i class="fas fa-clipboard-list fa-fw"></i></span
        ><template #rightIcon><i class="fas fa-caret-down fa-fw"></i></template
      ></l-button>
    </template>
    <template #menu>
      <button v-if="enableClear" @click="$emit('clear')">
        <i class="fas fa-list-ul fa-fw"></i>Clear Selection
      </button>
      <button v-if="enableSelect" @click="$emit('selectAll')">
        <i class="fas fa-check-double"></i>Select All
      </button>
      <button v-if="enableDelete" @click="$emit('deleteAll')">
        <i class="fas fa-trash-alt fa-fw"></i>
        Delete {{ howManySelected }}
        <template v-if="howManySelected === 1">Item</template
        ><template v-else>Items</template>
      </button>
    </template>
  </LPopupMenu>
</template>

<script>
export default {
  name: 'SelectionDeleteClearButton',

  props: {
    enableClear: {
      type: Boolean,
      default: true,
    },
    enableSelect: {
      type: Boolean,
      default: true,
    },
    enableDelete: {
      type: Boolean,
      default: true,
    },
    color: {
      type: String,
      default: null,
    },
    howManySelected: {
      type: Number,
      required: true,
    },
  },
}
</script>

<style scoped></style>
