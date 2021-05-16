<template>
  <list-layout v-if="!loading && !error && company">
    <data-table
      :table-data="departments"
      :table-definition="tableDepartments"
      @deleteAll="deleteDepartments"
    >
      <template v-slot:headerLeft>
        <h5 class="mt-2">Departments in {{ company.name }}</h5>
      </template>
      <template v-slot:headerRight>
        <new-item-button class="ml-2" @click="newDepartment"
          >New&nbsp;<span class="hidden md:flex"
            >Department</span
          ></new-item-button
        >
      </template>
      <template v-slot:name="slotProps">
        <span class="flex items-center space-x-2">
          <span>{{ slotProps.item.name }}</span>
          <l-badge>{{ slotProps.item.abbr }}</l-badge>
        </span>
      </template>
      <template v-slot:actions="slotProps">
        <div class="flex justify-end">
          <LPopupMenu>
            <template v-slot:menu>
              <button @click="editDepartment(slotProps.item)">
                <i class="fas fa-pencil-alt fa-fw"></i>Edit
              </button>
            </template>
          </LPopupMenu>
        </div>
      </template>
    </data-table>
  </list-layout>
  <page-load-error
    v-else-if="(!loading && error) || (!loading && !company)"
  ></page-load-error>
</template>

<script>
import ListLayout from '~/components/elements/ListLayout'
import DataTable from '~/components/elements/DataTable/DataTable'
import LPopupMenu from '~/components/LPopupMenu'
import NewItemButton from '~/components/elements/NewItemButton'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/elements/NewItemModal'
import PageLoadError from '~/components/elements/PageLoadError'
export default {
  name: 'Departments',
  middleware: ['contactBook'],
  layout: 'authlayout',

  components: {
    PageLoadError,
    NewItemButton,
    LPopupMenu,
    DataTable,
    ListLayout,
  },
  data() {
    return {
      loading: true,
      error: false,
      tableDepartments: [
        { title: 'Name', field: 'name', slot: 'name', sortable: true },
        { title: '', slot: 'actions', align: 'right' },
      ],
    }
  },

  computed: {
    departments() {
      return this.$store.state.departments.items
    },
    company() {
      return this.$store.state.companies.items.find((el) => {
        return Number(el.code) === Number(this.$route.params.id)
      })
    },
  },
  created() {
    this.loading = true
    this.updateData()
  },
  methods: {
    async updateData() {
      await this.$store.dispatch('contactlist/getContactLists', {})

      Promise.all([
        this.$store.dispatch('companies/getCompanies', {}),
        this.$store.dispatch(
          'departments/getDepartments',
          this.$route.params.id
        ),
      ])
        .catch(() => {
          this.error = true
        })
        .finally(() => {
          this.loading = false
        })
    },
    newDepartment() {
      const dataItem = {
        companyCode: this.company.code,
      }
      ModalService.open(NewItemModal, {
        whichComponent: 'NewDepartment',
        dataItem,
        options: {
          header: 'New Department',
        },
      })
        .then((response) => {
          this.$store
            .dispatch('departments/newDepartment', response)
            .then((department) => {
              this.$toasted.show(`Department ${department.name} created`)
            })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem creating the department')
        })
    },
    editDepartment(department) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewDepartment',
        dataItem: department,
        options: {
          header: `Edit ${department.name}`,
        },
      })
        .then((response) => {
          this.$store
            .dispatch('departments/updateDepartment', response)
            .then((department) => {
              this.$toasted.show(`Department ${department.name} updated`)
            })
        })
        .catch((error) => {
          if (error !== 'dismissed')
            this.$toasted.error('There was a problem updating the department')
        })
    },
    deleteDepartments(departments) {
      const calls = []
      for (const department in departments) {
        calls.push(
          this.$store.dispatch(
            'departments/deleteDepartment',
            departments[department].code
          )
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${departments.length} departments deleted`)
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the departments')
        })
    },
  },
}
</script>
