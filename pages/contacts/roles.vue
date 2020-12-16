<template>
  <div v-if="!loading">
    <display-table-component
      :items="roles"
      which="roles"
      new-text="Role"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:titleContent>
        <p class="w-full">Role</p>
      </template>
      <template v-slot:titleContentSmall>Roles</template>
      <template v-slot:content="slotProps"
        ><div class="w-full flex items-center">
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

export default {
  name: 'RolesList',
  components: {
    Spinner,
    NewRole,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
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
    roles() {
      return this.$store.getters.getItems('roles')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('roles/getRoles', this.$route.params.id)
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
