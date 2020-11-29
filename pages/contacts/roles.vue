<template>
  <div>
    <display-table-component
      :items="roles"
      which="roles"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Roles</template>
      <template v-slot:titleContent>
        <p class="w-7/12">Name</p>
        <p class="w-4/12">Abbreviation</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-full md:w-7/12 md:pl-1">
          {{ slotProps.item.name }}
        </p>
        <p class="w-full md:w-4/12 md:pl-1">{{ slotProps.item.abbr }}</p>

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
          <new-role></new-role>
        </template>
      </edit-object-modal>
    </transition>
  </div>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewRole from '~/components/contacts/NewRole'
export default {
  name: 'RolesList',
  components: {
    NewRole,
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
