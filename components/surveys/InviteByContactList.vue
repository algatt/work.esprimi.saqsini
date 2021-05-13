<template>
  <div v-if="!loading" class="flex flex-col mt-5 space-y-8">
    <div class="flex flex-col w-full space-y-3">
      <div>
        <p class="font-semibold mb-1">Contact Book Filters</p>
        <multi-select
          :key="'sectors' + getCodes(selectedSectors)"
          class="w-full"
          :original-list="sectors"
          :selected-list="selectedSectors"
          @selectedItems="updateAll('selectedSectors', $event)"
          ><template v-slot:title>Sectors</template></multi-select
        >

        <multi-select
          :key="'industries' + getCodes(selectedIndustries)"
          class="w-full"
          :original-list="industries"
          :selected-list="selectedIndustries"
          @selectedItems="updateAll('selectedIndustries', $event)"
          ><template v-slot:title>Industries</template></multi-select
        >

        <multi-select
          :key="'companies' + getCodes(selectedCompanies)"
          class="w-full"
          :original-list="companies"
          :selected-list="selectedCompanies"
          @selectedItems="updateAll('selectedCompanies', $event)"
          ><template v-slot:title>Companies</template></multi-select
        >

        <multi-select
          :key="'departments' + getCodes(selectedDepartments)"
          class="w-full"
          :original-list="departments"
          :selected-list="selectedDepartments"
          @selectedItems="selectedDepartments = $event"
          ><template v-slot:title>Departments</template></multi-select
        >

        <multi-select
          :key="'roles' + getCodes(selectedRoles)"
          class="w-full"
          :original-list="roles"
          :selected-list="selectedRoles"
          @selectedItems="selectedRoles = $event"
          ><template v-slot:title>Roles</template></multi-select
        >
        <div v-if="mergedContacts.length > 0" class="overflow-y-auto py-5">
          <data-table
            :enable-delete-all="false"
            :table-data="mergedContacts"
            :table-definition="tableInvites"
            @selectItems="selectedContacts = $event"
          >
            <template v-slot:personal="slotProps">
              <span class="flex">
                {{ slotProps.item.displayName }}
                <template v-if="slotProps.item.age || slotProps.item.gender">
                  (<template v-if="slotProps.item.gender"
                    ><span v-if="slotProps.item.gender === 'M'">Male</span
                    ><span v-else-if="slotProps.item.gender === 'F'"
                      >Female</span
                    ></template
                  ><template v-if="slotProps.item.age"
                    >&nbsp;{{ slotProps.item.age }} years</template
                  >)
                </template> </span
              ><span>
                {{ slotProps.item.email }}
              </span>
            </template>
            <template #sector="slotProps"
              ><span class="flex flex-col">
                <span> {{ getSector(slotProps.item.companyCode) }}</span>
                <span> {{ getIndustry(slotProps.item.companyCode) }}</span>
              </span></template
            >
            <template #company="slotProps">
              <span class="flex flex-col"
                ><span>{{ slotProps.item.companyName }}</span
                >{{ slotProps.item.departmentName }}<span></span></span
            ></template>
            <template #role="slotProps">{{ slotProps.item.roleName }}</template>
          </data-table>
        </div>
        <div v-else class="flex justify-center font-semibold my-2 rounded py-5">
          No Contacts!
        </div>
        <div v-if="mergedContacts.length > 0" class="flex justify-between">
          <p class="mt-2">
            Total Invites
            <span
              class="ml-2 bg-primary text-white text-sm px-1 py-0.5 rounded"
              >{{ selectedContacts.length }}</span
            >
          </p>
        </div>
      </div>
      <notification-reminder-section
        :existing-data="form"
        @update="form = $event"
        @error="datesError = $event"
      ></notification-reminder-section>
    </div>
    <div class="w-full flex py-10 flex justify-center">
      <l-button :disabled="!isValid" @click="sendInvites"
        >Send Invites<template v-slot:rightIcon
          ><i class="fas fa-paper-plane fa-fw"></i></template
      ></l-button>
    </div>
  </div>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import NotificationReminderSection from '~/components/surveys/NotificationReminderSection'
