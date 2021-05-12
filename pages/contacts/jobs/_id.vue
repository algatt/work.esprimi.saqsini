<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <template
      v-if="getValueFromObject(contacts, 'displayName', $route.params.id)"
    >
      <top-header-bar which="jobs" :items="jobs" :hide-menu="jobs.length === 0">
        <template v-slot:title
          >Job History for
          {{
            getValueFromObject(contacts, 'displayName', $route.params.id)
          }}</template
        >

        <template v-slot:extraButtons>
          <button-basic
            v-if="!disableNewButton && jobs.length !== 0"
            @click="setCurrentItem({ code: -1 })"
            >New Job
            <template v-slot:rightIcon
              ><i class="fas fa-plus fa-fw fa-sm"></i
            ></template>
          </button-basic> </template
      ></top-header-bar>

      <info-box v-if="disableNewButton" class="flex-grow mt-2 md:mt-0">
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

      <info-box v-else-if="jobs.length === 0" class="flex-grow mt-2 md:mt-0">
        <template v-slot:title>No Job History</template>
        <template v-slot:content>
          <button-basic @click="setCurrentItem({ code: -1 })">
            Add a new one...
          </button-basic>
        </template></info-box
      >

      <div v-else class="flex flex-col w-full">
        <display-table-component
          :items="jobs"
          @hovered="hovered = $event"
          @clicked="setCurrentItem($event)"
        >
          <template v-slot:titleContent>
            <p class="w-4/12">Company</p>
            <p class="w-3/12">Department</p>
            <p class="w-3/12">Role</p>
            <p class="w-2/12">Status</p>
          </template>
          <template v-slot:titleContentSmall
            >Job Details for
            {{ getValueFromObject(contacts, 'displayName', $route.params.id) }}
          </template>
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
              <badge-base
                v-if="slotProps.item.flags.includes('ONGOING')"
                bg-colour="green"
                >Active</badge-base
              >
              <badge-base v-else bg-colour="red">Stopped</badge-base>
            </p>
          </template>
          <template v-slot:popup-menu="slotProps">
            <display-table-row-popup
              :class="
                hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'
              "
              @close="hovered = null"
            >
              <template v-slot:menu>
                <span @click="setCurrentItem(slotProps.item)"
                  ><i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
                >
              </template>
            </display-table-row-popup>
          </template>
          <!--          <template v-slot:popup-menu="slotProps">-->
          <!--            <span-->
          <!--              :class="-->
          <!--                hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'-->
          <!--              "-->
          <!--              class="items-center"-->
          <!--            >-->
          <!--              <popup-menu-vue-->
          <!--                :object-code="slotProps.item.code"-->
          <!--                direction="left"-->
          <!--                @closeMenu="hovered = null"-->
          <!--              >-->
          <!--                <template v-slot:menuItems>-->
          <!--                  <button @click="setCurrentItem(slotProps.item)">-->
          <!--                    <span class="popup-menu-button">-->
          <!--                      <i class="fas fa-pencil-alt fa-fw fa-sm mr-1"></i-->
          <!--                      >Edit</span-->
          <!--                    >-->
          <!--                  </button>-->
          <!--                </template>-->
          <!--              </popup-menu-vue>-->
          <!--            </span>-->
          <!--          </template>-->

          <template v-if="disableNewButton" v-slot:extra> </template>
        </display-table-component>
      </div>

      <transition name="fade">
        <edit-object-modal v-if="currentItemToBeEdited">
          <template v-slot:content>
            <new-job></new-job>
          </template>
        </edit-object-modal>
      </transition>
    </template>
    <template v-else>
      <info-box class="mt-2"
        ><template v-slot:title>We have a problem!</template
        ><template v-slot:content
          >You have landed on this page incorrectly, make sure you have a
          contact list, and some contacts set up.</template
        ></info-box
      >
    </template>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import EditObjectModal from '~/components/layouts/EditObjectModal'
import NewJob from '~/components/contacts/NewJob'
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'

import BadgeBase from '~/components/elements/BadgeBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'
export default {
  name: 'JobsList',
  middleware: ['contactBook'],
  components: {
    DisplayTableRowPopup,
    BadgeBase,

    Spinner,
    DisplayTableComponent,
    EditObjectModal,
    NewJob,
    TopHeaderBar,
    InfoBox,
  },

  mixins: [viewMixin],
  computed: {
    contacts() {
      return this.$store.getters.getItems('contacts')
    },
    contactlists() {
      return this.$store.getters.getItems('contactlist')
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
    this.$store
      .dispatch('contactlist/getContactLists', { limit: 100, offset: 0 })
      .then(() => {
        if (this.contactlists.length !== 0) this.updateData()
      })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('setLoading', true)
      await this.$store.dispatch('contacts/getContacts', {
        limit: 1000,
        offset: 0,
      })
      await this.$store.dispatch('companies/getCompanies', {
        limit: 1000,
        offset: 0,
      })
      await this.$store.dispatch('roles/getRoles', {})
      await this.$store.dispatch('departments/getAllDepartments', {
        limit: 1000,
        offset: 0,
      })
      await this.$store.dispatch('contacts/getContacts', {
        limit: 1000,
        offset: 0,
      })
      await this.$store.dispatch('jobs/getJobsByContact', this.$route.params.id)
      await this.$store.dispatch('setLoading', false)
    },
    getValueFromObject(whichObject, whichField, whichCode) {
      if (whichCode === undefined) return
      const temp = whichObject.find((el) => {
        return el.code === Number(whichCode)
      })
      return temp === undefined ? null : temp[whichField]
    },
  },
}
</script>
