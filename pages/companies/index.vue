<template>
  <list-layout-with-sidebar
    v-if="!loading && !error && contactLists.length !== 0"
  >
    <template #sidebar>
      <company-sector-tree-view
        :sectors="sectors"
        @changedOption="changedOption"
      ></company-sector-tree-view>
    </template>
    <template #content>
      <DataTable
        :table-data="companies"
        :table-definition="tableCompanies"
        @deleteAll="deleteMultipleCompanies"
      >
        <template v-slot:headerLeft
          ><h6>Companies</h6>
          <contact-list-select
            v-if="contactLists.length > 0"
          ></contact-list-select>
        </template>
        <template v-slot:headerRight
          ><popup-information
            v-if="sectors.length === 0 || industries.length === 0"
            >Cannot create companies right now, since you need to have at least
            one sector, and one industry.</popup-information
          ><new-item-button
            :disabled="sectors.length === 0 || industries.length == 0"
            @click="showNewItem"
            ><span>New</span
            ><span class="hidden md:flex">&nbsp;Company</span></new-item-button
          ></template
        >
        <template #company="slotProps">
          <span class="flex items-center">
            <img
              v-if="slotProps.item.logo"
              :src="slotProps.item.logo"
              class="w-8 h-8 rounded bg-cover mr-2"
            />
            <span v-else class="w-8 h-8 mr-2">&nbsp;</span>

            <span> {{ slotProps.item.name }}</span>
            <l-badge class="ml-2">{{ slotProps.item.abbr }}</l-badge>
          </span></template
        >
        <template #department="slotProps">
          <nuxt-link
            :to="{
              name: 'companies-departments-id',
              params: { id: slotProps.item.code },
            }"
            class="flex justify-center"
            @click.stop.native
            ><l-text-link>{{
              slotProps.item.departmentCount
            }}</l-text-link></nuxt-link
          >
        </template>
        <template #actions="slotProps">
          <div class="flex justify-end">
            <l-popup-menu>
              <template v-slot:menu>
                <button @click="editCompany(slotProps.item)">
                  <i class="fas fa-pencil-alt fa-fw"></i>Edit
                </button>
              </template>
            </l-popup-menu>
          </div>
        </template>
      </DataTable>
    </template>
  </list-layout-with-sidebar>
  <contact-list-error
    v-else-if="!loading && !error && contactLists.length === 0"
  ></contact-list-error>
  <page-load-error v-else-if="!loading && error"></page-load-error>
  <spinner v-else-if="loading"></spinner>
</template>

<script>
import ListLayoutWithSidebar from '~/components/elements/ListLayoutWithSidebar'
import DataTable from '~/components/elements/DataTable/DataTable'
import LTextLink from '~/components/LTextLink'
import LPopupMenu from '~/components/LPopupMenu'
import NewItemButton from '~/components/elements/NewItemButton'
import ContactListSelect from '~/components/elements/ContactListSelect'
import CompanySectorTreeView from '~/components/contacts/CompanySectorTreeView'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import ContactListError from '~/components/contacts/ContactListError'
import PageLoadError from '~/components/elements/PageLoadError'
import Spinner from '~/components/elements/Spinner'
export default {
  name: 'CompaniesList',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
    Spinner,
    PageLoadError,
    ContactListError,
    CompanySectorTreeView,
    ContactListSelect,
    NewItemButton,
    LPopupMenu,
    LTextLink,
    DataTable,
    ListLayoutWithSidebar,
  },
  data() {
    return {
      selectedSector: null,
      selectedIndustry: null,
      loading: true,
      error: false,
      tableCompanies: [
        { title: 'Company', field: 'name', slot: 'company', sortable: true },
        { title: 'Size', field: 'size', align: 'center' },
        {
          title: 'Departments',
          field: 'departmentCount',
          slot: 'department',
          sortable: true,
          align: 'center',
        },
        { title: '', slot: 'actions' },
      ],
    }
  },
  computed: {
    sectors() {
      const sectors = JSON.parse(
        JSON.stringify(this.$store.state.sectors.items)
      )

      sectors.forEach((sector) => {
        sector.children = this.industries.filter((industry) => {
          return industry.sectorCode === sector.code
        })
      })

      return sectors
    },
    industries() {
      return this.$store.state.industries.items
    },
    companies() {
      return this.$store.state.companies.items
    },
    contactLists() {
      return this.$store.state.contactlist.items
    },
  },

  created() {
    this.loading = true
    this.$store
      .dispatch('contactlist/getContactLists', {})
      .then(() => {
        if (this.contactLists.length !== 0) this.updateData()
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
      await this.$store.dispatch('sectors/getSectors', {})
      await this.$store.dispatch('industries/getIndustries')
      await this.$store.dispatch('companies/getCompanies', {})
    },

    changedOption(newOption) {
      this.selectedSector = newOption.parent
      this.selectedIndustry = newOption.child
      if (!this.selectedSector)
        this.$store.dispatch('companies/getCompanies', {})
      else if (this.selectedSector && !this.selectedIndustry)
        this.$store.dispatch('companies/getCompaniesBySector', {
          code: this.selectedSector.code,
        })
      else {
        this.$store.dispatch('companies/getCompaniesByIndustry', {
          code: this.selectedIndustry.code,
        })
      }
    },
    showNewItem() {
      const dataItem = {}
      if (this.selectedSector) dataItem.sectorCode = this.selectedSector.code
      if (this.selectedIndustry)
        dataItem.industryCode = this.selectedIndustry.code

      ModalService.open(NewItemModal, {
        whichComponent: 'NewCompany',
        dataItem,
        options: { header: 'New Company' },
      })
        .then((response) => {
          this.$store
            .dispatch('companies/newCompany', response)
            .then(async (company) => {
              await this.updateData()
              this.changedOption({
                parent: this.selectedSector,
                child: this.selectedIndustry,
              })
              this.$toasted.show(`Company ${company.name} created`)
            })
            .catch(() => {
              this.$toasted.error('There was a problem creating the company')
            })
        })
        .catch(() => {})
    },
    editCompany(dataItem) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewCompany',
        dataItem,
        options: { header: `Edit ${dataItem.name}` },
      })
        .then((response) => {
          this.$store
            .dispatch('companies/updateCompany', response)
            .then(async (company) => {
              await this.updateData()
              this.changedOption({
                parent: this.selectedSector,
                child: this.selectedIndustry,
              })
              this.$toasted.show(`Company ${company.name} updated`)
            })
            .catch(() => {
              this.$toasted.error('There was a problem updating the company')
            })
        })
        .catch(() => {})
    },
    deleteMultipleCompanies(companies) {
      const calls = []
      for (const company in companies) {
        calls.push(
          this.$store.dispatch(
            'companies/deleteCompany',
            companies[company].code
          )
        )
      }
      Promise.all(calls)
        .then(async () => {
          await this.updateData()
          this.changedOption({
            parent: this.selectedSector,
            child: this.selectedIndustry,
          })
          this.$toasted.show(
            `${companies.length} ${
              companies.length === 1 ? 'company' : 'companies'
            } deleted`
          )
        })
        .catch(() => {
          this.$toasted.error(
            `There was a problem deleting the ${
              companies.length === 1 ? 'company' : 'companies'
            }`
          )
        })
    },
  },
}
</script>
