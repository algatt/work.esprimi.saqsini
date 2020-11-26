<template>
  <div class="flex flex-col justify-between h-full">
    <div class="flex flex-col">
      <h5 style="font-family: 'Poppins'">Saqsini</h5>
      <button
        v-for="(item, index) in menu"
        :key="'menu' + index"
        class="text-white font-medium tracking-wider py-2 w-full hover:bg-blue-700 active:bg-white active:text-blue-600 transition duration-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-700"
        style="font-family: Poppins"
      >
        <span class="w-10/12 flex items-center justify-between mx-auto">
          <p>{{ item.text }}</p>
          <i :class="item.icon" class="fa-fw"></i
        ></span>
      </button>
    </div>
    <div class="w-full mb-3 text-white flex">
      <span class="w-10/12 mx-auto flex justify-end">
        <button
          class="focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-700"
          @click="$emit('clickToggle')"
        >
          <i
            :class="isHidden ? 'fa-angle-double-left' : 'fa-angle-double-right'"
            class="fas fa-fw h-6 w-6 flex items-center justify-center ring-0 rounded-full transition duration-300 hover:bg-white hover:text-blue-600"
          ></i>
        </button>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    isHidden: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      menu: [
        { text: 'Surveys', link: '', icon: 'far fa-clipboard' },
        { text: 'Contacts', link: '', icon: 'far fa-address-book' },
        { text: 'Companies', link: '', icon: 'far fa-building' },
        { text: 'Accounts', link: '', icon: 'far fa-user-circle' },
        { text: 'Notifications', link: '', icon: 'far fa-envelope' },
        { text: 'Logout', link: '', icon: 'fas fa-sign-out-alt' },
      ],
    }
  },
}
</script>

<style scoped>
h5 {
  @apply text-white uppercase tracking-wider text-xl text-center font-bold py-3 cursor-pointer transform hover:scale-110 transition duration-300;
}
</style>
