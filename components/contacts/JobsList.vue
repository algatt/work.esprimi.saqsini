<template>
  <div>
    <display-table-component
      :items="jobs"
      which="jobs"
      @hovered="hovered = $event"
    >
      <template v-slot:title
        >Job History for
        {{
          getValueFromObject(contacts, 'displayName', $route.params.id)
        }}</template
      >
      <template v-slot:button
        ><nuxt-link :to="{ name: 'contacts-roles' }">
          <button class="btn-primary w-16 mr-3">Roles</button></nuxt-link
        ></template
      >
      <template v-slot:titleContent>
        <p class="w-3/12">Company</p>
        <p class="w-3/12">Department</p>
        <p class="w-3/12">Role</p>
        <p class="w-2/12">Active</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-full md:w-3/12 md:pl-1">
          {{ slotProps.item.companyName }}
        </p>
        <p class="w-full md:w-3/12 md:pl-1">
          {{ slotProps.item.departmentName }}
        </p>
        <p class="w-full md:w-3/12 md:pl-1">
          {{ slotProps.item.roleName }}
        </p>
        <p class="w-full md:w-2/12 md:pl-1">
          <span v-if="slotProps.item.flags.includes('ONGOING')">Active</span>
          <span v-else>Stopped</span>
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
          <new-job></new-job>
        </template>
      </edit-object-modal>
    </transition>
  </div>
</template>

<script>
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import NewJob from '~/components/contacts/NewJob'
export default {
  name: 'JobsList',
  components: { DisplayTableComponent, EditObjectModal, NewJob },
  props: {
    contacts: {
      type: Array,
      required: true,
    },
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
    jobs() {
      return this.$store.getters.getItems('jobs')
    },
    companies() {
      return this.$store.getters.getItems('companies')
    },
    roles() {
      return this.$store.getters.getItems('roles')
    },
    departments() {
      return this.$store.getters.getItems('departments')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('contacts/getContacts', { limit: 1000, offset: 0 }),
      this.$store.dispatch('companies/getCompanies', {
        limit: 1000,
        offset: 0,
      }),
      this.$store.dispatch('roles/getRoles'),
      this.$store.dispatch('departments/getAllDepartments', {
        limit: 1000,
        offset: 0,
      }),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    getValueFromObject(whichObject, whichField, whichCode) {
      if (whichCode === undefined) return
      const temp = whichObject.find((el) => {
        return el.code === Number(whichCode)
      })
      return temp[whichField]
    },
  },
}
</script>

<style scoped></style>
