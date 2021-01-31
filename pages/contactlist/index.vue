<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="contacts" :items="contactlists" class="w-full"
      ><template v-slot:extraContent> <top-links-bar></top-links-bar></template>
      <template v-slot:button>
        <button class="btn btn-primary" @click="setCurrentItem({ code: -1 })">
          <i class="fas fa-plus fa-sm mr-1"></i>New Contact List
        </button></template
      ></top-header-bar
    >

    <display-table-component
      class="w-full"
      :items="contactlists"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Contact Lists</template>

      <template v-slot:titleContent>
        <p class="w-5/12">List Name</p>
        <p class="w-3/12 text-center">Total Contacts</p>
        <p class="w-4/12">Validity</p>
      </template>
      <template v-slot:titleContentSmall>Contacts</template>
      <template v-slot:content="slotProps"
        ><p class="w-full xl:w-5/12">Default {{ slotProps.items }}</p>
        <p class="w-full xl:w-3/12 xl:justify-center flex">129</p>
        <p class="w-full xl:w-4/12">Until 28/2/2020 (xx days)</p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
          class="items-center"
        >
          <popup-menu-vue
            :object-code="slotProps.item.code"
            direction="left"
            @closeMenu="hovered = null"
          >
            <template v-slot:menuItems>
              <button @click="setCurrentItem(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
                >
              </button>
            </template>
          </popup-menu-vue>
        </span>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:content>
          <new-contact-list></new-contact-list>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
// import moment from 'moment'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import TopLinksBar from '~/components/contacts/TopLinksBar'

export default {
  name: 'ContactLists',
  components: {
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    Spinner,
    TopHeaderBar,
    TopLinksBar,
  },
  data() {
    return {
      hovered: null,
      disableSave: true,
      startSaveItem: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    contactlists() {
      return this.$store.getters.getItems('contactlist')
    },
  },
  created() {
    this.$store.dispatch('contactlist/getContactLists', {
      limit: 100,
      offset: 0,
    })
    // this.$store.dispatch('setLoading', true)
    // this.$store
    //   .dispatch('contacts/getContacts', { limit: 100, offset: 0 })
    //   .finally(() => {
    //     this.$store.dispatch('setLoading', false)
    //   })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    // calculateAge(dob) {
    //   return moment().diff(moment(dob), 'y')
    // },
  },
}
</script>
