<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="departments" :items="departments" class="w-full">
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

    <info-box
      v-if="departments.length === 0"
      class="flex-grow mx-5 mt-2 md:mt-0"
    >
      <template v-slot:title>No Departments here...</template>
      <template v-slot:content>
        <button class="btn-link" @click="setCurrentItem({ code: -1 })">
          Create a Department
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
  </div>
  <spinner v-else></spinner>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewDepartment from '~/components/contacts/NewDepartment'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'ContactsList',
  components: {
    Spinner,
    NewDepartment,
    DisplayTableComponent,
    EditObjectModal,
    PopupMenuVue,
  },
  data() {
    return {
      hovered: null,
      disableSave: true,
      startSaveItem: false,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    departments() {
      return this.$store.getters.getItems('departments')
    },
    company() {
      return this.$store.getters.getItems('companies').find((el) => {
        return Number(el.code) === Number(this.$route.params.id)
      })
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('companies/getCompanies', { limit: 100, offset: 0 }),
      this.$store.dispatch('departments/getDepartments', this.$route.params.id),
    ]).then(() => {
      this.$store.dispatch('setLoading', false)
    })
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
  },
}
</script>
