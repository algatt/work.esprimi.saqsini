<template>
  <div class="flex flex-wrap">
    <display-table-component
      :items="companies"
      which="companies"
      :disable-new-button="disableNewButton"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Companies</template>
      <template v-slot:sideNav>
        <side-tree-nav
          v-if="!loading"
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
        </side-tree-nav></template
      >
      <template v-slot:titleContent>
        <p class="w-7/12">Name</p>
        <p class="w-3/12">Size</p>
        <p class="w-2/12">Departments</p>
      </template>
      <template v-slot:titleContentSmall>Companies</template>
      <template v-slot:content="slotProps">
        <p
          class="w-full md:w-7/12 flex items-center justify-start mb-1 md:mb-0"
        >
          <span class="flex">
            <img
              v-if="slotProps.item.logo"
              :src="slotProps.item.logo"
              class="w-8 h-8 rounded md:rounded-full bg-cover mr-2"
            />
            <span v-else class="w-8 h-8 mr-2 hidden md:flex">&nbsp;</span>
          </span>
          <span> {{ slotProps.item.name }}</span>
          <span class="badge-gray">{{ slotProps.item.abbr }}</span>
        </p>

        <p class="w-6/12 md:w-3/12 mb-1 md:mb-0 flex items-center">
          <template v-if="slotProps.item.size !== 0">
            <span>{{ slotProps.item.size }}</span
            ><span class="block md:hidden">&nbsp;employees </span>
          </template>
        </p>

        <p
          class="w-6/12 md:w-1/12 mb-1 md:mb-0 flex justify-end md:justify-center"
        >
          <nuxt-link
            class="btn-table px-3"
            :to="{
              name: 'companies-departments-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
            >{{ slotProps.item.departmentCount
            }}<span class="visible md:hidden"
              >&nbsp; departments
            </span></nuxt-link
          >
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'"
          class="items-center"
        >
          <popup-menu-vue
            :object-code="slotProps.item.code"
            direction="left"
            @closeMenu="hovered = null"
          >
            <template v-slot:menuItems>
              <button @click="setCurrentItem(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </popup-menu-vue>
        </span>
      </template>

      <template v-if="disableNewButton" v-slot:extra>
        <p class="flex w-full items-center justify-center p-4">
          You cannot create a company right now. Make sure to have sectors and
          at least one industry.
        </p>
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
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewCompany from '~/components/contacts/NewCompany'
import SideTreeNav from '~/components/layouts/SideTreeNav'
import NewIndustry from '~/components/contacts/NewIndustry'
import NewSector from '~/components/contacts/NewSector'
import PopupMenuVue from '~/components/layouts/PopupMenu'

export default {
  name: 'CompaniesList',
  components: {
    NewSector,
    NewIndustry,
    SideTreeNav,
    NewCompany,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
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
    },
    childChanged(ev) {
      this.selectedChildCode = ev
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
