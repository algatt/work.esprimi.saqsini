<template>
  <LPopupMenu>
    <template #icon>
      <l-button :color="color"
        >Selection<template #rightIcon
          ><i class="fas fa-caret-down fa-fw"></i></template
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
        Delete All
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
  },
}
</script>

<style scoped></style>
