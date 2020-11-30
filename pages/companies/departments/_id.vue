<template>
  <div>
    <display-table-component
      :items="departments"
      which="departments"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Departments</template>
      <template v-slot:titleContent>
        <p class="w-11/12">Name</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-11/12 md:pl-1">
          {{ slotProps.item.name }}
          <span class="badge-gray">{{ slotProps.item.abbr }}</span>
        </p>

        <p class="w-1/12 flex justify-end">
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
          <new-department></new-department>
        </template>
      </edit-object-modal>
    </transition>
  </div>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewDepartment from '~/components/contacts/NewDepartment'
export default {
  name: 'ContactsList',
  components: {
    NewDepartment,
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
    departments() {
      return this.$store.getters.getItems('departments')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('departments/getDepartments', this.$route.params.id)
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