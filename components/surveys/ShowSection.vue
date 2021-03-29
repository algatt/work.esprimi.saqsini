<template>
  <div class="flex flex-col">
    <div class="flex">
      <p :style="{ color: displayStyle.textColour }">{{ question.text }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ShowSection',
  props: {
    question: {
      required: true,
      type: Object,
    },
    displayStyle: {
      type: Object,
      required: true,
      default: () => {
        return {}
      },
    },
  },

  methods: {
    addToAnswer(value) {},
  },
}
</script>

<style scoped></style>
