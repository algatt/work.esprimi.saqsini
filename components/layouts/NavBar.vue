<template>
  <div>
    <div
      v-if="smallScreenMenu"
      class="flex flex-col lg:hidden fixed top-0 left-0 w-full h-screen bg-primary z-50"
      @click="smallScreenMenu = false"
    >
      <div class="flex justify-between text-white pl-5 pr-5">
        <div class="flex h-12 items-center">
          <span class="text-white h-8 w-8 flex items-center justify-center"
            ><i class="fas fa-comments fa-fw"></i
          ></span>
          <h6
            class="text-white font-semibold text-xl pl-1 tracking-wide flex-1"
          >
            Saqsini
          </h6>
        </div>
        <button @click="smallScreenMenu = false">
          <i class="fas fa-times fa-fw fa-lg"></i>
        </button>
      </div>
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="relative px-5"
      >
        <nuxt-link
          v-for="(child, index) in item.children"
          :key="index"
          :to="{ name: child.link }"
          class="flex flex-col text-white hover:text-primary hover:bg-gray-100 transition duration-300 rounded cursor-pointer my-2 p-2"
        >
          <div class="flex items-center">
            <i class="w-8" :class="child.icon" />
            <span class="font-semibold pl-2">
              {{ child.header }}
            </span>
          </div>
          <div class="text-xs flex mt-1">
            <div class="w-8" />
            <span class="pl-2">{{ child.text }}</span>
          </div>
        </nuxt-link>
      </div>
    </div>
    <div
      v-if="!smallScreenMenu"
      class="w-full h-12 flex lg:hidden sticky top-0 items-center px-5 justify-between z-20 bg-gray-50"
    >
      <div class="flex items-center">
        <span
          class="bg-gray-50 text-primary h-8 w-8 rounded-full flex items-center justify-center"
          ><i class="fas fa-comments fa-fw"></i
        ></span>
        <h6
          class="text-primary font-semibold text-xl pl-1 tracking-wide flex-1"
        >
          Saqsini
        </h6>
      </div>
      <button
        class="text-gray-700 hover:text-primary transition duration-300"
        @click="smallScreenMenu = true"
      >
        <i class="fas fa-bars fa-fw"></i>
      </button>
    </div>
    <div
      class="hidden lg:flex w-full h-12 fixed top-0 items-center px-5 justify-between z-20 bg-white"
    >
      <div class="flex flex-1 items-center">
        <span
          class="text-primary h-8 w-8 rounded-full flex items-center justify-center"
          ><i class="fas fa-comments fa-fw"></i
        ></span>
        <h6
          class="text-primary font-semibold text-xl pl-1 tracking-wide flex-1"
        >
          Saqsini
        </h6>
      </div>

      <div class="flex relative items-center">
        <div
          v-for="(item, index) in menuItems"
          :key="index"
          class="relative h-10 flex justify-center items-center py-2"
          :class="item.text !== 'Account' ? 'w-28' : 'w-12'"
          @click="showSubMenu(item.id)"
        >
          <span
            v-if="item.text !== 'Account'"
            class="text-gray-600 font-semibold cursor-pointer hover:text-primary transition duration-300 border-b-2 border-transparent hover:border-primary py-2 px-1"
            >{{ item.text }}</span
          >
          <span
            v-else
            class="text-gray-600 font-semibold cursor-pointer hover:text-primary flex items-center flex justify-center transition duration-300"
          >
            <div
              v-if="!avatar"
              class="w-7 h-7 rounded-full border-2 border-gray-600 hover:border-primary transition duration-300 flex justify-center items-center"
            >
              <i class="fas fa-user fa-fw"></i>
            </div>
            <img
              v-else
              :src="avatar"
              class="w-7 h-7 rounded-full border-2 border-gray-100 hover:border-primary transition duration-300"
            />
          </span>

          <div
            :id="item.id"
            class="absolute flex-col w-auto submenu invisible"
            style="top: 2rem"
            :style="
              item.text !== 'Account' ? 'right: 2.3rem;' : 'right:0.25rem'
            "
          >
            <div class="fixed top-0 left-0 w-full h-screen z-10"></div>

            <div class="w-full flex justify-end pr-3 z-20 relative">
              <div class="arrow-up" />
            </div>

            <div
              class="bg-primary shadow-lg flex flex-col text-sm p-2 rounded z-20 relative"
            >
              <nuxt-link
                v-for="(child, index) in item.children"
                :key="index"
                :to="{ name: child.link }"
                class="flex flex-col hover:bg-white text-white hover:text-primary transition duration-300 p-3 rounded cursor-pointer"
              >
                <div class="flex items-center">
                  <i :class="child.icon" class="w-5" />
                  <p class="font-semibold pl-2">
                    {{ child.header }}
                  </p>
                </div>
                <div class="flex items-center mt-1">
                  <div class="w-5" />
                  <span class="text-left text-xs pl-3">{{ child.text }}</span>
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
  },
  methods: {
    showSubMenu(id) {
      const thisMenu = document.getElementById(id)
      const previousMenu = document.getElementById(this.whichSubMenu)

      if (this.whichSubMenu !== '' && this.whichSubMenu !== id) {
        previousMenu.classList.add('invisible')
        previousMenu.style.opacity = 0
      }

      if (thisMenu.classList.contains('invisible')) {
        thisMenu.classList.remove('invisible')
        thisMenu.style.opacity = 1
        this.whichSubMenu = id
      } else {
        thisMenu.style.opacity = 0
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
