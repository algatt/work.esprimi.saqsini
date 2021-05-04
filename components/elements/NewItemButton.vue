<template>
  <button-base :color="color" v-on="$listeners"
    ><slot></slot>
    <template #rightIcon> <i class="fas fa-plus fa-fw"></i></template
  ></button-base>
</template>

<script>
import ButtonBase from '~/components/elements/ButtonBasic'
export default {
  name: 'NewItemButton',
  components: { ButtonBase },
  props: {
    color: {
      type: String,
      default: 'blue',
    },
  },
}
</script>

<style scoped></style>
