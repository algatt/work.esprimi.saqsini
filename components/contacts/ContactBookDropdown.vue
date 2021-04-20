<template>
  <div v-if="selectedContactList" class="ml-2 flex items-center relative">
    <span>Contact List</span>
    <div
      v-if="disabled"
      class="bg-gray-50 bg-opacity-25 absolute left-0 top-0 w-full h-full z-10 cursor-not-allowed"
      @click="showMessage"
    ></div>
    <popup-menu class="mx-2">
      <template v-slot:icon>
        <span class="bg-gray-100 px-2 py-1 rounded"
          >{{ selectedContactList.name
          }}<i
            v-if="contactLists.length > 1"
            class="fas fa-caret-down fa-fw ml-4"
          ></i></span
      ></template>
      <template v-if="!disabled" v-slot:menu>
        <template v-for="item in contactLists">
          <span
            v-if="item.code !== selectedContactList.code"
            :key="item.code"
            @click="setSelectedContactList(item)"
          >
            {{ item.name }}
          </span>
        </template>
      </template>
    </popup-menu>
  </div>

  <span v-else></span>
</template>

<script>
import PopupMenu from '~/components/elements/PopupMenu'
export default {
  name: 'ContactBookDropdown',
  components: { PopupMenu },
  props: {
    disabled: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
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
    showMessage() {
      this.$toasted.show(
        `You cannot change the contact list right now, since it's being used for branching.`,
        {
          action: {
            text: 'Clear Brancing',
            onClick: () => {
              this.$emit('clearBranching')
            },
          },
        }
      )
    },
  },
}
</script>

<style scoped></style>
