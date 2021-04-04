<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="contacts"
      :items="contacts"
      :hide-menu="contacts.length === 0"
    >
      <template v-slot:title>Contacts</template>
      <template v-slot:extraContent>
        <div class="xl:ml-6 ml-0 flex items-center">
          <contact-book-dropdown
            @changedList="updateData"
          ></contact-book-dropdown>
        </div>
      </template>
      <template v-slot:extraButtons>
        <button-icon
          v-if="contactlists.length !== 0"
          @click="setCurrentItem({ code: -1 })"
          >New Contact
          <template v-slot:icon
            ><i class="fas fa-plus fa-sm fa-fw"></i
          ></template> </button-icon></template
    ></top-header-bar>

    <template v-if="contactlists.length < 1">
      <info-box type="info">
        <template v-slot:title>No contact lists</template>
        <template v-slot:content
          >You do not have any contact lists set up. Make sure to create one
          before creating any companies.</template
        >
      </info-box>
    </template>
    <template v-else>
      <info-box
        v-if="contacts.length === 0"
        class="flex-grow mx-5 mt-2 md:mt-0"
      >
        <template v-slot:title>No Contacts</template>
        <template v-slot:content>
          <button-base @click="setCurrentItem({ code: -1 })"
            >Create a contact</button-base
          >
        </template></info-box
      >

      <display-table-component
        v-else
        :items="contacts"
        @hovered="hovered = $event"
        @clicked="setCurrentItem($event)"
      >
        <template v-slot:title>Contact List</template>

        <template v-slot:titleContent>
          <p class="w-4/12">Name</p>
          <p class="w-2/12">Demographics</p>
          <p class="w-3/12">Email</p>
          <p class="w-2/12">Phone</p>
        </template>
        <template v-slot:titleContentSmall>Contacts</template>
        <template v-slot:content="slotProps"
          ><p class="w-full xl:w-4/12">
            {{ slotProps.item.displayName }}
          </p>
          <p class="w-full xl:w-2/12">
            <span v-if="slotProps.item.gender === 'M'">Male</span>
            <span v-else-if="slotProps.item.gender === 'F'">Female</span>
            <span v-if="calculateAge(slotProps.item.dob) !== 0" class="ml-1"
              >{{ calculateAge(slotProps.item.dob) }} years
            </span>
          </p>

          <p class="w-full xl:w-3/12">
            <span v-if="slotProps.item.email">{{ slotProps.item.email }}</span>
          </p>
          <p class="w-full xl:w-2/12">
            <span v-if="slotProps.item.contactNumber !== 0"
              >{{ slotProps.item.countryExtension }}
              {{ slotProps.item.contactNumber }}</span
            >
          </p>
        </template>
        <template v-slot:popup-menu="slotProps">
          <display-table-row-popup
            :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
            @close="hovered = null"
          >
            <template v-slot:menu>
              <span @click="setCurrentItem(slotProps.item)"
                ><i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
              >

              <nuxt-link
                :to="{
                  name: 'contacts-jobs-id',
                  params: { id: slotProps.item.code },
                }"
                ><span
                  ><i class="fas fa-briefcase fa-fw fa-sm"></i>Manage Jobs ({{
                    slotProps.item.jobCount
                  }})</span
                ></nuxt-link
              >
            </template>
          </display-table-row-popup>
        </template>
      </display-table-component>
    </template>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:secondTitle>Contact</template>
        <template v-slot:content>
          <new-contact></new-contact>
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
import NewContact from '~/components/contacts/NewContact'
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import viewMixin from '~/helpers/viewMixin'
import ContactBookDropdown from '~/components/contacts/ContactBookDropdown'
import ButtonIcon from '~/components/elements/ButtonIcon'
import InfoBox from '~/components/layouts/InfoBox'
import ButtonBase from '~/components/elements/ButtonBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'

export default {
  name: 'ContactsList',
  components: {
    DisplayTableRowPopup,
    ButtonBase,
    NewContact,
    DisplayTableComponent,
    EditObjectModal,
    Spinner,
    TopHeaderBar,
    ContactBookDropdown,
    ButtonIcon,
    InfoBox,
  },
  mixins: [viewMixin],
  computed: {
    contacts() {
      return this.$store.getters.getItems('contacts')
    },
    contactlists() {
      return this.$store.getters.getItems('contactlist')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('contactlist/getContactLists', { limit: 100, offset: 0 })
      .then(() => {
        if (this.contactlists.length !== 0) this.updateData()
      })
      .finally(() => {
        this.$store.dispatch('setLoading', false)
      })
  },
  methods: {
    updateData() {
      this.$store.dispatch('setLoading', true)
      Promise.all([
        this.$store.dispatch('contacts/getContacts', { limit: 100, offset: 0 }),
      ]).then(() => {
        this.$store.dispatch('setLoading', false)
      })
    },
    calculateAge(dob) {
      return moment().diff(moment(dob), 'y')
    },
  },
}
</script>
