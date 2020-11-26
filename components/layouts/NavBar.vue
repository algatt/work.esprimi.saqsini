<template>
  <span>
    <div class="hidden md:flex flex-col justify-between h-full">
      <div class="flex flex-col">
        <h5 style="font-family: 'Poppins'" class="h-10 py-3 mb-2">
          <span
            :class="isVisible ? 'opacity-100' : 'opacity-0'"
            class="transition-all duration-300"
            >Saqsini</span
          >
        </h5>
        <button
          v-for="(item, index) in menu"
          :key="'menu' + index"
          class="text-white h-10 font-medium tracking-wider py-2 w-full hover:bg-blue-700 active:bg-white active:text-blue-600 transition duration-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-700"
          style="font-family: Poppins"
          @click="gotoPage(item.link)"
        >
          <span
            class="w-40 flex items-center justify-between mx-auto"
            :class="isVisible ? 'moveRight' : 'moveLeft'"
          >
            <p>
              {{ item.text }}
            </p>

            <i :class="item.icon" class="fa-fw"></i>
          </span>
        </button>
      </div>
      <div class="w-full mb-3 text-white flex">
        <span class="w-10/12 mx-auto flex justify-end">
          <button
            class="focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-700"
            @click="$emit('clickToggle')"
          >
            <i
              :class="
                isVisible ? 'fa-angle-double-left' : 'fa-angle-double-right'
              "
              class="fas fa-fw h-6 w-6 flex items-center justify-center ring-0 rounded-full transition duration-300 hover:bg-white hover:text-blue-600"
            ></i>
          </button>
        </span>
      </div>
    </div>
    <div
      class="flex md:hidden w-full bg-blue-600 justify-between py-1 px-2 relative"
    >
      <h5>Saqsini</h5>
      <button
        class="relative text-white w-8 font-medium tracking-wider transform hover:scale-110 active:bg-white active:text-blue-600 transition duration-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-blue-700"
        @click="showSubMenu = !showSubMenu"
      >
        <i class="fas fa-bars fa-fw"></i>
      </button>
      <div
        v-if="showSubMenu"
        class="absolute top-0 left-0 w-full h-screen bg-blue-600 flex-col p-4 text-2xl flex"
        style="font-family: 'Poppins'"
      >
        <div class="flex justify-end">
          <button
            class="text-white transform hover:scale-110 transition duration-300"
            @click="showSubMenu = false"
          >
            <i class="fas fa-times fa-fw"></i>
          </button>
        </div>
        <button
          v-for="(item, index) in menu"
          :key="'menu' + index"
          class="w-full flex items-center text-white justify-center my-3 hover:bg-white hover:text-blue-600 py-1 transition duration-300"
          @click="gotoPage(item.link)"
        >
          <p>{{ item.text }}</p>
          <i :class="item.icon" class="fa-fw ml-3"></i>
        </button>
      </div>
    </div>
  </span>
</template>

<script>
export default {
  name: 'NavBar',
  props: {
    isVisible: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      showSubMenu: false,
      menu: [
        { text: 'Surveys', link: 'surveys', icon: 'far fa-clipboard' },
        { text: 'Contacts', link: 'contacts', icon: 'far fa-address-book' },
        { text: 'Companies', link: 'companies', icon: 'far fa-building' },
        { text: 'Account', link: 'account', icon: 'far fa-user-circle' },
        {
          text: 'Notifications',
          link: 'notifications',
          icon: 'far fa-envelope',
        },
        { text: 'Logout', link: 'account-logout', icon: 'fas fa-sign-out-alt' },
      ],
    }
  },
  methods: {
    gotoPage(page) {
      this.$router.push({ name: page })
    },
  },
}
</script>

<style scoped>
h5 {
  @apply text-white uppercase tracking-wider text-xl text-center font-bold cursor-pointer transform hover:scale-110 transition duration-300;
}
@keyframes moveLeft {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(-127px);
  }
}

@keyframes moveRight {
  0% {
    transform: translateX(-127px);
  }
  100% {
    transform: translateX(0px);
  }
}

.moveLeft {
  animation: moveLeft 0.3s 1 forwards;
}

.moveRight {
  animation: moveRight 0.3s 1 forwards;
}
</style>
