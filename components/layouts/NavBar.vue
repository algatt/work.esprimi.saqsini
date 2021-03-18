<template>
  <div>
    <div
      v-if="smallScreenMenu"
      class="flex fixed top-0 left-0 z-50 flex-col w-full h-screen lg:hidden bg-primary"
      @click="smallScreenMenu = false"
    >
      <div class="flex justify-between pr-5 pl-5 text-white">
        <nuxt-link
          :to="{ name: 'index' }"
          class="flex items-center h-12 focus:outline-none"
        >
          <span class="flex justify-center items-center w-8 h-8 text-white"
            ><i class="fas fa-comments fa-fw"></i
          ></span>
          <h6
            class="flex-1 pl-1 text-xl font-semibold tracking-wide text-white"
          >
            Saqsini
          </h6>
        </nuxt-link>
        <button @click="smallScreenMenu = false">
          <i class="fas fa-times fa-fw fa-lg"></i>
        </button>
      </div>
      <div
        v-for="(item, menuItemIndex) in menuItems"
        :key="menuItemIndex"
        class="relative px-5"
      >
        <nuxt-link
          v-for="(child, index) in item.children"
          :key="index"
          :to="{ name: child.link }"
          class="flex flex-col p-2 my-2 text-white rounded transition duration-300 cursor-pointer hover:text-primary hover:bg-gray-100"
        >
          <div class="flex items-center">
            <i class="w-8" :class="child.icon" />
            <span class="pl-2 font-semibold">
              {{ child.header }}
            </span>
            <span
              v-if="child.header === 'Messages'"
              class="ml-2 bg-white rounded text-xs text-primary py-0.5 px-1"
              >{{ messageCount }}</span
            >
          </div>
        </nuxt-link>
        <div
          v-if="menuItemIndex !== menuItems.length - 1"
          class="my-6 w-full"
        ></div>
      </div>
    </div>
    <div
      v-if="!smallScreenMenu"
      class="flex sticky top-0 z-20 justify-between items-center px-5 w-full h-12 bg-gray-50 lg:hidden"
    >
      <nuxt-link
        :to="{ name: 'index' }"
        class="flex items-center focus:outline-none"
      >
        <span
          class="flex justify-center items-center w-8 h-8 bg-gray-50 rounded-full text-primary"
          ><i class="fas fa-comments fa-fw"></i
        ></span>
        <h6
          class="flex-1 pl-1 text-xl font-semibold tracking-wide text-primary"
        >
          Saqsini
        </h6>
      </nuxt-link>
      <button
        class="text-gray-700 transition duration-300 hover:text-primary"
        @click="smallScreenMenu = true"
      >
        <i class="fas fa-bars fa-fw"></i>
      </button>
    </div>
    <div
      class="hidden fixed top-0 z-40 justify-between items-center px-5 w-full h-12 bg-white lg:flex"
    >
      <div class="flex flex-1 items-center">
        <nuxt-link
          :to="{ name: 'index' }"
          class="flex items-center focus:outline-none"
        >
          <span
            class="flex justify-center items-center w-8 h-8 rounded-full text-primary"
            ><i class="fas fa-comments fa-fw"></i
          ></span>
          <h6
            class="flex-1 pl-1 text-xl font-semibold tracking-wide text-primary"
          >
            Saqsini
          </h6>
        </nuxt-link>
      </div>

      <div class="flex relative items-center">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="flex relative justify-center items-center py-2 h-10"
          :class="item.text !== 'Account' ? 'w-28' : 'w-12'"
          @click="showSubMenu(item.id)"
        >
          <span
            v-if="item.text !== 'Account'"
            class="py-2 px-1 text-lg font-semibold text-gray-600 border-b-2 border-transparent transition duration-300 cursor-pointer hover:text-primary hover:border-primary"
            >{{ item.text }}</span
          >
          <span
            v-else
            class="flex relative justify-center items-center font-semibold text-gray-600 transition duration-300 cursor-pointer hover:text-primary"
          >
            <span
              v-if="!avatar || avatar.length < 100"
              class="flex justify-center items-center w-7 h-7 rounded-full border-2 border-gray-600 transition duration-300 hover:border-primary"
            >
              <i class="fas fa-user fa-fw"></i>
            </span>
            <img
              v-else
              alt="Avatar Image"
              :src="avatar"
              class="w-7 h-7 rounded-full border-2 border-gray-100 transition duration-300 hover:border-primary"
            />
            <span
              v-if="messageCount > 0"
              class="absolute right-0 top-0 text-xs bg-gray-100 border-1 border-gray-200 shadow-sm bg-opacity-100 rounded -my-2 -mx-1 px-1 flex"
              >{{ messageCount }}</span
            >
          </span>

          <div
            :id="item.id"
            class="absolute invisible flex-col w-auto submenu"
            style="top: 2rem"
            :style="
              item.text !== 'Account' ? 'right: 2.3rem;' : 'right:0.25rem'
            "
          >
            <div class="fixed top-0 left-0 z-10 w-full h-screen"></div>

            <div class="flex relative z-20 justify-end pr-3 w-full">
              <div class="arrow-up" />
            </div>

            <div
              class="flex relative z-20 flex-col p-2 text-sm rounded shadow-lg bg-primary"
            >
              <nuxt-link
                v-for="(child, index2) in item.children"
                :key="index2"
                :to="{ name: child.link }"
                class="flex flex-col p-3 text-white rounded transition duration-300 cursor-pointer hover:bg-white hover:text-primary"
              >
                <div class="flex items-center">
                  <i :class="child.icon" class="w-5" />
                  <p class="pl-2 font-semibold">
                    {{ child.header }}
                  </p>
                </div>
                <div class="flex items-center mt-1">
                  <div class="w-5" />
                  <span class="pl-3 text-xs text-left">{{ child.text }}</span>
                </div>
              </nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import jsonMenu from '@/assets/settings/menuStructure.json'
export default {
  name: 'NavBar',
  data() {
    return {
      whichSubMenu: '',
      menuItems: jsonMenu,
      smallScreenMenu: false,
    }
  },
  computed: {
    avatar() {
      return this.$store.state.auth.authUserAvatar
    },
    messageCount() {
      return this.$store.state.notifications.notificationStats.unreadCount
    },
  },
  methods: {
    showSubMenu(id) {
      const thisMenu = id === '' ? '' : document.getElementById(id)
      const previousMenu =
        this.whichSubMenu === ''
          ? ''
          : document.getElementById(this.whichSubMenu)

      if (this.whichSubMenu !== '' && this.whichSubMenu !== id) {
        previousMenu.classList.add('invisible')
        previousMenu.style.opacity = '0'
      }

      if (thisMenu.classList.contains('invisible')) {
        thisMenu.classList.remove('invisible')
        thisMenu.style.opacity = '1'
        this.whichSubMenu = id
      } else {
        thisMenu.style.opacity = '0'
        thisMenu.classList.add('invisible')
        this.whichSubMenu = ''
      }
    },
  },
}
</script>

<style scoped>
.arrow-up {
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid #2563eb;
}

.submenu {
  transition: visibility 0.3s linear, opacity 0.3s linear;
  opacity: 1;
  min-width: 14rem;
}
</style>
