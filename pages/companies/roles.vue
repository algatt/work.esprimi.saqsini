<template>
  <list-layout v-if="!loading && contactLists.length !== 0">
    <data-table
      :table-data="roles"
      :table-definition="tableRoles"
      @deleteAll="deleteRoles"
      ><template v-slot:headerLeft>
        <h5>Roles</h5>
        <contact-list-select></contact-list-select>
      </template>
      <template v-slot:headerRight>
        <new-item-button class="ml-2" @click="newRole"
          >New Role</new-item-button
        >
      </template>
      <template v-slot:name="slotProps">
        <span class="flex items-center space-x-2">
          <span>{{ slotProps.item.name }}</span>
          <l-badge>{{ slotProps.item.abbr }}</l-badge>
        </span>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editRole(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </LPopupMenu>
        </div>
      </template></data-table
    ></list-layout
  >
  <div
    v-else-if="!loading && contactLists.length === 0"
    class="flex justify-center w-full"
  >
    <p class="pt-20 font-semibold">You do not have any contact lists set up.</p>
  </div>
</template>

<script>
import ListLayout from '~/components/layouts/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/layouts/NewItemModal'
import NewItemButton from '~/components/elements/NewItemButton'
import ContactListSelect from '~/components/elements/ContactListSelect'

export default {
  name: 'RolesList',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
    ContactListSelect,
    DataTable,
    ListLayout,
    NewItemButton,
  },

  data() {
    return {
      loading: true,
      tableRoles: [
        { title: 'Name', field: 'name', slot: 'name', sortable: true },
        { title: '', slot: 'actions', align: 'right' },
      ],
    }
  },
  computed: {
    roles() {
      return this.$store.state.roles.items
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
  },
  created() {
    this.loading = true
    this.$store.dispatch('contactlist/getContactLists', {}).then(() => {
      if (this.$store.state.selectedContactList) {
        this.updateData()
      }
      this.loading = false
    })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('roles/getRoles', {})
    },
    newRole() {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewRole',
        dataItem: {},
        options: {
          header: 'New Role',
        },
      })
        .then((response) => {
          this.$store.dispatch('roles/newRole', response).then((role) => {
            this.$toasted.show(`Role ${role.name} created`)
          })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem creating the role')
        })
    },
    editRole(role) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewRole',
        dataItem: role,
        options: {
          header: `Edit ${role.name}`,
        },
      })
        .then((response) => {
          this.$store.dispatch('roles/updateRole', response).then((role) => {
            this.$toasted.show(`Role ${role.name} updated`)
          })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem updating the role')
        })
    },
    deleteRoles(roles) {
      const calls = []
      for (const role in roles) {
        calls.push(this.$store.dispatch('roles/deleteRole', roles[role].code))
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${roles.length} roles deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the roles')
        })
    },
  },
}
</script>
