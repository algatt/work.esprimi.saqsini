<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="contactlist" :items="contactlists" class="w-full">
      <template v-slot:title> Contact Lists </template>
      <template v-slot:extraButtons>
        <button-icon
          icon="fas fa-plus"
          colour="primary"
          @click="setCurrentItem({ code: -1 })"
        >
          <template v-slot:text>New Contact List</template>
        </button-icon>
      </template>
      <template v-slot:menuButtonIfNotSelected>
        <button class="w-full" @click="downloadTemplate">
          <span class="popup-menu-button">
            <i class="fas fa-download fa-fw mr-1"></i>Download Template</span
          >
        </button>
      </template>
    </top-header-bar>

    <display-table-component
      class="w-full"
      :items="contactlists"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Contact Lists</template>

      <template v-slot:titleContent>
        <p class="w-6/12">List Name</p>
        <p class="w-6/12 text-right pr-4">Validity</p>
      </template>
      <template v-slot:titleContentSmall>Contacts</template>
      <template v-slot:content="slotProps"
        ><p class="w-6/12">{{ slotProps.item.name }}</p>
        <p class="w-6/12 text-right pr-4">
          {{ slotProps.item.deleteBy }}
          {{ calculateRemainingTime(slotProps.item.deleteBy) }}
        </p>
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
              <button @click="exportContactBook(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-file-export fa-fw fa-sm"></i>Export</span
                >
              </button>
              <button @click="flagForRemoval(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-flag fa-fw fa-sm"></i>Flag for Removal</span
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
import moment from 'moment'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'

export default {
  name: 'ContactLists',
  components: {
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    Spinner,
    TopHeaderBar,
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
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('contactlist/getContactLists', {
        limit: 100,
        offset: 0,
      })
      .finally(() => {
        this.$store.dispatch('setLoading', false)
      })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    calculateRemainingTime(dob) {
      const days = moment(dob).diff(moment(), 'd')
      return days === 0 ? 'Indefinite' : `(${days} days)`
    },
    flagForRemoval(contactList) {
      this.$store.dispatch('contactlist/flagForRemoval', contactList)
    },
    downloadTemplate() {
      this.$store.dispatch('contactlist/downloadTemplate')
    },
    exportContactBook(contactList) {
      this.$store.dispatch('contactlist/exportContactBook', contactList)
    },
  },
}
</script>
