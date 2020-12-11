<template>
  <div
    class="fixed top-0 left-0 bg-gray-100 bg-opacity-75 w-full h-full z-10 flex items-center justify-center"
    @click="$emit('close')"
  >
    <div class="bg-white flex flex-col shadow-lg rounded w-11/12 md:w-6/12">
      <div class="bg-gray-200 font-semibold p-2 text-gray-700">
        Move {{ question.name }} after
      </div>
      <div class="px-5 py-2">
        <button
          v-for="item in questions"
          :key="item.code"
          class="flex my-2 p-2 transition duration-300 rounded hover:bg-gray-100"
          :class="[
            item.code === question.code
              ? 'cursor-not-allowed'
              : 'cursor-pointer',
            item.flags.includes('SECTION') ? null : 'ml-4',
          ]"
        >
          <p :class="item.code === question.code ? 'italic' : null">
            {{ item.name }}
          </p>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'QuestionMoveMenu',
  props: {
    question: {
      type: Object,
      required: true,
    },
    questions: {
      type: Array,
      required: true,
    },
  },
  computed: {},
}
</script>

<style scoped></style>
