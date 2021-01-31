<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar which="surveys" :items="surveys" class="w-full"
      ><template v-slot:title>Surveys</template>
      <template v-slot:button>
        <button
          v-if="!disableNewButton && surveys.length !== 0"
          class="btn btn-primary"
          @click="setCurrentItem({ code: -1 })"
        >
          <i class="fas fa-plus fa-sm fa-fw mr-1"></i>New Survey
        </button></template
      ></top-header-bar
    >

    <side-tree-nav
      class="w-full xl:w-3/12"
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

    <info-box v-if="disableNewButton" class="flex-grow mx-5 mt-2 md:mt-0">
      <template v-slot:title>We have a problem...</template>
      <template v-slot:content>
        You cannot create a survey right now. Make sure to have set up
        categories and at least one subcategory.
      </template>
    </info-box>

    <info-box
      v-else-if="surveys.length === 0"
      class="flex-grow mx-5 mt-2 md:mt-0"
    >
      <template v-slot:title>No Surveys here...</template>
      <template v-slot:content>
        <button class="btn-link" @click="setCurrentItem({ code: -1 })">
          Create Survey
        </button>
      </template></info-box
    >

    <display-table-component
      v-else
      class="w-full xl:w-9/12"
      :items="surveys"
      @hovered="hovered = $event"
      @clicked="setCurrentItem($event)"
    >
      <template v-slot:titleContent>
        <p class="w-4/12">Name</p>
        <p class="w-4/12">Date</p>
        <p class="w-2/12 text-center">Responses</p>
        <p class="w-2/12 text-center">Questions</p>
      </template>
      <template v-slot:titleContentSmall>Surveys</template>

      <template v-slot:content="slotProps">
        <p class="w-full xl:w-4/12 flex items-center">
          {{ slotProps.item.name }}
          <i
            v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
            class="fas fa-trash fa-fw text-gray-300 ml-2"
          ></i>
        </p>

        <p class="w-full xl:w-4/12 flex">
          {{ slotProps.item.referenceDate }}
        </p>

        <p class="w-full xl:w-2/12 flex xl:justify-center">
          <button class="btn-link">
            {{ slotProps.item.responses
            }}<span class="flex xl:hidden">&nbsp; Responses</span>
          </button>
        </p>
        <p class="w-full xl:w-2/12 flex xl:justify-center">
          <nuxt-link
            :to="{
              name: 'questions-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
          >
            <button class="btn-link">
              {{ slotProps.item.questions }}
              <span class="flex xl:hidden">&nbsp; Questions</span>
            </button>
          </nuxt-link>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
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
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'

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
    TopHeaderBar,
    InfoBox,
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
