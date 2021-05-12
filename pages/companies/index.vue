<template>
  <list-layout-with-sidebar v-if="!loading">
    <template #sidebar>
      <div class="px-3 py-3">
        <company-sector-tree-view
          :sectors="sectors"
          @changedOption="changedOption"
        ></company-sector-tree-view>
      </div>
    </template>
    <template #content>
      <DataTable
        :table-data="companies"
        :table-definition="tableCompanies"
        @deleteAll="deleteMultipleCompanies"
      >
        <template v-slot:headerLeft
          ><h6 class="mt-2">Companies</h6>
          <contact-list-select></contact-list-select>
        </template>
        <template v-slot:headerRight
          ><new-item-button class="ml-2" @click="showNewItem"
            >Company</new-item-button
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
          <l-popup-menu>
            <template v-slot:menu>
              <button @click="editCompany(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </l-popup-menu>
        </template>
      </DataTable>
    </template>
  </list-layout-with-sidebar>
</template>

<script>
import ListLayoutWithSidebar from '~/components/layouts/ListLayoutWithSidebar'
import DataTable from '~/components/elements/DataTable/DataTable'
import LTextLink from '~/components/LTextLink'
import LPopupMenu from '~/components/LPopupMenu'
import NewItemButton from '~/components/elements/NewItemButton'
import ContactListSelect from '~/components/elements/ContactListSelect'
import CompanySectorTreeView from '~/components/contacts/CompanySectorTreeView'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/layouts/NewItemModal'
export default {
  name: 'CompaniesList',
  middleware: ['contactBook'],
  layout: 'authlayout',
  components: {
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
    this.$store.dispatch('contactlist/getContactLists', {}).then(() => {
      if (this.contactLists.length !== 0) this.updateData()
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
      }).then((response) => {
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
    },
    editCompany(dataItem) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewCompany',
        dataItem,
        options: { header: `Edit ${dataItem.name}` },
      }).then((response) => {
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
            this.$toasted.error('There was a problem creating the company')
          })
      })
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
          this.$toasted.show(`${companies.length} companies deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the company')
        })
    },
  },
}
</script>
