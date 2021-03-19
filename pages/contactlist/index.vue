<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="contactlist"
      :items="contactlists"
      class="w-full"
      :hide-select-all="true"
    >
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

    <info-box v-if="contactlists.length === 0" type="info">
      <template v-slot:title>No Contact Lists</template>
      <template v-slot:content
        >You do not have any contact lists you can create one, or a default one
        will be created in a few moments.</template
      >
    </info-box>

    <display-table-component
      v-else
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
        ><p class="w-6/12">
          <span>{{ slotProps.item.name }}</span
          ><span
            v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
            class="text-gray-400 ml-3"
            title="Flagged for Deletion"
            ><i class="fas fa-trash-alt"></i
          ></span>
          <span
            v-if="slotProps.item.flags.includes('HAS_IMPORT_DATA')"
            class="text-gray-400 ml-3"
            title="Importing Data"
          >
            <i class="far fa-clock"></i>
          </span>
          <span
            v-if="slotProps.item.flags.includes('GENERATE_EXPORT_DATA')"
            class="text-gray-400 ml-3"
            title="Generating Export Data"
          >
            <i class="fas fa-cloud-download-alt"></i>
          </span>
        </p>
        <p class="w-6/12 text-right pr-4">
          <span v-if="slotProps.item.deleteBy"
            >{{ slotProps.item.deleteBy }}
            <span
              class="text-sm bg-gray-100 rounded px-1 py-0.5 text-gray-600"
              >{{ calculateRemainingTime(slotProps.item.deleteBy) }}</span
            ></span
          >
          <span v-else>Indefinite</span>
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
              <button @click="showCollaborators(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-users fa-fw fa-sm"></i>Collaborators</span
                >
              </button>
              <button
                v-if="!slotProps.item.flags.includes('GENERATE_EXPORT_DATA')"
                @click="exportContactBook(slotProps.item)"
              >
                <span class="popup-menu-button">
                  <i class="fas fa-file-export fa-fw fa-sm"></i>Start
                  Export</span
                >
              </button>
              <button
                v-if="
                  slotProps.item.flags.includes('HAS_EXPORT_DATA') &&
                  !slotProps.item.flags.includes('GENERATE_EXPORT_DATA')
                "
                @click="getExportData(slotProps.item)"
              >
                <span class="popup-menu-button">
                  <i class="fas fa-download fa-fw fa-sm"></i>Download Data</span
                >
              </button>
              <button
                v-if="!slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
                @click="flagForRemoval(slotProps.item)"
              >
                <span class="popup-menu-button">
                  <i class="fas fa-flag fa-fw fa-sm"></i>Flag for Removal</span
                >
              </button>
              <button v-else @click="unflagForRemoval(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="far fa-flag fa-fw fa-sm"></i>Remove from
                  Deletion</span
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

      <contact-list-collaborators
        v-if="showCollaboratorsModal"
        :item="selectedContactListForCollaboration"
        @cancel="showCollaboratorsModal = false"
      ></contact-list-collaborators>
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
import ContactListCollaborators from '~/components/contacts/ContactListCollaborators'
import viewMixin from '~/helpers/viewMixin'

export default {
  name: 'ContactLists',
  components: {
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    Spinner,
    TopHeaderBar,
    ContactListCollaborators,
  },
  mixins: [viewMixin],
  data() {
    return {
      selectedContactListForCollaboration: null,
      showCollaboratorsModal: false,
    }
  },
  computed: {
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
    showCollaborators(contactList) {
      this.selectedContactListForCollaboration = contactList
      this.showCollaboratorsModal = true
    },
    calculateRemainingTime(deleteBy) {
      const days = moment(deleteBy).diff(moment(), 'd')
      return `${days} days left`
    },
    flagForRemoval(contactList) {
      this.$store
        .dispatch('contactlist/flagForRemoval', contactList)
        .then(() => {
          this.$toasted.show(
            `${contactList.name} successfully flagged for removal`
          )
        })
    },
    unflagForRemoval(contactList) {
      this.$store
        .dispatch('contactlist/unflagForRemoval', contactList)
        .then(() => {
          this.$toasted.show(
            `${contactList.name} successfully removed from deletion`
          )
        })
    },
    downloadTemplate() {
      this.$store.dispatch('contactlist/downloadTemplate')
    },
    exportContactBook(contactList) {
      this.$store
        .dispatch('contactlist/exportContactBook', contactList)
        .then(() => {
          this.$toasted.show(
            `${contactList.name} export process started successfully`
          )
        })
    },
    getExportData(contactList) {
      this.$store.dispatch('contactlist/getExportData', contactList)
    },
  },
}
</script>