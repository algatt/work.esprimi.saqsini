<template>
  <div @click="$emit('selectQuestion', question)">
    {{ question }}
  </div>
</template>

<script>
export default {
  name: 'DisplayQuestion',
  props: {
    question: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped></style>