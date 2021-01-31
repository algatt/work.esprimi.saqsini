<template>
  <div
    class="flex items-center md:space-x-3 md:justify-start justify-around w-full"
  >
    <nuxt-link
      v-for="menuOption in menu"
      :key="menuOption.code"
      class="items-center md:flex md:justify-center md:w-44 font-semibold hover:text-primary transition duration-300 focus:outline-none py-3"
      :class="
        currentRoute === menuOption.link
          ? 'text-primary border-b-2 border-primary'
          : 'text-gray-500 '
      "
      :to="{ name: menuOption.link }"
    >
      <i class="xl:mr-2" :class="menuOption.icon" :title="menuOption.text"></i>
      <span class="hidden md:block">{{ menuOption.text }}</span>
    </nuxt-link>
  </div>
</template>

<script>
export default {
  name: 'TopLinksBar',
  data() {
    return {
      menu: [
        {
          code: 1,
          text: 'Contact Lists',
          icon: 'far fa-address-book',
          link: 'contactlist',
        },
        {
          code: 2,
          text: 'Contacts',
          icon: 'fas fa-user-friends',
          link: 'contacts',
        },
        {
          code: 3,
          text: 'Companies',
          icon: 'fas fa-building',
          link: 'companies',
        },
        {
          code: 4,
          text: 'Roles',
          icon: 'fas fa-briefcase',
          link: 'companies-roles',
        },
      ],
    }
  },
  computed: {
    currentRoute() {
      if (this.$route.name === 'companies-departments-id') return 'companies'
      if (this.$route.name === 'contacts-jobs-id') return 'contacts'
      return this.$route.name
    },
  },
}
</script>

<style scoped></style>
