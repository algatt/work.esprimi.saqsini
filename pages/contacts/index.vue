<template>
  <div>
    <display-table-component
      :items="contacts"
      which="contacts"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Contacts</template>
      <template v-slot:button
        ><nuxt-link :to="{ name: 'contacts-roles' }">
          <button class="btn-primary w-16 mr-3">Roles</button></nuxt-link
        ></template
      >
      <template v-slot:titleContent>
        <p class="w-3/12">Name</p>
        <p class="w-2/12">Birth Date</p>
        <p class="w-3/12">Contact</p>
        <p class="w-1/12">Gender</p>
        <p class="w-2/12">Job History</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-full md:w-3/12 md:pl-1">
          {{ slotProps.item.displayName }}
        </p>
        <p class="w-full md:w-2/12 md:pl-1">{{ slotProps.item.dob }}</p>
        <p class="w-full md:w-3/12 md:pl-1 flex flex-col">
          <span v-if="slotProps.item.email">{{ slotProps.item.email }}</span>

          <span v-if="slotProps.item.contactNumber !== 0"
            >{{ slotProps.item.countryExtension }}
            {{ slotProps.item.contactNumber }}</span
          >
        </p>
        <p class="w-full md:w-1/12 md:pl-1">
          <template v-if="slotProps.item.gender !== 'X'">{{
            slotProps.item.gender
          }}</template>
        </p>
        <p class="w-full md:w-2/12 md:pl-5">
          <nuxt-link
            class="btn-round-primary px-2"
            :to="{
              name: 'contacts-jobs-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
            >0</nuxt-link
          >
        </p>
        <p class="w-full md:w-1/12 flex justify-end">
          <span v-if="hovered === slotProps.item.code" class="flex items-center"
            ><button
              class="btn-link"
              @click.stop="setCurrentItem(slotProps.item)"
            >
              <i class="fas fa-pencil-alt fa-fw"></i></button
          ></span>
          <span v-else>&nbsp;</span>
        </p>
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
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewContact from '~/components/contacts/NewContact'
export default {
  name: 'ContactsList',
  components: {
    NewContact,
    DisplayTableComponent,
    EditObjectModal,
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
  },
}
</script>
