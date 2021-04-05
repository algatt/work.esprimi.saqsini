<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="surveys"
      :items="surveys"
      :hide-menu="disableNewButton || surveys.length === 0"
      ><template v-slot:title>Surveys</template>
      <template v-slot:extraButtons>
        <button-icon
          v-if="!disableNewButton && surveys.length !== 0"
          @click="setCurrentItem({ code: -1 })"
          >New Survey
          <template v-slot:icon
            ><i class="fas fa-plus fa-sm fa-fw"></i
          ></template> </button-icon></template
    ></top-header-bar>

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
        <button-base @click="setCurrentItem({ code: -1 })">
          Create Survey
        </button-base>
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
        <p class="w-2/12">Kiosk</p>
        <p class="w-2/12">Availability</p>
        <p class="w-2/12 text-center">Responses</p>
        <p class="w-2/12 text-center"></p>
      </template>
      <template v-slot:titleContentSmall>Surveys</template>

      <template v-slot:content="slotProps">
        <div class="w-full xl:w-4/12 flex flex-col mb-2 xl:mb-0">
          <p class="mb-2 md:mb-0">
            {{ slotProps.item.name }}
            <i
              v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
              class="fas fa-trash fa-fw text-gray-300 ml-2"
            ></i>
          </p>
          <p class="py-1">
            {{ slotProps.item.referenceDate }}
          </p>
        </div>

        <p class="w-6/12 xl:w-2/12 flex mb-2 xl:mb-0">
          <span class="flex xl:hidden">Kiosk</span>
          <toggle-switch
            :checked="slotProps.item.flags.includes('KIOSK')"
            @clicked="setKioskMode($event, slotProps.item)"
          >
          </toggle-switch>
        </p>

        <p class="w-6/12 xl:w-2/12 flex mb-2 xl:mb-0">
          <span class="flex xl:hidden">Available</span>
          <toggle-switch
            :checked="slotProps.item.flags.includes('ACTIVE')"
            @clicked="changeAvailability($event, slotProps.item)"
          >
          </toggle-switch>
        </p>

        <p class="w-full xl:w-2/12 flex xl:justify-center mb-2 xl:mb-0 xl:px-5">
          <span class="block xl:hidden mr-2">Response Rate</span>
          <span class="flex flex-1 text-left xl:text-center">
            <nuxt-link
              :to="{
                name: 'surveys-responses-id',
                params: { id: slotProps.item.code },
              }"
              class="w-full"
              @click.stop.native
            >
              <text-link
                >{{ slotProps.item.responses }} /
                {{ slotProps.item.invitees }}</text-link
              >
            </nuxt-link>
          </span>
        </p>
        <p class="w-full xl:w-2/12 flex xl:justify-center mb-2 md:mb-0">
          <nuxt-link
            :to="{
              name: 'questions-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
          >
            <text-link>Manage Survey</text-link>
          </nuxt-link>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <display-table-row-popup
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
          @close="hovered = null"
        >
          <template v-slot:menu>
            <span @click="setCurrentItem(slotProps.item)">
              <i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit</span
            >
            <span @click="duplicateSurvey(slotProps.item)">
              <i class="fas fa-copy fa-fw fa-sm"></i>Duplicate</span
            >
            <span
              v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
              @click="unflagFromDeletion(slotProps.item)"
            >
              <i class="fas fa-trash-restore-alt fa-fw fa-sm"></i>Restore
            </span>
            <span v-else @click="flagForDeletion(slotProps.item)">
              <i class="fas fa-flag fa-fw fa-sm"></i>Mark for Deletion
            </span>
            <span
              v-if="slotProps.item.flags.includes('KIOSK')"
              @click="copyUrl(slotProps.item.publicIdentifier)"
            >
              <i class="fas fa-globe-europe fa-sm fa-fw"></i>Public URL
            </span>
          </template>
        </display-table-row-popup>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal
        v-if="currentItemToBeEdited"
        @modalClosed="modalClosed"
      >
        <template v-slot:secondTitle>
          <span v-if="!objectToCreate">Survey</span>
          <span v-else-if="objectToCreate === 'category'">Category</span>
          <span v-else-if="objectToCreate === 'subcategory'">Subcategory</span>
        </template>
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
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'
import viewMixin from '~/helpers/viewMixin'
import ButtonIcon from '~/components/elements/ButtonIcon'
import NewSurvey from '~/components/surveys/NewSurvey'
import ToggleSwitch from '~/components/elements/ToggleSwitch'
import ButtonBase from '~/components/elements/ButtonBase'
import DisplayTableRowPopup from '~/components/layouts/DisplayTableRowPopup'
import TextLink from '~/components/elements/TextLink'

export default {
  name: 'SurveyList',
  components: {
    TextLink,
    DisplayTableRowPopup,
    ToggleSwitch,
    NewSubcategory,
    NewCategory,
    SideTreeNav,
    DisplayTableComponent,
    Spinner,
    EditObjectModal,
    TopHeaderBar,
    InfoBox,
    ButtonIcon,
    NewSurvey,
    ButtonBase,
  },
  mixins: [viewMixin],
  data() {
    return {
      selectedParentCode: -1,
      selectedChildCode: null,
      objectToCreate: null,
      showSubMenu: null,
    }
  },
  computed: {
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
      this.$store.dispatch('surveys/flagForRemoval', survey).then(() => {
        this.$toasted.show(`${survey.name} marked for deletion`)
      })
    },
    unflagFromDeletion(survey) {
      this.$store.dispatch('surveys/unFlagForRemoval', survey).then(() => {
        this.$toasted.show(`${survey.name} removed from deletion`)
      })
    },
    duplicateSurvey(survey) {
      this.$store.dispatch('surveys/duplicateSurvey', survey).then(() => {
        this.$toasted.show(`${survey.name} duplicated successfully`)
      })
    },
    setKioskMode(state, survey) {
      if (state) {
        this.$store.dispatch('surveys/setKioskMode', survey).then(() => {
          this.$toasted.show(`${survey.name} is in Kiosk mode`)
        })
      } else {
        this.$store.dispatch('surveys/clearKioskMode', survey).then(() => {
          this.$toasted.show(`${survey.name} is not in Kiosk mode`)
        })
      }
    },
    changeAvailability(state, survey) {
      if (state) {
        this.$store.dispatch('surveys/reopenSurvey', survey).then(() => {
          this.$toasted.show(`${survey.name} is accepting responses`)
        })
      } else {
        this.$store.dispatch('surveys/closeSurvey', survey).then(() => {
          this.$toasted.show(`${survey.name} is not accepting responses`)
        })
      }
    },
    calculateWidth(responses, invitees) {
      const x = responses / invitees
      return isNaN(x) ? 0 : Math.round(x * 100)
    },
    copyUrl(url) {
      url = `${process.env.siteUrl}survey?id=${url}`
      navigator.clipboard.writeText(url).then(() => {
        this.$toasted.show('URL copied to clipboard', {
          action: { text: 'GO', href: url, target: '_blank' },
        })
      })
    },
  },
}
</script>
