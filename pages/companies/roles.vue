<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="roles" :items="roles" :hide-menu="roles.length === 0"
      ><template v-slot:title>Roles</template>
      <template v-slot:extraContent>
        <div class="xl:ml-6 ml-0 flex items-center">
          <contact-book-dropdown
            @changedList="updateData"
          ></contact-book-dropdown>
        </div>
      </template>
      <template v-slot:extraButtons>
        <button-basic
          v-if="contactlists.length !== 0"
          @click="setCurrentItem({ code: -1 })"
          >New Role
          <template v-slot:rightIcon
            ><i class="fas fa-plus fa-fw fa-sm"></i
          ></template> </button-basic></template
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
      <info-box v-if="roles.length === 0" class="flex-grow mt-2 md:mt-0">
        <template v-slot:title>No Roles</template>
        <template v-slot:content>
          <button-basic @click="setCurrentItem({ code: -1 })">
            Create a new one...
          </button-basic>
        </template></info-box
      >

      <display-table-component
        v-else
        class="w-full"
        :items="roles"
        @hovered="hovered = $event"
        @clicked="setCurrentItem($event)"
      >
        <template v-slot:title>Roles</template>
        <template v-slot:titleContent>
          <p class="w-full">Role</p>
        </template>
        <template v-slot:titleContentSmall>Roles</template>
        <template v-slot:content="slotProps"
          ><div class="w-full flex flex-wrap items-baseline">
            <span>
              {{ slotProps.item.name }}
            </span>
            <badge-base class="ml-2">{{ slotProps.item.abbr }}</badge-base>
          </div>
        </template>
        <template v-slot:popup-menu="slotProps">
          <display-table-row-popup
            :class="hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'"
            @close="hovered = null"
          >
            <template v-slot:menu>
              <span @click="setCurrentItem(slotProps.item)"
                ><i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
              >
            </template>
          </display-table-row-popup>
        </template>
      </display-table-component>
    </template>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:secondTitle>Role</template>
        <template v-slot:content>
          <new-role></new-role>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewRole from '~/components/contacts/NewRole'
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import ContactBookDropdown from '~/components/contacts/ContactBookDropdown'
import InfoBox from '~/components/layouts/InfoBox'

import BadgeBase from '~/components/elements/BadgeBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'

export default {
  name: 'RolesList',
  middleware: ['contactBook'],
  components: {
    DisplayTableRowPopup,
    BadgeBase,
    Spinner,
    NewRole,
    DisplayTableComponent,
    EditObjectModal,
    TopHeaderBar,
    ContactBookDropdown,
    InfoBox,
  },
  mixins: [viewMixin],
  data() {
    return {}
  },
  computed: {
    roles() {
      return this.$store.getters.getItems('roles')
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
        this.$store.dispatch('roles/getRoles', this.$route.params.id),
      ]).then(() => {
        this.$store.dispatch('setLoading', false)
      })
    },
  },
}
</script>
