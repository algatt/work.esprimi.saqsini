<template>
  <div class="flex flex-col w-full">
    <h6>{{ dataItem.author.displayName }}</h6>
    <h6>{{ dataItem.author.email }}</h6>
    <p class="mt-3">{{ dataItem.subject }}</p>
    <p class="mt-2 mb-3">{{ dataItem.content }}</p>
    <p v-if="dataItem.linkedEntityTypeFlags.includes('SURVEY')" class="my-2">
      <l-button>
        <nuxt-link
          :to="{
            name: 'questions-id',
            params: { id: dataItem.linkedEntityCode },
          }"
          >Go To Survey</nuxt-link
        ></l-button
      >
    </p>
  </div>
</template>

<script>
export default {
  name: 'ShowNotifications',
  props: {
    dataItem: {
      type: Object,
      required: true,
    },
  },
}
</script>

<style scoped></style>
