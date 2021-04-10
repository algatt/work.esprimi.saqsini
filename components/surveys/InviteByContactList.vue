<template>
  <div v-if="!loading" class="flex flex-col justify-between w-full">
    <div class="flex flex-col w-full space-y-5">
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
          <table class="table-auto w-full border border-gray-200">
            <tr class="bg-gray-100 font-semibold border-b border-gray-200">
              <td style="min-width: 250px" class="align-top p-2">Personal</td>
              <td style="min-width: 250px" class="align-top p-2">
                Sector & Industry
              </td>
              <td style="min-width: 250px" class="align-top p-2">
                Company & Department
              </td>

              <td style="min-width: 150px" class="align-top p-2">Role</td>
            </tr>

            <tr
              v-for="contact in mergedContacts"
              :key="contact.code"
              class="border-b border-gray-100 cursor-pointer hover:bg-gray-100"
              :class="contactIsSelected(contact) ? 'bg-blue-50' : null"
              @click="manageSelectedContact(contact)"
            >
              <td
                class="align-top p-2"
                :class="
                  contactIsSelected(contact)
                    ? 'border-l-4 border-primary'
                    : 'border-l border-gray-100'
                "
              >
                <span class="flex">
                  {{ contact.displayName }}
                  <template v-if="contact.age || contact.gender">
                    (<template v-if="contact.gender"
                      ><span v-if="contact.gender === 'M'">Male</span
                      ><span v-else-if="contact.gender === 'F'"
                        >Female</span
                      ></template
                    ><template v-if="contact.age"
                      >&nbsp;{{ contact.age }} years</template
                    >)
                  </template> </span
                ><span>
                  {{ contact.email }}
                </span>
              </td>

              <td class="align-top p-2">
                <span class="flex flex-col">
                  <span> {{ getSector(contact.companyCode) }}</span>
                  <span> {{ getIndustry(contact.companyCode) }}</span>
                </span>
              </td>

              <td class="align-top p-2">
                <span class="flex flex-col"
                  ><span>{{ contact.companyName }}</span
                  >{{ contact.departmentName }}<span></span
                ></span>
              </td>

              <td class="align-top p-2">{{ contact.roleName }}</td>
            </tr>
          </table>
        </div>
        <div
          v-else
          class="flex justify-center font-semibold my-2 bg-gray-100 rounded border-gray-200 border py-5"
        >
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
          <text-link
            v-if="selectedContacts.length !== mergedContacts.length"
            @click="selectAll"
            >Select All</text-link
          >
          <text-link v-else @click="selectedContacts = []">Clear</text-link>
        </div>
      </div>
      <notification-reminder-section
        :existing-data="form"
        @update="form = $event"
        @error="datesError = $event"
      ></notification-reminder-section>
    </div>
    <div class="w-full flex py-10 flex justify-between">
      <button-icon bg-colour="gray" @click="cancel"
        ><template v-slot:icon><i class="fas fa-times fa-fw"></i></template
        >Cancel</button-icon
      >
      <button-icon :disabled="!isValid" @click="sendInvites"
        ><template v-slot:icon
          ><i class="fas fa-paper-plane fa-fw"></i></template
        >Send Invites</button-icon
      >
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import { parseSurveyToForm } from '~/helpers/parseSurveyObjects'
import ButtonIcon from '~/components/elements/ButtonIcon'
import NotificationReminderSection from '~/components/surveys/NotificationReminderSection'
import MultiSelect from '~/components/elements/MultiSelect'
import TextLink from '~/components/elements/TextLink'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'InviteByContactList',
  components: {
    Spinner,
    TextLink,
    NotificationReminderSection,
    ButtonIcon,
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
      filters: [],
      jobs: [],
      loading: true,
      selectedContacts: [],
    }
  },

  computed: {
    isValid() {
      return !this.datesError && this.selectedContacts.length > 0
    },
    parsedSurvey() {
      return parseSurveyToForm(this.survey)
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
    this.dataIsLoading = true
    this.$store
      .dispatch('contactlist/getContactLists', { limit: 100, offset: 0 })
      .then(() => {
        if (this.contactlists.length !== 0) this.updateData()
        this.form = JSON.parse(JSON.stringify(this.parsedSurvey))
      })
      .finally(() => {
        this.dataIsLoading = false
      })
  },
  methods: {
    async updateData() {
      this.loading = true
      this.filters = await this.$store.dispatch('invitations/getFilters')
      this.jobs = await this.$store.dispatch('jobs/getAllJobs', {
        contactList: this.$store.state.selectedContactList.code,
        limit: 1000,
        offset: 0,
      })
      this.loading = false
    },
    cancel() {
      this.$store.dispatch('setCurrentItemToBeEdited', null)
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
            filterData: {
              contactBookCode: this.$store.state.selectedContactList.code,
              gender: el.gender ? el.gender : null,
              age: el.age ? el.age : null,
              sectorCode: sector.code ? sector.code : null,
              sectorName: sector.name ? sector.name : null,
              industryCode: industry.code ? industry.code : null,
              industryName: industry.name ? industry.name : null,
              companyCode: el.companyCode ? el.companyCode : null,
              companyName: el.companyName ? el.companyName : null,
              companyAbbreviation: el.companyAbbr ? el.companyAbbr : null,
              departmentCode: el.departmentCode ? el.departmentCode : null,
              departmentName: el.departmentName ? el.departmentName : null,
              departmentAbbreviation: el.departmentAbbr
                ? el.departmentAbbr
                : null,
              roleCode: el.roleCode ? el.roleCode : null,
              roleName: el.roleName ? el.roleName : null,
              roleAbbreviation: el.roleAbbr ? el.roleAbbr : null,
            },
          }
        }),
      }

      this.$store
        .dispatch('invitations/add', list)
        .then(() => {
          this.$toasted.show('Invitations successfully sent')
          this.$store.dispatch('invitations/getAll', { code: this.survey.code })
          this.cancel()
        })
        .catch(() => {
          this.$toasted.show('There was a problem sending the invitations')
        })
    },
  },
}
</script>

<style scoped></style>
