<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="jobs" class="w-full"
      ><template v-slot:title
        >Job History for
        {{ getValueFromObject(contacts, 'displayName', $route.params.id) }}
      </template>
      <template v-slot:button>
        <nuxt-link :to="{ name: 'contacts-roles' }">
          <button class="btn btn-primary w-16 mr-3">Roles</button></nuxt-link
        >
        <button
          v-if="!disableNewButton && jobs.length !== 0"
          class="btn btn-primary"
          @click="setCurrentItem({ code: -1 })"
        >
          New Job
        </button>
      </template></top-header-bar
    >

    <info-box v-if="disableNewButton" class="flex-grow mx-5 mt-2 md:mt-0">
      <template v-slot:title>We have a problem...</template>
      <template v-slot:content>
        <p v-if="companies.length === 0 && roles.length === 0">
          You cannot create a job entry right now. Make sure to have at least
          one company and one role.
        </p>
        <p v-else-if="companies.length === 0">
          You cannot create a job entry right now. Make sure to have at least
          one company.
        </p>
        <p v-else>
          You cannot create a job entry right now. Make sure to have at least
          one role.
        </p>
      </template>
    </info-box>

    <info-box v-else-if="jobs.length === 0" class="flex-grow mx-5 mt-2 md:mt-0">
      <template v-slot:title>No Job History here...</template>
      <template v-slot:content>
        <button class="btn-link" @click="setCurrentItem({ code: -1 })">
          Add a new one...
        </button>
      </template></info-box
    >

    <display-table-component
      v-else
      :items="jobs"
      class="w-full"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:titleContent>
        <p class="w-4/12">Company</p>
        <p class="w-3/12">Department</p>
        <p class="w-3/12">Role</p>
        <p class="w-2/12">Active</p>
      </template>
      <template v-slot:titleContentSmall>Job Details</template>
      <template v-slot:content="slotProps"
        ><p class="w-full xl:w-4/12">
          {{ slotProps.item.companyName }}
        </p>
        <p class="w-full xl:w-3/12">
          {{ slotProps.item.departmentName }}
        </p>
        <p class="w-full xl:w-3/12">
          {{ slotProps.item.roleName }}
        </p>
        <p class="w-full xl:w-2/12">
          <span v-if="slotProps.item.flags.includes('ONGOING')">Active</span>
          <span v-else>Stopped</span>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
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

      <template v-if="disableNewButton" v-slot:extra> </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:content>
          <new-job></new-job>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import NewJob from '~/components/contacts/NewJob'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'JobsList',
  components: {
    Spinner,
    DisplayTableComponent,
    EditObjectModal,
    NewJob,
    PopupMenuVue,
  },
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
    disableNewButton() {
      return this.companies.length === 0 || this.roles.length === 0
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
