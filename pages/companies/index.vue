<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="companies" :items="companies" class="w-full"
      ><template v-slot:extraContent><top-links-bar></top-links-bar></template>
      <template v-slot:button>
        <button
          v-if="!disableNewButton && companies.length !== 0"
          class="btn btn-primary"
          @click="setCurrentItem({ code: -1 })"
        >
          <i class="fas fa-plus fa-sm fa-fw mr-1"></i>New Company
        </button></template
      ></top-header-bar
    >

    <side-tree-nav
      class="w-full xl:w-3/12"
      :parents="sectors"
      :children="industries"
      parent-code-name="sectorCode"
      count-name="companyCount"
      @parentChanged="parentChanged"
      @childChanged="childChanged"
      @newParent="newParent"
      @newChild="newChild"
    >
      <template v-slot:title>Sectors and Industries</template>
      <template v-slot:newText>New Sector</template>
    </side-tree-nav>

    <info-box v-if="disableNewButton" class="flex-grow mx-5 mt-2 md:mt-0">
      <template v-slot:title>We have a problem...</template>
      <template v-slot:content>
        You cannot create a company right now. Make sure to have at least one
        sector with one industry in it.
      </template>
    </info-box>

    <info-box
      v-else-if="companies.length === 0"
      class="flex-grow mx-5 mt-2 md:mt-0"
    >
      <template v-slot:title>No Companies here...</template>
      <template v-slot:content>
        <button class="btn-link" @click="setCurrentItem({ code: -1 })">
          Create one...
        </button>
      </template></info-box
    >

    <display-table-component
      v-else
      class="w-full xl:w-9/12"
      :items="companies"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Company List</template>
      <template v-slot:sideNav> </template>
      <template v-slot:titleContent>
        <p class="w-7/12">Name</p>
        <p class="w-3/12 text-center">Size</p>
        <p class="w-2/12 text-center">Departments</p>
      </template>
      <template v-slot:titleContentSmall>Companies</template>
      <template v-slot:content="slotProps">
        <p class="w-full xl:w-7/12 flex items-center justify-start">
          <span class="hidden xl:flex mr-2">
            <img
              v-if="slotProps.item.logo"
              :src="slotProps.item.logo"
              class="w-8 h-8 rounded bg-cover"
            />
            <span v-else class="w-8 h-8 hidden xl:flex">&nbsp;</span>
          </span>
          <span class="flex items-baseline">
            <span> {{ slotProps.item.name }}</span>
            <span class="badge-gray">{{ slotProps.item.abbr }}</span></span
          >
        </p>

        <p class="w-full xl:w-3/12 flex xl:justify-center">
          <template v-if="slotProps.item.size !== 0">
            <span>{{ slotProps.item.size }}</span
            ><span class="block xl:hidden">&nbsp;employees </span>
          </template>
        </p>

        <p class="w-full xl:w-2/12 flex xl:justify-center">
          <nuxt-link
            class="btn-link"
            :to="{
              name: 'companies-departments-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
            >{{ slotProps.item.departmentCount
            }}<span class="visible xl:hidden"
              >&nbsp; departments
            </span></nuxt-link
          >
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
    </display-table-component>

    <transition name="fade">
      <edit-object-modal
        v-if="currentItemToBeEdited"
        @modalClosed="modalClosed"
      >
        <template v-slot:content>
          <new-company
            v-if="!objectToCreate"
            :selected-sector-code="selectedParentCode"
            :selected-industry-code="selectedChildCode"
          ></new-company>
          <new-industry
            v-else-if="objectToCreate === 'industry'"
          ></new-industry>
          <new-sector v-else-if="objectToCreate === 'sector'"></new-sector>
        </template>
      </edit-object-modal>
    </transition>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewCompany from '~/components/contacts/NewCompany'
import SideTreeNav from '~/components/layouts/SideTreeNav'
import NewIndustry from '~/components/contacts/NewIndustry'
import NewSector from '~/components/contacts/NewSector'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'
import TopLinksBar from '~/components/contacts/TopLinksBar'

export default {
  name: 'CompaniesList',
  components: {
    Spinner,
    NewSector,
    NewIndustry,
    SideTreeNav,
    NewCompany,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    TopLinksBar,
  },
  data() {
    return {
      hovered: null,
      disableSave: true,
      startSaveItem: false,
      selectedParentCode: -1,
      selectedChildCode: null,
      objectToCreate: null,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    sectors() {
      return this.$store.getters.getItems('sectors')
    },
    industries() {
      return this.$store.getters.getItems('industries')
    },
    disableNewButton() {
      return this.sectors.length === 0 || this.industries.length === 0
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    companies() {
      let tempResults = this.$store.getters.getItems('companies')

      if (this.selectedParentCode === -1) return tempResults

      if (this.selectedChildCode) {
        tempResults = tempResults.filter((el) => {
          return el.industryCode === this.selectedChildCode
        })
      } else {
        tempResults = tempResults.filter((el) => {
          return el.sectorCode === this.selectedParentCode
        })
      }

      return tempResults
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('sectors/getSectors'),
      this.$store.dispatch('industries/getIndustries'),
      this.$store.dispatch('companies/getCompanies', { limit: 100, offset: 0 }),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
    parentChanged(ev) {
      this.selectedParentCode = ev
      this.selectedChildCode = null
      if (this.selectedParentCode !== null && this.selectedParentCode !== -1)
        this.$store.dispatch('companies/getCompaniesBySector', {
          limit: 1000,
          offset: 0,
          code: this.selectedParentCode,
        })
      else if (this.selectedParentCode === -1)
        this.$store.dispatch('companies/getCompanies', {
          limit: 1000,
          offset: 0,
        })
    },
    childChanged(ev) {
      this.selectedChildCode = ev
      if (this.selectedChildCode !== null && this.selectedChildCode !== -1)
        this.$store.dispatch('companies/getCompaniesByIndustry', {
          limit: 1000,
          offset: 0,
          code: this.selectedChildCode,
        })
    },
    newParent(ev) {
      this.objectToCreate = 'sector'
      this.setCurrentItem(ev)
    },
    newChild(ev) {
      this.objectToCreate = 'industry'
      this.setCurrentItem(ev)
    },
    modalClosed() {
      this.objectToCreate = null
    },
  },
}
</script>
