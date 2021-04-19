<template>
  <div class="mt-5 flex space-x-4">
    <button-basic :disabled="true" @click="clickButton"
      >This is my button
    </button-basic>
    <button-basic colour="red"
      ><template v-slot:leftIcon><i class="fas fa-times fa-fw"></i></template>My
      Button 2
    </button-basic>
    <button-basic colour="green"
      >This is my button
      <template v-slot:rightIcon><i class="fas fa-times fa-fw"></i></template
    ></button-basic>
  </div>
</template>

<script>
export default {
  name: 'TestVue',

  methods: {
    clickButton() {
      alert('cl' + '')
    },
  },
}
</script>

<style scoped></style>
