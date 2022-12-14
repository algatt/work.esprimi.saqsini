<template>
  <company-error
    v-if="!loading && !error && companies.length === 0"
  ></company-error>
  <roles-error
    v-else-if="!loading && !error && roles.length === 0"
  ></roles-error>
  <list-layout v-else-if="!loading && !error && contact">
    <data-table
      :table-data="jobs"
      :table-definition="tableJobs"
      @deleteAll="deleteJobs"
    >
      <template v-slot:headerLeft>
        <h5>
          Job History for
          {{ getValueFromObject(contacts, 'displayName', $route.params.id) }}
        </h5>
      </template>
      <template v-slot:headerRight>
        <new-item-button @click="newJob"
          ><span>New</span><span class="hidden md:flex">&nbsp;Job</span>
        </new-item-button>
      </template>
      <template v-slot:status="slotProps">
        <div class="flex justify-start">
          <l-badge v-if="slotProps.item.flags.includes('ONGOING')" color="green"
            >active</l-badge
          >
          <l-badge v-else color="red">stopped</l-badge>
        </div>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editJob(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </LPopupMenu>
        </div>
      </template>
    </data-table>
  </list-layout>
  <page-load-error
    v-else-if="(!loading && error) || (!loading && !contact)"
  ></page-load-error>
</template>

<script>
import ListLayout from '~/components/elements/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import NewItemButton from '~/components/elements/NewItemButton'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import LPopupMenu from '~/components/LPopupMenu'
import PageLoadError from '~/components/elements/PageLoadError'
import CompanyError from '~/components/contacts/CompanyError'
import RolesError from '~/components/contacts/JobError'
export default {
  name: 'JobsList',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
    RolesError,
    CompanyError,
    PageLoadError,
    LPopupMenu,
    NewItemButton,
    DataTable,
    ListLayout,
  },
  data() {
    return {
      loading: true,
      error: false,
      tableJobs: [
        {
          title: 'Company',
          field: 'companyName',
          sortable: true,
        },
        {
          title: 'Department',
          field: 'departmentName',
          sortable: true,
        },
        {
          title: 'Role',
          field: 'roleName',
          sortable: true,
        },
        {
          title: 'Status',
          slot: 'status',
        },
        { title: '', slot: 'actions' },
      ],
    }
  },
  computed: {
    contacts() {
      return this.$store.state.contacts.items
    },
    jobs() {
      return this.$store.state.jobs.items
    },
    companies() {
      return this.$store.state.companies.items
    },
    roles() {
      return this.$store.state.roles.items
    },
    departments() {
      return this.$store.state.departments.items
    },
    contact() {
      return this.contacts.find((el) => {
        return el.code === this.$route.params.id
      })
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('contactlist/getContactLists', {})
      .then(async () => {
        if (this.$store.state.selectedContactList) {
          await this.updateData()
        }
      })
      .catch(() => {
        this.error = true
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('contacts/getContacts', {})
      await this.$store.dispatch('companies/getCompanies', {})
      await this.$store.dispatch('roles/getRoles', {})
      await this.$store.dispatch('departments/getAllDepartments', {})
      if (this.$route.params.id)
        await this.$store.dispatch('jobs/getJobsByContact', {
          contactCode: this.$route.params.id,
        })
    },
    getValueFromObject(whichObject, whichField, whichCode) {
      if (whichCode === undefined) return
      const temp = whichObject.find((el) => {
        return el.code === Number(whichCode)
      })
      return temp === undefined ? null : temp[whichField]
    },
    newJob() {
      const dataItem = {
        contactCode: this.$route.params.id,
      }
      ModalService.open(NewItemModal, {
        whichComponent: 'NewJob',
        dataItem,
        options: {
          header: 'New Job',
        },
      })
        .then((response) => {
          this.$store.dispatch('jobs/newJob', response).then((job) => {
            this.$toasted.show(`Job created`)
          })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem creating the job')
        })
    },
    editJob(job) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewJob',
        dataItem: job,
        options: {
          header: `Edit Job`,
        },
      })
        .then((response) => {
          this.$store.dispatch('jobs/updateJob', response).then((job) => {
            this.$toasted.show(`Job updated`)
          })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem updating the job')
        })
    },
    deleteJobs(jobs) {
      const calls = []
      for (const job in jobs) {
        calls.push(this.$store.dispatch('jobs/deleteJob', jobs[job].code))
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${jobs.length} jobs deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the jobs')
        })
    },
  },
}
</script>
