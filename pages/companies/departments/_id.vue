<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <template v-if="company !== undefined">
      <top-header-bar
        which="departments"
        :items="departments"
        class="w-full"
        :hide-menu="departments.length === 0"
      >
        <template v-slot:title> Departments for {{ company.name }}</template>
        <template v-slot:extraButtons>
          <button-icon
            colour="primary"
            icon="fas fa-plus"
            @click="setCurrentItem({ code: -1 })"
          >
            <template v-slot:text>New Department</template>
          </button-icon></template
        ></top-header-bar
      >

      <info-box v-if="departments.length === 0" class="flex-grow mt-2 md:mt-0">
        <template v-slot:title>No Departments</template>
        <template v-slot:content>
          <button class="btn-link" @click="setCurrentItem({ code: -1 })">
            Create a department...
          </button>
        </template></info-box
      >

      <div v-else class="flex flex-col w-full">
        <display-table-component
          class="w-full"
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
              <span class="badge-gray">{{ slotProps.item.abbr }}</span>
            </div>
          </template>
          <template v-slot:popup-menu="slotProps">
            <span
              :class="
                hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'
              "
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
      </div>

      <transition name="fade">
        <edit-object-modal v-if="currentItemToBeEdited">
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
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'
import viewMixin from '~/helpers/viewMixin'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'
import ButtonIcon from '~/components/layouts/ButtonIcon'
export default {
  name: 'ContactsList',
  components: {
    Spinner,
    NewDepartment,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
    TopHeaderBar,
    InfoBox,
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
