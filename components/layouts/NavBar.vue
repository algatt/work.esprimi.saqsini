<template>
  <span>
    <div class="hidden md:flex flex-col justify-between h-full">
      <div class="flex flex-col">
        <h5 class="h-10 py-3 mb-2">
          <span
            :class="isVisible ? 'opacity-100' : 'opacity-0'"
            class="transition-all duration-300"
            >Saqsini</span
          >
        </h5>
        <button
          v-for="(item, index) in menu"
          :key="'menu' + index"
          class="relative text-white h-10 font-medium tracking-wider py-2 w-full hover:bg-primary-darker active:bg-white active:text-primary transition duration-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-darker"
          style="font-family: Poppins"
          :class="currentRoute === item.link ? 'bg-primary-darker' : null"
          :title="item.text"
          @click="gotoPage(item.link)"
        >
          <span
            class="w-40 flex items-center justify-between mx-auto relative"
            :class="isVisible ? 'moveRight' : 'moveLeft'"
          >
            <p>
              {{ item.text }}
            </p>

            <i :class="item.icon" class="fa-fw"></i>
            <span
              v-if="item.link === 'notifications'"
              class="absolute text-xs bg-white rounded text-primary px-0.5 font-semibold"
              style="top: -5px; right: -5px"
              >{{ unreadNotifications }}</span
            >
          </span>
        </button>
      </div>
      <div class="w-full mb-3 text-white flex">
        <span
          class="w-10/12 mx-auto flex"
          :class="isVisible ? 'justify-end' : 'justify-center'"
        >
          <button
            class="relative bg-primary h-7 w-7 rounded-full text-white hover:bg-primary-darker focus:ring-2 ring-primary-darker transition duration-300 ring-offset-2 focus:outline-none"
            @click="$emit('clickToggle')"
          >
            <i
              :class="
                isVisible ? 'fa-angle-double-left' : 'fa-angle-double-right'
              "
              class="fas fa-fw"
            ></i>
          </button>
        </span>
      </div>
    </div>
    <div
      class="flex md:hidden w-full bg-primary justify-between py-3 px-2 relative"
    >
      <h5>Saqsini</h5>
      <button
        class="relative text-white w-8 font-medium tracking-wider transform hover:scale-110 active:bg-white active:text-primary transition duration-300 focus:outline-none focus:ring-1 focus:ring-inset focus:ring-primary-darker"
        @click="showSubMenu = !showSubMenu"
      >
        <i class="fas fa-bars fa-fw"></i>
      </button>
      <div
        v-if="showSubMenu"
        class="fixed top-0 left-0 w-full h-full bg-primary flex-col p-4 text-2xl flex z-30"
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
          class="w-full flex items-center text-white justify-center my-3 hover:bg-white hover:text-primary py-1 transition duration-300 relative"
          @click="gotoPage(item.link)"
        >
          <p>{{ item.text }}</p>
          <span class="relative">
            <i :class="item.icon" class="fa-fw ml-3 relative"> </i>
            <span
              v-if="item.link === 'notifications'"
              class="absolute text-xs bg-white rounded text-primary px-1 font-semibold"
              style="top: -3px; right: -3px"
              >{{ unreadNotifications }}</span
            ></span
          >
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
  computed: {
    currentRoute() {
      return this.$route.name
    },
    unreadNotifications() {
      const x = this.$store.state.notifications.notificationStats.unreadCount
      return x === 0 ? null : x
    },
  },
  methods: {
    gotoPage(page) {
      this.showSubMenu = false
      if (page !== 'account-logout') this.$router.push({ name: page })
      else
        this.$store.dispatch('auth/logout').then(() => {
          this.$router.push({ name: 'login' })
        })
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
