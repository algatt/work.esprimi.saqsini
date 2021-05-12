<template>
  <l-select
    v-if="canUseContactBook"
    :value="selectedContactList.code"
    :disabled="disabled"
    @input="changeContactBook"
    ><template v-slot:options
      ><option v-for="cl in contactLists" :key="cl.code" :value="cl.code">
        {{ cl.name }}
      </option></template
    ></l-select
  >
</template>

<script>
export default {
  name: 'ContactListSelect',
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    canUseContactBook() {
      return this.$store.getters['auth/getPermissions'].includes('CONTACTBOOK')
    },
    selectedContactList() {
      return this.$store.state.selectedContactList
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
  },
  created() {
    this.$store.dispatch('contactlist/getContactLists', {})
  },
  methods: {
    changeContactBook(code) {
      const contactList = this.contactLists.find((el) => {
        return el.code === code
      })
      this.$store.dispatch('setContactList', contactList)
    },
  },
}
</script>

<style scoped></style>
