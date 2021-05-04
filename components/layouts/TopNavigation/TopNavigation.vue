<template>
  <div
    class="fixed w-full h-12 md:bg-white transition duration-500 flex flex-col md:flex-row md:items-stretch md:justify-between z-10"
    :class="[
      scrollPosition > 50 ? `shadow bg-opacity-65` : '',
      `bg-${baseColor}`,
    ]"
    style="font-family: Poppins, serif"
  >
    <div class="flex flex-1 pl-3">
      <nuxt-link
        to="/"
        class="flex flex-1 items-center text-white"
        :class="`md:text-${baseColor}`"
      >
        <i class="fas fa-comments fa-fw mr-2"></i>
        <h6 class="font-semibold">Saqsini</h6>
      </nuxt-link>
      <div class="flex md:hidden pr-3">
        <button
          class="text-white transition duration-300"
          @click="triggerShowSmallScreenMenu"
        >
          <i v-if="showSmallMenu" class="fas fa-times fa-fw"></i>
          <i v-else class="fas fa-bars fa-fw"></i>
        </button>
      </div>
    </div>

    <!-- menu on > small screens -->
    <div class="hidden md:flex items-center">
      <div v-for="(menuItem, menuItemIndex) in menu" :key="menuItemIndex">
        <div class="relative">
          <MenuItem
            v-if="checkRole(menuItem.role) && menuItem.id !== 'navAccountSub'"
            :item="menuItem"
            :is-chosen="whichMenuIsChosen === menuItem.id"
            :color="color"
            @click="chooseMenu(menuItem.id)"
          ></MenuItem>
          <MenuAccount
            v-if="checkRole(menuItem.role) && menuItem.id === 'navAccountSub'"
            :is-chosen="whichMenuIsChosen === menuItem.id"
            :color="color"
            @click="chooseMenu(menuItem.id)"
          ></MenuAccount>

          <screen-overlay
            v-if="whichMenuIsChosen === menuItem.id"
            @click="chooseMenu(null)"
          ></screen-overlay>
          <div
            v-if="whichMenuIsChosen === menuItem.id"
            class="absolute shadow-md rounded z-40 flex flex-col px-2 py-1"
            :class="[`bg-${baseColor}`, `border-${darkColor}`]"
            style="top: 40px; right: 10px"
          >
            <div
              v-for="(menuChild, menuChildIndex) in menuItem.children"
              :key="menuChildIndex"
            >
              <menu-child
                v-if="checkRole(menuChild.role)"
                :item="menuChild"
                :color="color"
                @click="chooseMenu(null)"
              >
              </menu-child>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- menu on small screens-->
    <div
      v-if="showSmallMenu"
      class="flex md:hidden absolute w-full h-screen text-white flex-col"
      :class="`bg-${baseColor}`"
      style="margin-top: 3rem"
    >
      <div
        v-for="(menuItem, menuItemIndex) in menu"
        :key="menuItemIndex"
        class="flex flex-col p-5 items-center"
      >
        <h5
          v-if="checkRole(menuItem.role)"
          class="text-center mb-2 font-semibold"
        >
          {{ menuItem.text }}
        </h5>
        <div
          v-for="(menuChild, menuChildIndex) in menuItem.children"
          :key="menuChildIndex"
        >
          <menu-child
            v-if="checkRole(menuChild.role)"
            :item="menuChild"
            :color="color"
            @click="showSmallMenu = false"
          ></menu-child>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScreenOverlay from '@/components/layouts/ScreenOverlay'
import MenuAccount from '@/components/layouts/TopNavigation/MenuAccount'
import menu from '@/assets/settings/menuStructure.json'
import MenuItem from './MenuItem'
import MenuChild from './MenuChild'

export default {
  components: { MenuAccount, ScreenOverlay, MenuChild, MenuItem },
  props: {
    color: {
      type: String,
      required: false,
      default: 'blue',
    },
  },
  data() {
    return {
      scrollPosition: null,
      menu,
      whichMenuIsChosen: null,
      showSmallMenu: false,
    }
  },
  computed: {
    user() {
      return this.$store.state.auth.authUser
    },
    permissions() {
      const permissions = this.user?.appFlags
      return permissions || []
    },
    baseColor() {
      return `${this.color}-600`
    },
    darkColor() {
      return `${this.color}-700`
    },
  },
  mounted() {
    window.addEventListener('scroll', this.updateScroll)
    window.addEventListener('resize', this.updateResize)
  },
  destroyed() {
    window.removeEventListener('scroll', this.updateScroll)
  },
  methods: {
    updateScroll() {
      this.scrollPosition = window.scrollY
    },
    updateResize() {
      this.chooseMenu(null)
    },
    chooseMenu(which) {
      this.whichMenuIsChosen = which
    },
    triggerShowSmallScreenMenu() {
      if (this.showSmallMenu) {
        this.showSmallMenu = false
        const scrollY = document.body.style.top
        document.body.style.position = ''
        document.body.style.top = ''
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      } else {
        this.showSmallMenu = true
        document.body.style.position = 'fixed'
        document.body.style.top = `-${window.scrollY}px`
      }
    },
    checkRole(roles) {
      return this.permissions.some((val) => {
        return roles.includes(val) || roles.length === 0
      })
    },
  },
}
</script>

<style>
.navbar-blurred {
  @apply bg-opacity-75 md:bg-opacity-0 backdrop-filter backdrop-blur-sm;
}
</style>
