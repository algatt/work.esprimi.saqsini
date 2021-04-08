<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <template v-if="company !== undefined">
      <top-header-bar
        which="departments"
        :items="departments"
        :hide-menu="departments.length === 0"
      >
        <template v-slot:title> Departments for {{ company.name }}</template>
        <template v-if="departments.length !== 0" v-slot:extraButtons>
          <button-icon @click="setCurrentItem({ code: -1 })">
            New Department
            <template v-slot:icon
              ><i class="fas fa-plus fa-fw fa-sm"></i>
            </template> </button-icon></template
      ></top-header-bar>

      <info-box v-if="departments.length === 0" class="flex-grow mt-2 md:mt-0">
        <template v-slot:title>No Departments</template>
        <template v-slot:content>
          <button-base @click="setCurrentItem({ code: -1 })">
            Create a department...
          </button-base>
        </template></info-box
      >

      <div v-else class="flex flex-col w-full">
        <display-table-component
          :items="departments"
          @hovered="hovered = $event"
          @clicked="setCurrentItem($event)"
        >
          <template v-slot:titleContent>
            <p class="w-full">Name</p>
          </template>
          <template v-slot:titleContentSmall
            >Departments for {{ company.name }}</template
          >
          <template v-slot:content="slotProps"
            ><div class="w-full flex items-baseline">
              <span>
                {{ slotProps.item.name }}
              </span>
              <badge-base class="ml-2">{{ slotProps.item.abbr }}</badge-base>
            </div>
          </template>
          <template v-slot:popup-menu="slotProps">
            <display-table-row-popup
              :class="
                hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'
              "
              @closed="hovered = null"
              ><template v-slot:menu>
                <span @click="setCurrentItem(slotProps.item)"
                  ><i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
                >
              </template></display-table-row-popup
            >
          </template>
        </display-table-component>
      </div>

      <transition name="fade">
        <edit-object-modal v-if="currentItemToBeEdited">
          <template v-slot:secondTitle>Department</template>
          <template v-slot:content>
            <new-department></new-department>
          </template>
        </edit-object-modal>
      </transition>
    </template>
    <template v-else>
      <info-box class="mt-2"
        ><template v-slot:title>We have a problem!</template
        ><template v-slot:content
          >You have landed on this page incorrectly, make sure you have a
          contact list, and some companies set up.</template
        ></info-box
      >
    </template>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewDepartment from '~/components/contacts/NewDepartment'
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'
import ButtonIcon from '~/components/elements/ButtonIcon'
import ButtonBase from '~/components/elements/ButtonBase'
import BadgeBase from '~/components/elements/BadgeBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'
export default {
  name: 'ContactsList',
  middleware: ['contactBook'],
  components: {
    DisplayTableRowPopup,
    BadgeBase,
    Spinner,
    NewDepartment,
    DisplayTableComponent,
    EditObjectModal,
    TopHeaderBar,
    InfoBox,
    ButtonBase,
    ButtonIcon,
  },
  mixins: [viewMixin],
  computed: {
    departments() {
      return this.$store.getters.getItems('departments')
    },
    company() {
      return this.$store.getters.getItems('companies').find((el) => {
        return Number(el.code) === Number(this.$route.params.id)
      })
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
      })
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('setLoading', true)
      await this.$store.dispatch('companies/getCompanies', {
        limit: 100,
        offset: 0,
      })
      await this.$store.dispatch(
        'departments/getDepartments',
        this.$route.params.id
      )
      await this.$store.dispatch('setLoading', false)
    },
  },
}
</script>
