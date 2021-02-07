<template>
  <div v-if="!dataIsLoading" class="flex flex-wrap items-start">
    <!--    <top-header-bar-->
    <!--      which="invites"-->
    <!--      :hide-delete="true"-->
    <!--      :items="contacts"-->
    <!--      class="w-full"-->
    <!--      ><template v-slot:title></template>-->
    <!--      <template v-slot:button-->
    <!--        ><button-->
    <!--          :disabled="selectedItemsLength === 0"-->
    <!--          class="btn btn-primary"-->
    <!--          @click="invite"-->
    <!--        >-->
    <!--          <i class="far fa-paper-plane fa-fw mr-1"></i>Invite-->
    <!--        </button>-->
    <!--      </template></top-header-bar-->
    <!--    >-->

    <div class="w-full xl:w-3/12 pt-2">
      <div class="px-3 py-1 mb-2">
        <toggle-switch
          :change-colour="false"
          :checked="workEmail"
          @clicked="changeView($event)"
        >
          <template v-slot:label>Contacts</template>
          <template v-slot:leftLabel>Personal Email</template>
          <template v-slot:rightLabel>Work Email</template>
        </toggle-switch>
      </div>

      <template v-if="workEmail">
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
      </template>
    </div>

    <div
      v-if="contacts.length === 0"
      class="w-full flex xl:w-auto xl:flex-grow p-5"
    >
      <info-box class="w-full">
        <template v-slot:title>No Contacts here...</template>
        <template v-slot:content>Try broadening your search.</template>
      </info-box>
    </div>

    <display-table-component
      v-else-if="workEmail"
      class="w-full flex xl:w-auto xl:flex-grow"
      :items="contacts"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Contact List</template>

      <template v-slot:titleContent>
        <p class="w-4/12">Contact</p>
        <p class="w-4/12">Company</p>
        <p class="w-4/12">Role</p>
      </template>
      <template v-slot:titleContentSmall>Contacts</template>
      <template v-slot:content="slotProps"
        ><p class="w-full xl:w-4/12 flex flex-col">
          <span>{{ slotProps.item.contactDisplayName }}</span>
          <span> {{ slotProps.item.contactEmail }}</span>
        </p>
        <p class="w-full xl:w-4/12 flex flex-col">
          <span>{{ slotProps.item.companyName }}</span>
          <span class="flex py-1">
            <span class="text-sm bg-gray-100 border rounded px-2 mr-1">
              {{ getSector(slotProps.item.companyCode) }}</span
            >
            <span class="text-sm bg-gray-100 border rounded px-2">
              {{ getIndustry(slotProps.item.companyCode) }}</span
            >
          </span>
        </p>

        <p class="w-full xl:w-4/12 flex flex-col">
          <span>{{ slotProps.item.roleName }}</span>
          <span class="flex py-1">
            <span
              v-if="slotProps.item.departmentName"
              class="text-sm bg-gray-100 border rounded px-2 mr-1"
            >
              {{ slotProps.item.departmentName }}</span
            >
          </span>
        </p>
      </template>
    </display-table-component>
    <display-table-component
      v-else
      class="w-full flex xl:w-auto xl:flex-grow"
      :items="contacts"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Contact List</template>

      <template v-slot:titleContent>
        <p class="w-4/12">Contact</p>
        <p class="w-4/12">Email</p>
        <p class="w-4/12">Demographics</p>
      </template>
      <template v-slot:titleContentSmall>Contacts</template>
      <template v-slot:content="slotProps"
        ><p class="w-full xl:w-4/12 flex flex-col">
          <span>{{ slotProps.item.displayName }}</span>
        </p>
        <p class="w-full xl:w-4/12 flex flex-col">
          <span>{{ slotProps.item.email }}</span>
        </p>

        <p class="w-full xl:w-4/12 flex flex-wrap">
          <span v-if="slotProps.item.gender === 'M'">Male</span>
          <span v-else-if="slotProps.item.gender === 'F'">Female</span>
          <span v-if="slotProps.item.age" class="ml-1"
            >{{ slotProps.item.age }}
          </span>
        </p>
      </template>
    </display-table-component>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import multiSelect from '@/components/layouts/MultiSelect'
import infoBox from '@/components/layouts/InfoBox'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'ContactsInvites',
  components: {
    multiSelect,
    infoBox,
    DisplayTableComponent,
    ToggleSwitch,
    Spinner,
  },
  data() {
    return {
      filters: [],
      selectedSectors: [],
      selectedIndustries: [],
      selectedCompanies: [],
      selectedDepartments: [],
      selectedRoles: [],
      dataIsLoading: true,
      workEmail: false,
    }
  },
  computed: {
    selectedItemsLength() {
      return this.$store.state.selectedItems.length
    },
    sectors() {
      const temp = this.filters.sectors
      return temp.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    industries() {
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
      const temp = this.filters.roles
      return temp.sort((a, b) => {
        return a.name > b.name ? 1 : -1
      })
    },
    contacts() {
      if (!this.workEmail) return this.filters.contacts
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
  },
  watch: {
    contacts(val) {
      return this.$emit('contacts', val)
    },
  },
  async created() {
    // await this.$store.dispatch('setLoading', true)
    this.dataIsLoading = true
    this.filters = await this.$store.dispatch('invitations/getFilters')
    await this.$store.dispatch('jobs/getAllJobs', { limit: 1000, offset: 0 })
    this.dataIsLoading = false
    // await this.$store.dispatch('setLoading', false)
  },
  methods: {
    changeView(state) {
      this.workEmail = state
      this.$store.dispatch('emptySelectedItems')
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
    getIndustry(companyCode) {
      const code = this.companies.find((el) => {
        return el.code === companyCode
      }).industryCode
      return this.getName(this.industries, code)
    },
    invite() {
      alert('Work in progress :(')
    },
  },
}
</script>

<style scoped></style>
