<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="companies"
      :items="companies"
      :hide-menu="companies.length === 0"
      ><template v-slot:title>Companies</template>
      <template v-slot:extraContent>
        <div class="xl:ml-6 ml-0 flex items-center">
          <contact-book-dropdown
            @changedList="updateData"
          ></contact-book-dropdown>
        </div>
      </template>
      <template v-slot:extraButtons>
        <button-basic
          v-if="!disableNewButton && companies.length !== 0"
          @click="setCurrentItem({ code: -1 })"
        >
          New Company
          <template v-slot:rightIcon
            ><i
              class="fas fa-plus fa-fw fa-sm"
            ></i> </template></button-basic></template
    ></top-header-bar>

    <template v-if="contactlists.length < 1">
      <info-box type="info">
        <template v-slot:title>No contact lists</template>
        <template v-slot:content
          >You do not have any contact lists set up. Make sure to create one
          before creating any companies.</template
        >
      </info-box>
    </template>
    <template v-else>
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

      <info-box v-if="disableNewButton" class="flex-grow mt-2 md:mt-0">
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
        <template v-slot:title>No Companies</template>
        <template v-slot:content>
          <button-basic @click="setCurrentItem({ code: -1 })">
            Create one...
          </button-basic>
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
              <badge-base class="ml-2">{{ slotProps.item.abbr }}</badge-base>
            </span>
          </p>

          <p class="w-full xl:w-3/12 flex xl:justify-center">
            <template v-if="slotProps.item.size !== 0">
              <span>{{ slotProps.item.size }}</span
              ><span class="block xl:hidden">&nbsp;employees </span>
            </template>
          </p>

          <p class="w-full xl:w-2/12 flex xl:justify-center">
            <text-link class="px-0 xl:px-3">
              <nuxt-link
                :to="{
                  name: 'companies-departments-id',
                  params: { id: slotProps.item.code },
                }"
                @click.stop.native
                >{{ slotProps.item.departmentCount
                }}<span class="visible xl:hidden"
                  >&nbsp; departments
                </span></nuxt-link
              ></text-link
            >
          </p>
        </template>
        <template v-slot:popup-menu="slotProps">
          <display-table-row-popup
            :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
            @close="hovered = null"
            ><template v-slot:menu>
              <span @click="setCurrentItem(slotProps.item)">
                <i class="fas fa-pencil-alt"></i> Edit
              </span>
            </template></display-table-row-popup
          >
        </template>
      </display-table-component>
    </template>

    <transition name="fade">
      <edit-object-modal
        v-if="currentItemToBeEdited"
        @modalClosed="modalClosed"
      >
        <template v-slot:secondTitle
          ><span v-if="!objectToCreate">Company</span
          ><span v-else-if="objectToCreate === 'industry'">Industry</span
          ><span v-else-if="objectToCreate === 'sector'">Sector</span>
        </template>
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
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import ContactBookDropdown from '~/components/contacts/ContactBookDropdown'

import InfoBox from '~/components/layouts/InfoBox'
import TextLink from '~/components/elements/TextLink'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'

import BadgeBase from '~/components/elements/BadgeBase'
export default {
  name: 'CompaniesList',
  middleware: ['contactBook'],
  components: {
    BadgeBase,
    DisplayTableRowPopup,

    TextLink,
    Spinner,
    NewSector,
    NewIndustry,
    SideTreeNav,
    NewCompany,
    DisplayTableComponent,
    EditObjectModal,
    TopHeaderBar,
    ContactBookDropdown,

    InfoBox,
  },
  mixins: [viewMixin],
  data() {
    return {
      selectedParentCode: -1,
      selectedChildCode: null,
      objectToCreate: null,
    }
  },
  computed: {
    sectors() {
      return this.$store.getters.getItems('sectors')
    },
    industries() {
      return this.$store.getters.getItems('industries')
    },
    disableNewButton() {
      return (
        this.contactlists.length === 0 ||
        this.sectors.length === 0 ||
        (this.sectors.length !== 0 && this.industries.length === 0)
      )
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
    contactlists() {
      return this.$store.getters.getItems('contactlist')
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('contactlist/getContactLists', { limit: 100, offset: 0 })
      .then(() => {
        if (this.contactlists.length !== 0) this.updateData()
        else this.$store.dispatch('setLoading', false)
      })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('setLoading', true)

      await this.$store.dispatch('sectors/getSectors', {
        limit: 1000,
        offset: 0,
      })
      await this.$store.dispatch('industries/getIndustries')
      await this.$store.dispatch('companies/getCompanies', {
        limit: 100,
        offset: 0,
      })

      await this.$store.dispatch('setLoading', false)
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
