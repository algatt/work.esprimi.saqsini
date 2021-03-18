<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="roles"
      :items="roles"
      class="w-full"
      :hide-menu="roles.length === 0"
      ><template v-slot:title>Roles</template>
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
          colour="primary"
          icon="fas fa-plus"
          @click="setCurrentItem({ code: -1 })"
        >
          <template v-slot:text>New Role</template>
        </button-icon></template
      ></top-header-bar
    >

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
          <button class="btn-link" @click="setCurrentItem({ code: -1 })">
            Create a new one...
          </button>
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
          ><div class="w-full flex items-baseline">
            <span>
              {{ slotProps.item.name }}
            </span>
            <span class="badge-gray">{{ slotProps.item.abbr }}</span>
          </div>
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
    </template>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
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
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'

export default {
  name: 'RolesList',
  components: {
    Spinner,
    NewRole,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
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
