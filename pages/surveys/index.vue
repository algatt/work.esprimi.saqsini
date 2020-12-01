<template>
  <div class="flex flex-wrap">
    <div class="w-full md:w-2/12">
      <side-tree-nav
        :parents="categories"
        :children="subcategories"
        parent-code-name="categoryCode"
        count-name="surveyCount"
        @parentChanged="parentChanged"
        @childChanged="childChanged"
        @newParent="newParent"
        @newChild="newChild"
      >
        <template v-slot:title>Categories </template>
        <template v-slot:newText>New Category</template>
      </side-tree-nav>
    </div>

    <display-table-component
      class="w-full md:w-10/12"
      :items="surveys"
      which="surveys"
      :disable-new-button="disableNewButton"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Companies</template>
      <template v-slot:titleContent>
        <p class="w-4/12">Name</p>
        <p class="w-3/12">Date</p>
        <p class="w-2/12">Responses</p>
        <p class="w-2/12">Questions</p>
      </template>
      <template v-slot:content="slotProps">
        <p
          class="w-full md:w-4/12 md:pl-1 flex items-center justify-between md:justify-start"
        >
          {{ slotProps.item.name }}
        </p>

        <p class="w-full md:w-3/12 md:pl-1 pl-1 my-1 md:mt-0">
          {{ slotProps.item.referenceDate }}
        </p>

        <p class="w-11/12 md:w-2/12 md:pl-5 my-1 md:my-0">
          {{ slotProps.item.responses }}
        </p>
        <p class="w-11/12 md:w-2/12 md:pl-5 my-1 md:my-0">
          {{ slotProps.item.questions }}
        </p>
        <p class="w-1/12 flex justify-end">
          <span
            v-if="hovered === slotProps.item.code"
            class="flex items-center"
          >
            <!--            <button-->
            <!--              class="btn-link-rounded"-->
            <!--              @click.stop="setCurrentItem(slotProps.item)"-->
            <!--            >-->
            <!--              <i class="fas fa-pencil-alt fa-fw"></i>-->
            <!--            </button>-->
            <button
              class="btn-link-rounded relative"
              @click.stop="showSubMenu = slotProps.item.code"
              @mouseenter="showSubMenu = slotProps.item.code"
            >
              <i class="fas fa-ellipsis-v fa-fw"></i>

              <popup-menu-vue
                v-if="showSubMenu === slotProps.item.code"
                direction="left"
                @closeMenu="
                  showSubMenu = null
                  hovered = null
                "
              >
                <template v-slot:menuItems>
                  <button @click.stop="setCurrentItem(slotProps.item)">
                    <i class="fas fa-pencil-alt fa-fw"></i>Edit
                  </button></template
                >
              </popup-menu-vue>
            </button>
          </span>
          <span> &nbsp; </span>
        </p>
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
          <new-category
            v-if="!objectToCreate"
            :selected-sector-code="selectedParentCode"
            :selected-industry-code="selectedChildCode"
          ></new-category>
          <new-category
            v-else-if="objectToCreate === 'category'"
          ></new-category>
          <new-subcategory
            v-else-if="objectToCreate === 'subcategory'"
          ></new-subcategory>
        </template>
      </edit-object-modal>
    </transition>
  </div>
</template>

<script>
// import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import SideTreeNav from '~/components/layouts/SideTreeNav'
import NewCategory from '~/components/surveys/NewCategory'
import NewSubcategory from '~/components/surveys/NewSubcategory'
import PopupMenuVue from '~/components/layouts/PopupMenu'

export default {
  name: 'CompaniesList',
  components: {
    PopupMenuVue,
    NewSubcategory,
    NewCategory,
    SideTreeNav,
    DisplayTableComponent,
    //  EditObjectModal,
  },
  data() {
    return {
      hovered: null,
      disableSave: true,
      selectedParentCode: -1,
      selectedChildCode: null,
      objectToCreate: null,
      showSubMenu: null,
    }
  },
  computed: {
    loading() {
      return this.$store.state.loading
    },
    categories() {
      return this.$store.getters.getItems('categories')
    },
    subcategories() {
      return this.$store.getters.getItems('subcategories')
    },
    disableNewButton() {
      return (
        this.$store.getters.getItems('categories').length === 0 ||
        this.$store.getters.getItems('subcategories').length === 0
      )
    },
    currentItemToBeEdited() {
      return this.$store.state.currentItemToBeEdited
    },
    surveys() {
      let tempResults = this.$store.getters.getItems('surveys')

      if (this.selectedParentCode === -1) return tempResults

      if (this.selectedChildCode) {
        tempResults = tempResults.filter((el) => {
          return el.subCategoryCode === this.selectedChildCode
        })
      } else {
        tempResults = tempResults.filter((el) => {
          return el.categoryCode === this.selectedParentCode
        })
      }

      return tempResults
    },
  },
  created() {
    this.$store.dispatch('setLoading', true)
    Promise.all([
      this.$store.dispatch('categories/getCategories'),
      this.$store.dispatch('surveys/getSurveysAll', { limit: 100, offset: 0 }),
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
      this.objectToCreate = 'category'
      this.setCurrentItem(ev)
    },
    newChild(ev) {
      this.objectToCreate = 'subcategory'
      this.setCurrentItem(ev)
    },
    modalClosed() {
      this.objectToCreate = null
    },
  },
}
</script>
