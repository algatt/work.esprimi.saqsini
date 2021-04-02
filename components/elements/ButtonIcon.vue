<template>
  <ButtonBase :bg-colour="bgColour" :variant="variant" :disabled="disabled"
    ><template v-slot:default><slot></slot></template
    ><template v-slot:extra><slot name="icon"></slot></template
  ></ButtonBase>
</template>

<script>
import ButtonBase from '~/components/elements/ButtonBase'
export default {
  name: 'ButtonIcon',
  components: { ButtonBase },
  props: {
    bgColour: {
      type: String,
      required: false,
      default: 'blue',
    },
    variant: {
      type: String,
      required: false,
      default: 'normal',
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
}
</script>

<style scoped></style>
