<template>
  <spinner v-if="loading"></spinner>
  <list-layout v-else-if="!loading && !error">
    <data-table
      :table-data="contactlists"
      :table-definition="tableContactList"
      @deleteAll="deleteAll"
    >
      <template #headerLeft><h6>Contact Lists</h6></template>
      <template #headerRight
        ><new-item-button @click="showNewItem"
          ><span class="hidden md:flex">New Contact List</span
          ><span class="flex md:hidden">New</span></new-item-button
        ></template
      >
      <template #deleteBy="slotProps">
        {{ slotProps.item.deleteBy }}
      </template>
      <template #flags="slotProps">
        <span class="flex items-center space-x-3"
          ><span
            v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
            class="text-gray-400"
            title="Flagged for Deletion"
            ><i class="fas fa-trash-alt fa-fw"></i
          ></span>
          <span
            v-if="slotProps.item.flags.includes('HAS_IMPORT_DATA')"
            class="text-gray-400"
            title="Importing Data"
          >
            <i class="far fa-clock fa-fw"></i>
          </span>
          <span
            v-if="slotProps.item.flags.includes('HAS_EXPORT_DATA')"
            class="text-gray-400"
            title="Can donwload data"
          >
            <i class="fas fa-table fa-fw"></i>
          </span>
          <span
            v-if="slotProps.item.flags.includes('GENERATE_EXPORT_DATA')"
            class="text-gray-400"
            title="Generating Export Data"
          >
            <i class="fas fa-cloud-download-alt fa-fw"></i> </span></span
      ></template>
      <template #actions="slotProps">
        <span class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editContactList(slotProps.item)">
                <i class="fas fa-pencil-alt fa-sm fa-fw"></i>Edit
              </button>
              <button @click="showCollaborators(slotProps.item)">
                <i class="fas fa-users fa-sm fa-fw"></i>Collaborators
              </button>
              <button
                v-if="!slotProps.item.flags.includes('GENERATE_EXPORT_DATA')"
                @click="exportContactBook(slotProps.item)"
              >
                <i class="fas fa-file-export fa-fw fa-sm"></i>Start Export
              </button>
              <button
                v-if="
                  slotProps.item.flags.includes('HAS_EXPORT_DATA') &&
                  !slotProps.item.flags.includes('GENERATE_EXPORT_DATA')
                "
                @click="getExportData(slotProps.item)"
              >
                <i class="fas fa-download fa-fw fa-sm"></i>Download Data
              </button>
              <button
                v-if="!slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
                @click="flagForRemoval(slotProps.item)"
              >
                <i class="fas fa-flag fa-fw fa-sm"></i>Flag for Removal
              </button>
              <button v-else @click="unflagForRemoval(slotProps.item)">
                <i class="far fa-flag fa-fw fa-sm"></i>Remove from Deletion
              </button>
              <button @click="anonymiseContacts(slotProps.item)">
                <i class="fas fa-user-secret fa-fw fa-sm"></i>Anonymise Contacts
              </button>
            </template></LPopupMenu
          >
        </span>
      </template>
    </data-table>
  </list-layout>
  <page-load-error v-else-if="!loading && error"></page-load-error>
</template>

<script>
import ListLayout from '~/components/elements/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import NewItemButton from '~/components/elements/NewItemButton'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import PlainModal from '~/components/elements/PlainModal'
import PageLoadError from '~/components/elements/PageLoadError'
import Spinner from '~/components/elements/Spinner'

export default {
  name: 'ContactLists',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
    Spinner,
    PageLoadError,
    NewItemButton,
    DataTable,
    ListLayout,
  },

  data() {
    return {
      loading: true,
      error: false,
      tableContactList: [
        {
          title: 'Name',
          field: 'name',
          sortable: 'true',
        },
        {
          title: 'Available Until',
          field: 'deleteBy',
          slot: 'deleteBy',
        },
        { title: 'Statuses', slot: 'flags' },
        { title: '', slot: 'actions' },
      ],
    }
  },
  computed: {
    contactlists() {
      return this.$store.state.contactlist.items
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('contactlist/getContactLists', {})
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    showNewItem() {
      const dataItem = {}

      ModalService.open(NewItemModal, {
        whichComponent: 'NewContactList',
        dataItem,
        options: { header: 'New Contact List' },
      })
        .then((response) => {
          this.$store
            .dispatch('contactlist/newContactList', response)
            .then((contactList) => {
              this.$toasted.show(`Contact List ${contactList.name} created`)
            })
            .catch(() => {
              this.$toasted.error(
                'There was a problem creating the contact list'
              )
            })
        })
        .catch(() => {})
    },
    editContactList(contactList) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewContactList',
        dataItem: contactList,
        options: { header: `Editing ${contactList.name}` },
      })
        .then((response) => {
          this.$store
            .dispatch('contactlist/updateContactList', response)
            .then((contactList) => {
              this.$toasted.show(`Contact List ${contactList.name} updated`)
            })
            .catch(() => {
              this.$toasted.error(
                'There was a problem updating the contact list'
              )
            })
        })
        .catch(() => {})
    },
    showCollaborators(contactList) {
      ModalService.open(PlainModal, {
        whichComponent: 'ContactListCollaborators',
        dataItem: contactList,
        options: {
          close: true,
          header: `Contact List ${contactList.name} collaborators`,
        },
      })
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
    anonymiseContacts(contactList) {
      this.$store
        .dispatch('invitations/anonymiseResponsesByEntity', contactList.code)
        .then(() => {
          this.$toasted.show('Anonymisation in process...')
        })
        .catch(() => {
          this.$toasted.error(
            'There was a problem submitting your anonimisation request'
          )
        })
    },
    deleteAll(contactLists) {
      const calls = []
      for (const contactList in contactLists) {
        calls.push(
          this.$store.dispatch(
            'contactlist/deleteContactList',
            contactLists[contactList].code
          )
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(
            `${contactLists.length} ${
              contactLists.length === 1 ? 'list' : 'lists'
            } deleted`
          )
        })
        .catch(() => {
          this.$toasted.error(
            `There was a problem deleting the contact ${
              contactLists.length === 1 ? 'list' : 'lists'
            }`
          )
        })
    },
  },
}
</script>
