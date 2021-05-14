<template>
  <l-button :color="color" v-on="$listeners"
    ><slot></slot>
    <template #rightIcon> <i class="fas fa-plus fa-fw"></i></template
  ></l-button>
</template>

<script>
export default {
  name: 'NewItemButton',
  props: {
    color: {
      type: String,
      default: null,
    },
  },
}
</script>

<style scoped></style>
