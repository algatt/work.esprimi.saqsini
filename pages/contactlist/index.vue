<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="contactlist"
      :items="contactlists"
      :hide-select-all="true"
    >
      <template v-slot:title> Contact Lists </template>
      <template v-slot:extraButtons>
        <button-icon @click="setCurrentItem({ code: -1 })">
          Contact List
          <template v-slot:icon
            ><i class="fas fa-plus fa-fw fa-sm"></i
          ></template>
        </button-icon>
      </template>
      <template v-slot:menuButtonIfNotSelected>
        <span @click="downloadTemplate">
          <i class="fas fa-download fa-fw mr-1"></i>Download Template</span
        >
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
        ><p class="w-full lg:w-6/12">
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
        <p class="w-full lg:w-6/12 text-left lg:text-right pr-4">
          <span
            v-if="slotProps.item.deleteBy"
            class="flex flex-col xl:flex-row items-start xl:justify-end"
          >
            <template
              >Scheduled for Deletion
              <badge-base bg-colour="blue" class="xl:ml-2">
                {{
                  calculateRemainingTime(slotProps.item.deleteBy)
                }}</badge-base
              ></template
            ></span
          >

          <span v-else>Indefinite</span>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <display-table-row-popup
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
          @close="hovered = null"
        >
          <template v-slot:menu>
            <span @click="setCurrentItem(slotProps.item)"
              ><i class="fas fa-pencil-alt fa-sm fa-fw"></i>Edit</span
            >
            <span @click="showCollaborators(slotProps.item)"
              ><i class="fas fa-users fa-sm fa-fw"></i>Collaborators</span
            >
            <span
              v-if="!slotProps.item.flags.includes('GENERATE_EXPORT_DATA')"
              @click="exportContactBook(slotProps.item)"
            >
              <i class="fas fa-file-export fa-fw fa-sm"></i>Start Export
            </span>
            <span
              v-if="
                slotProps.item.flags.includes('HAS_EXPORT_DATA') &&
                !slotProps.item.flags.includes('GENERATE_EXPORT_DATA')
              "
              @click="getExportData(slotProps.item)"
            >
              <i class="fas fa-download fa-fw fa-sm"></i>Download Data
            </span>
            <span
              v-if="!slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
              @click="flagForRemoval(slotProps.item)"
            >
              <i class="fas fa-flag fa-fw fa-sm"></i>Flag for Removal
            </span>
            <span v-else @click="unflagForRemoval(slotProps.item)">
              <i class="far fa-flag fa-fw fa-sm"></i>Remove from Deletion
            </span>
          </template>
        </display-table-row-popup>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:secondTitle>Contact List</template>
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
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import ContactListCollaborators from '~/components/contacts/ContactListCollaborators'
import viewMixin from '~/helpers/viewMixin'
import ButtonIcon from '~/components/elements/ButtonIcon'
import NewContactList from '~/components/contacts/NewContactList'
import BadgeBase from '~/components/elements/BadgeBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'

export default {
  name: 'ContactLists',
  components: {
    DisplayTableRowPopup,

    BadgeBase,
    DisplayTableComponent,
    EditObjectModal,

    Spinner,
    TopHeaderBar,
    ContactListCollaborators,
    ButtonIcon,
    NewContactList,
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
