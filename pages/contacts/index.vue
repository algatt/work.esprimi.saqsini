<template>
  <list-layout v-if="!loading && !error && contactLists.length !== 0">
    <data-table
      :table-data="contacts"
      :table-definition="tableContacts"
      @deleteAll="deleteContacts"
    >
      <template v-slot:headerLeft>
        <h5>Contacts</h5>
        <contact-list-select></contact-list-select>
      </template>
      <template v-slot:headerRight>
        <new-item-button class="ml-2" @click="newContact"
          >New&nbsp;<span class="hidden md:flex">Contact</span></new-item-button
        >
      </template>
      <template v-slot:demographics="slotProps">
        <span v-if="slotProps.item.gender">
          <span v-if="slotProps.item.gender === 'M'">Male</span>
          <span v-if="slotProps.item.gender === 'F'">Female</span>
        </span>
        <span v-if="slotProps.item.dob"
          >{{ calculateAge(slotProps.item.dob) }} years</span
        ></template
      >
      <template v-slot:phone="slotProps">
        <span v-if="slotProps.item.contactNumber">
          +{{ slotProps.item.countryExtension }}&nbsp;{{
            slotProps.item.contactNumber
          }}</span
        >
      </template>
      <template v-slot:jobCount="slotProps">
        <nuxt-link
          :to="{
            name: 'contacts-jobs-id',
            params: { id: slotProps.item.code },
          }"
        >
          <l-text-link>{{ slotProps.item.jobCount }}</l-text-link>
        </nuxt-link>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editContact(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </LPopupMenu>
        </div>
      </template>
    </data-table>
  </list-layout>
  <contact-list-error
    v-else-if="!loading && !error && contactLists.length === 0"
  ></contact-list-error>
  <page-load-error v-else-if="!loading && error"></page-load-error>
</template>

<script>
import { DateTime } from 'luxon'
import ListLayout from '~/components/elements/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import ContactListSelect from '~/components/elements/ContactListSelect'
import NewItemButton from '~/components/elements/NewItemButton'
import LPopupMenu from '~/components/LPopupMenu'
import LTextLink from '~/components/LTextLink'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import PageLoadError from '~/components/elements/PageLoadError'
import ContactListError from '~/components/contacts/ContactListError'

export default {
  name: 'ContactsList',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
    ContactListError,
    PageLoadError,
    LTextLink,
    LPopupMenu,
    NewItemButton,
    ContactListSelect,
    DataTable,
    ListLayout,
  },
  data() {
    return {
      loading: true,
      error: false,
      tableContacts: [
        { title: 'Full Name', field: 'displayName', sortable: true },
        { title: 'Demographics', slot: 'demographics' },
        { title: 'Email', field: 'email' },
        { title: 'Phone', slot: 'phone' },
        {
          title: 'Jobs',
          field: 'jobCount',
          slot: 'jobCount',
          align: 'center',
          sortable: true,
        },
        { title: '', slot: 'actions' },
      ],
    }
  },
  computed: {
    contacts() {
      return this.$store.state.contacts.items
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
  },
  created() {
    this.loading = true

    this.$store
      .dispatch('contactlist/getContactLists', {})
      .then(() => {
        if (this.$store.state.selectedContactList) {
          this.updateData()
        }
      })
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('contacts/getContacts', {})
    },
    calculateAge(dob) {
      return Math.round(
        DateTime.now().diff(DateTime.fromSQL(dob), 'years').as('years')
      )
    },
    newContact() {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewContact',
        dataItem: {},
        options: {
          header: 'New Contact',
        },
      })
        .then((response) => {
          this.$store
            .dispatch('contacts/newContact', response)
            .then((contact) => {
              this.$toasted.show(`Contacts ${contact.name} created`)
            })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem creating the contact')
        })
    },
    editContact(contact) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewContact',
        dataItem: contact,
        options: {
          header: `Edit ${contact.displayName}`,
        },
      })
        .then((response) => {
          this.$store
            .dispatch('contacts/updateContact', response)
            .then((department) => {
              this.$toasted.show(`Contact ${contact.displayName} updated`)
            })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem updating the contact')
        })
    },
    deleteContacts(contacts) {
      const calls = []
      for (const contact in contacts) {
        calls.push(
          this.$store.dispatch('contacts/deleteContact', contacts[contact].code)
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${contacts.length} contacts deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the contacts')
        })
    },
  },
}
</script>
