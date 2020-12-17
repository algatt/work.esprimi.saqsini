<template>
  <div v-if="!loading">
    <display-table-component
      :items="contacts"
      which="contacts"
      new-text="Contact"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Contact List</template>

      <template v-slot:titleContent>
        <p class="w-4/12">Name</p>
        <p class="w-2/12">Demographics</p>
        <p class="w-2/12">Email</p>
        <p class="w-2/12">Phone</p>
        <p class="w-1/12 text-center">Job History</p>
      </template>
      <template v-slot:titleContentSmall>Contacts</template>
      <template v-slot:content="slotProps"
        ><p class="w-full md:w-4/12 mb-1 md:mb-0">
          {{ slotProps.item.displayName }}
        </p>
        <p class="w-full md:w-2/12 mb-1 md:mb-0">
          <span v-if="slotProps.item.gender === 'M'">Male</span>
          <span v-else-if="slotProps.item.gender === 'F'">Female</span>
          <span v-if="calculateAge(slotProps.item.dob) !== 0"
            >{{ calculateAge(slotProps.item.dob) }}
          </span>
        </p>

        <p class="w-full md:w-2/12 mb-1 md:mb-0">
          <span v-if="slotProps.item.email">{{ slotProps.item.email }}</span>
        </p>
        <p class="w-full md:w-2/12 mb-1 md:mb-0">
          <span v-if="slotProps.item.contactNumber !== 0"
            >{{ slotProps.item.countryExtension }}
            {{ slotProps.item.contactNumber }}</span
          >
        </p>

        <p class="w-full md:w-1/12 md:justify-center flex mb-1 md:mb-0">
          <nuxt-link
            class="btn-table"
            :to="{
              name: 'contacts-jobs-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
            >{{ slotProps.item.jobCount }}
            <span class="flex md:hidden">&nbsp; Jobs</span>
          </nuxt-link>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'"
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
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'ContactsList',
  components: {
    NewContact,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    Spinner,
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
    contacts() {
      return this.$store.getters.getItems('contacts')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('contacts/getContacts', { limit: 100, offset: 0 })
      .finally(() => {
        this.$store.dispatch('setLoading', false)
      })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    calculateAge(dob) {
      return moment().diff(moment(dob), 'y')
    },
  },
}
</script>
