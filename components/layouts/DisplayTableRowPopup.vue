<template>
  <popup-menu @close="$emit('close')"
    ><template v-slot:icon
      ><button-icon-rounded bg-colour="gray"
        ><i class="fas fa-ellipsis-v fa-fw fa-sm"></i></button-icon-rounded
    ></template>
    <template v-slot:menu> <slot name="menu"></slot> </template
  ></popup-menu>
</template>

<script>
import PopupMenu from '~/components/elements/PopupMenu'
import ButtonIconRounded from '~/components/elements/ButtonIconRounded'
export default {
  name: 'DisplayTableRowPopup',
  components: { PopupMenu, ButtonIconRounded },
}
</script>

<style scoped></style>
