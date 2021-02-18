<template>
  <div v-if="selectedContactList" class="ml-2 flex items-center">
    <span>Contact List</span
    ><popup-menu class="mx-2">
      <template v-slot:menuButton
        ><span class="bg-gray-100 px-2 py-1 rounded"
          >{{ selectedContactList.name
          }}<i
            v-if="contactLists.length > 1"
            class="fas fa-caret-down fa-fw ml-4"
          ></i></span
      ></template>
      <template v-slot:menuItems>
        <template v-for="item in contactLists">
          <button
            v-if="item.code !== selectedContactList.code"
            :key="item.code"
            class="popup-menu-button w-full"
            @click="setSelectedContactList(item)"
          >
            <span class="pl-4">{{ item.name }}</span>
          </button>
        </template>
      </template>
    </popup-menu>
  </div>

  <span v-else></span>
</template>

<script>
import PopupMenu from '~/components/layouts/PopupMenu'
export default {
  name: 'ContactBookDropdown',
  components: { PopupMenu },
  computed: {
    contactLists() {
      return this.$store.getters.getItems('contactlist')
    },
    selectedContactList() {
      return this.$store.state.selectedContactList
    },
  },
  created() {
    this.$store
      .dispatch('contactlist/getContactLists', {
        limit: 100,
        offset: 0,
      })
      .then(() => {
        if (!this.selectedContactList)
          this.$store.dispatch('setContactList', this.contactLists[0])
      })
  },
  methods: {
    setSelectedContactList(item) {
      this.$store.dispatch('setContactList', item)
      this.$emit('changedList', item)
    },
  },
}
</script>

<style scoped></style>
