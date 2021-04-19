<template>
  <button-basic :colour="colour" @click="buttonClick" v-on="$listeners">
    <template v-slot:default
      ><slot></slot
      ><span v-if="animated" class="pl-2"><slot name="rightIcon"></slot></span
    ></template>
  </button-basic>
</template>

<script>
import ButtonBasic from '~/components/elements/ButtonBasic'
export default {
  name: 'ButtonAnimated',
  components: { ButtonBasic },
  props: {
    colour: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  data() {
    return {
      animated: false,
    }
  },
  methods: {
    buttonClick() {
      this.animated = true
    },
  },
}
</script>

<style scoped></style>
