<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-2/12">
      <side-tree-nav
        parent="sectors"
        child="industries"
        parent-code-name="sectorCode"
        count-name="companyCount"
        @parentChanged="parentChanged"
        @childChanged="childChanged"
        @newParent="newParent"
        @newChild="newChild"
      ></side-tree-nav>
    </div>
    <display-table-component
      class="w-full md:w-10/12"
      :items="companies"
      which="companies"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Companies</template>
      <template v-slot:titleContent>
        <p class="w-5/12">Name</p>
        <p class="w-2/12">Size</p>
        <p class="w-2/12">Logo</p>
        <p class="w-full md:w-2/12">Departments</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-6/12 md:w-5/12 md:pl-1">
          {{ slotProps.item.name }}
        </p>
        <p class="w-6/12 md:w-2/12 md:pl-1">{{ slotProps.item.size }}</p>
        <p class="w-6/12 md:w-2/12 md:pl-1">
          <img
            v-if="slotProps.item.logo"
            :src="slotProps.item.logo"
            class="w-8 h-8 rounded-full bg-cover"
          />
        </p>
        <p class="w-6/12 md:w-2/12 md:pl-5">
          <nuxt-link
            class="btn-round-primary px-3"
            :to="{
              name: 'companies-departments-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
            >{{ slotProps.item.departmentCount }}</nuxt-link
          >
        </p>
        <p class="w-full md:w-1/12 flex justify-end">
          <span v-if="hovered === slotProps.item.code" class="flex items-center"
            ><button
              class="btn-link"
              @click.stop="setCurrentItem(slotProps.item)"
            >
              <i class="fas fa-pencil-alt fa-fw"></i></button
          ></span>
          <span v-else>&nbsp;</span>
        </p>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal
        v-if="currentItemToBeEdited"
        @modalClosed="modalClosed"
      >
        <template v-slot:content>
          <new-company v-if="!objectToCreate"></new-company>
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
export default {
  name: 'CompaniesList',
  components: {
    NewSector,
    NewIndustry,
    SideTreeNav,
    NewCompany,
    DisplayTableComponent,
    EditObjectModal,
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
    this.$store
      .dispatch('companies/getCompanies', { limit: 100, offset: 0 })
      .finally(() => {
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
