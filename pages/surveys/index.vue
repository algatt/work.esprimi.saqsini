<template>
  <div v-if="!loading" class="flex flex-wrap">
    <display-table-component
      :items="surveys"
      which="surveys"
      new-text="Survey"
      :disable-new-button="disableNewButton"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:title>Survey List</template>
      <template v-slot:sideNav>
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
      </template>
      <template v-slot:titleContent>
        <p class="w-4/12">Name</p>
        <p class="w-4/12">Date</p>
        <p class="w-2/12 text-center">Responses</p>
        <p class="w-2/12 text-center">Questions</p>
      </template>
      <template v-slot:titleContentSmall>Surveys</template>

      <template v-slot:content="slotProps">
        <p
          class="w-8/12 md:w-4/12 flex items-center justify-between md:justify-start mb-1 md:mb-0"
        >
          {{ slotProps.item.name }}
          <i
            v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
            class="fas fa-trash fa-fw text-gray-300 ml-2"
          ></i>
        </p>

        <p
          class="w-4/12 md:w-4/12 flex justify-end md:justify-start mb-1 md:mb-0"
        >
          {{ slotProps.item.referenceDate }}
        </p>

        <p class="w-6/12 md:w-2/12 md:justify-center flex mb-1 md:mb-0">
          <button class="btn-table">
            {{ slotProps.item.responses
            }}<span class="flex md:hidden">&nbsp; Responses</span>
          </button>
        </p>
        <p
          class="w-6/12 md:w-2/12 md:justify-center flex justify-end md:justify-start mb-1 md:mb-0"
        >
          <nuxt-link
            :to="{ name: 'questions-id', params: { id: slotProps.item.code } }"
            @click.stop.native
          >
            <button class="btn-table">
              {{ slotProps.item.questions }}
              <span class="flex md:hidden">&nbsp; Questions</span>
            </button>
          </nuxt-link>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex md:hidden'"
          class="items-center"
        >
          <popup-menu-vue
            :object-code="slotProps.item.code"
            @closeMenu="hovered = null"
          >
            <template v-slot:menuItems>
              <button @click="setCurrentItem(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
                >
              </button>
              <button @click="duplicateSurvey(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-copy fa-fw fa-sm"></i>Duplicate</span
                >
              </button>
              <button
                v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
                @click="unflagFromDeletion(slotProps.item)"
              >
                <span class="popup-menu-button">
                  <i class="fas fa-trash-restore-alt fa-fw fa-sm"></i
                  >Restore</span
                >
              </button>
              <button v-else @click="flagForDeletion(slotProps.item)">
                <span class="popup-menu-button">
                  <i class="fas fa-flag fa-fw fa-sm"></i>Mark for Deletion</span
                >
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
          <new-survey
            v-if="!objectToCreate"
            :selected-category-code="selectedParentCode"
            :selected-subcategory-code="selectedChildCode"
          ></new-survey>
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
  <spinner v-else></spinner>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import SideTreeNav from '~/components/layouts/SideTreeNav'
import NewCategory from '~/components/surveys/NewCategory'
import NewSubcategory from '~/components/surveys/NewSubcategory'
import PopupMenuVue from '~/components/layouts/PopupMenu'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'CompaniesList',
  components: {
    PopupMenuVue,
    NewSubcategory,
    NewCategory,
    SideTreeNav,
    DisplayTableComponent,
    Spinner,
    EditObjectModal,
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
      return this.$store.getters.getItems('surveys')
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
      if (this.selectedParentCode !== null && this.selectedParentCode !== -1)
        this.$store.dispatch('surveys/getSurveysCategory', {
          limit: 1000,
          offset: 0,
          code: this.selectedParentCode,
        })
      else if (this.selectedParentCode === -1)
        this.$store.dispatch('surveys/getSurveysAll', {
          limit: 1000,
          offset: 0,
        })
    },
    childChanged(ev) {
      this.selectedChildCode = ev
      if (this.selectedChildCode !== null && this.selectedChildCode !== -1)
        this.$store.dispatch('surveys/getSurveysSubcategory', {
          limit: 1000,
          offset: 0,
          code: this.selectedChildCode,
        })
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
    flagForDeletion(survey) {
      this.$store.dispatch('surveys/flagForRemoval', survey)
    },
    unflagFromDeletion(survey) {
      this.$store.dispatch('surveys/unFlagForRemoval', survey)
    },
    duplicateSurvey(survey) {
      this.$store.dispatch('surveys/duplicateSurvey', survey)
    },
  },
}
</script>