import MultiSelect from '~/components/elements/MultiSelect'
import DataTable from '~/components/elements/DataTable/DataTable'

export default {
  name: 'InviteByContactList',
  components: {
    DataTable,
    NotificationReminderSection,
    MultiSelect,
  },
  props: {
    survey: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {},
      datesError: false,
      selectedSectors: [],
      selectedIndustries: [],
      selectedCompanies: [],
      selectedDepartments: [],
      selectedRoles: [],
      loading: true,
      selectedContacts: [],
      tableInvites: [
        {
          title: 'Personal',
          slot: 'personal',
        },
        { title: 'Sector & Industry', slot: 'sector' },
        { title: 'Company & Deparmtent', slot: 'company' },
        { title: 'Role', slot: 'role' },
      ],
    }
  },

  computed: {
    isValid() {
      return !this.datesError && this.selectedContacts.length > 0
    },
    parsedSurvey() {
      return parseSurveyToForm(this.survey)
    },
    filters() {
      return JSON.parse(JSON.stringify(this.$store.state.invitations.filters))
    },
    sectors() {
      if (!this.filters.sectors) return []
      const temp = this.filters.sectors
      return temp.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    industries() {
      if (!this.filters.industries) return []
      const temp = this.filters.industries
      temp.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })

      return temp.filter((el) => {
        return this.getAvailableCodes(
          this.sectors,
          this.selectedSectors
        ).includes(el.sectorCode)
      })
    },
    companies() {
      if (!this.filters.companies) return []
      const temp = this.filters.companies
      return temp
        .filter((el) => {
          return (
            this.getAvailableCodes(this.sectors, this.selectedSectors).includes(
              el.sectorCode
            ) &&
            this.getAvailableCodes(
              this.industries,
              this.selectedIndustries
            ).includes(el.industryCode)
          )
        })
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
    },
    departments() {
      if (!this.filters.departments) return []
      const temp = JSON.parse(JSON.stringify(this.filters.departments))

      temp.forEach((el) => {
        el.name = el.name + ` (${this.getName(this.companies, el.companyCode)})`
      })

      return temp
        .sort((a, b) => {
          return a.name > b.name ? 1 : -1
        })
        .filter((el) => {
          return this.getAvailableCodes(
            this.companies,
            this.selectedCompanies
          ).includes(el.companyCode)
        })
    },
    roles() {
      if (!this.filters.roles) return []
      const temp = this.filters.roles
      return temp.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    jobs() {
      return this.$store.state.jobs.items
    },
    contacts() {
      if (!this.filters.contacts) return []

      const temp = this.$store.getters.getItems('jobs')
      const whichCompanies = this.getAvailableCodes(
        this.companies,
        this.selectedCompanies
      )

      const whichDepartments = this.getAvailableCodes(
        this.departments,
        this.selectedDepartments
      )

      const whichRoles = this.getAvailableCodes(this.roles, this.selectedRoles)

      const result = []

      for (const i in temp) {
        const item = temp[i]

        if (
          ((!item.companyCode && this.selectedCompanies.length === 0) ||
            whichCompanies.includes(item.companyCode)) &&
          ((!item.roleCode && this.selectedRoles.length === 0) ||
            whichRoles.includes(item.roleCode)) &&
          ((!item.departmentCode && this.selectedDepartments.length === 0) ||
            whichDepartments.includes(item.departmentCode))
        )
          result.push(item)
      }

      return result
    },
    mergedContacts() {
      const result = []
      this.contacts.forEach((el) => {
        const contact = this.filters.contacts.find((contact) => {
          return contact.code === el.contactCode
        })
        result.push({ ...el, ...contact })
      })
      return result
    },
    contactlists() {
      return this.$store.getters.getItems('contactlist')
    },
  },
  created() {
    this.loading = true
    this.$store
      .dispatch('contactlist/getContactLists', {})
      .then(() => {
        if (this.contactlists.length !== 0) this.updateData()
        this.form = JSON.parse(JSON.stringify(this.parsedSurvey))
      })
      .finally(() => {
        this.loading = false
      })
  },
  methods: {
    async updateData() {
      this.loading = true
      await this.$store.dispatch('invitations/getFilters')
      await this.$store.dispatch('jobs/getAllJobs', {
        contactList: this.$store.state.selectedContactList.code,
      })
      this.loading = false
    },

    getCodes(which) {
      return which.map((el) => {
        return el.code
      })
    },
    getAvailableCodes(originalList, selectedList) {
      return selectedList.length === 0
        ? this.getCodes(originalList)
        : this.getCodes(selectedList)
    },
    getName(which, code) {
      const x = which.find((el) => {
        return el.code === code
      })
      return x ? x.name : ''
    },
    getSector(companyCode) {
      const code = this.companies.find((el) => {
        return el.code === companyCode
      }).sectorCode
      return this.getName(this.sectors, code)
    },
    getSectorAsIs(companyCode) {
      const code = this.companies.find((el) => {
        return el.code === companyCode
      }).sectorCode
      return this.sectors.find((el) => {
        return el.code === code
      })
    },
    getIndustry(companyCode) {
      const code = this.companies.find((el) => {
        return el.code === companyCode
      }).industryCode
      return this.getName(this.industries, code)
    },
    getIndustryAsIs(companyCode) {
      const code = this.companies.find((el) => {
        return el.code === companyCode
      }).sectorCode
      return this.industries.find((el) => {
        return el.code === code
      })
    },
    updateAll(list, newList) {
      this[list] = newList
      this.selectedIndustries = this.selectedIndustries.filter((el) => {
        return this.getAvailableCodes(
          this.sectors,
          this.selectedSectors
        ).includes(el.sectorCode)
      })

      this.selectedCompanies = this.selectedCompanies.filter((el) => {
        return this.getAvailableCodes(
          this.industries,
          this.selectedIndustries
        ).includes(el.industryCode)
      })

      this.selectedDepartments = this.selectedDepartments.filter((el) => {
        return this.getAvailableCodes(
          this.companies,
          this.selectedCompanies
        ).includes(el.companyCode)
      })
    },
    contactIsSelected(contact) {
      return this.selectedContacts.find((el) => {
        return el.code === contact.code
      })
    },
    manageSelectedContact(contact) {
      if (this.contactIsSelected(contact))
        this.selectedContacts = this.selectedContacts.filter((el) => {
          return el.code !== contact.code
        })
      else this.selectedContacts.push(contact)
    },
    selectAll() {
      this.selectedContacts = JSON.parse(JSON.stringify(this.mergedContacts))
    },
    sendInvites() {
      const list = {
        surveyCode: this.survey.code,
        filter: null,
        notificationTimestamp: this.form.notificationTimestamp,
        notificationMessage: this.form.notificationMessage,
        reminderTimestamp: this.form.reminderTimestamp,
        reminderMessage: this.form.reminderMessage,
        invites: this.selectedContacts.map((el) => {
          const sector = this.getSectorAsIs(el.companyCode)
          const industry = this.getSectorAsIs(el.companyCode)
          return {
            email: el.email,
            contactBookCode: this.$store.state.selectedContactList.code,
            externalEntityCode: this.$store.state.selectedContactList.code,
            filter: JSON.stringify({
              Gender: el.gender ? el.gender : null,
              Age: el.age ? el.age : null,
              'Full Name': el.displayName,
              'Sector Name': sector.name ? sector.name : null,
              'Industry Name': industry.name ? industry.name : null,
              'Company Name': el.companyName ? el.companyName : null,
              'Company Abbreviation': el.companyAbbr ? el.companyAbbr : null,
              'Department Name': el.departmentName ? el.departmentName : null,
              'Department Abbreviation': el.departmentAbbr
                ? el.departmentAbbr
                : null,
              'Role Name': el.roleName ? el.roleName : null,
              'Role Abbreviation': el.roleAbbr ? el.roleAbbr : null,
            }),
          }
        }),
      }
      this.$store
        .dispatch('invitations/add', list)
        .then(() => {
          this.$toasted.show('Invitations successfully sent')
          this.$store.dispatch('invitations/getAll', { code: this.survey.code })
        })
        .catch(() => {
          this.$toasted.show('There was a problem sending the invitations')
        })
    },
  },
}
</script>

<style scoped></style>
