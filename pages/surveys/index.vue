<template>
  <div v-if="!loading" class="flex flex-wrap items-start">
    <top-header-bar
      which="surveys"
      :items="surveys"
      class="w-full"
      :hide-menu="disableNewButton || surveys.length === 0"
      ><template v-slot:title>Surveys</template>
      <template v-slot:extraButtons>
        <button-icon
          v-if="!disableNewButton"
          colour="primary"
          icon="fas fa-plus"
          @click="setCurrentItem({ code: -1 })"
        >
          <template v-slot:text>New Survey</template>
        </button-icon></template
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
          <p class="text-sm py-1">
            {{ slotProps.item.referenceDate }}
          </p>
        </div>

        <p class="w-full xl:w-2/12 flex mb-2 xl:mb-0">
          <toggle-switch
            class="block xl:hidden"
            :checked="slotProps.item.flags.includes('KIOSK')"
            @clicked="setKioskMode($event, slotProps.item)"
          >
            <template v-slot:leftLabel>No Kiosk</template>
            <template v-slot:rightLabel>Enable Kiosk</template>
          </toggle-switch>
          <toggle-switch
            class="hidden xl:block"
            :checked="slotProps.item.flags.includes('KIOSK')"
            @clicked="setKioskMode($event, slotProps.item)"
          >
          </toggle-switch>
        </p>

        <p class="w-full xl:w-2/12 flex mb-2 xl:mb-0">
          <toggle-switch
            class="block xl:hidden"
            :checked="slotProps.item.flags.includes('ACTIVE')"
            @clicked="changeAvailability($event, slotProps.item)"
          >
            <template v-slot:leftLabel>Disabled</template>
            <template v-slot:rightLabel>Accepting Responses</template>
          </toggle-switch>
          <toggle-switch
            class="hidden xl:block"
            :checked="slotProps.item.flags.includes('ACTIVE')"
            @clicked="changeAvailability($event, slotProps.item)"
          >
          </toggle-switch>
        </p>

        <p class="w-full xl:w-2/12 flex xl:justify-center mb-2 xl:mb-0 xl:px-5">
          <span class="block xl:hidden mr-2">Response Rate</span>
          <span class="flex flex-1">
            <nuxt-link
              :to="{
                name: 'surveys-responses-id',
                params: { id: slotProps.item.code },
              }"
              class="w-full"
              @click.stop.native
            >
              <button class="w-full bg-gray-100 relative h-7">
                <span
                  class="absolute left-0 top-0 h-7"
                  :class="
                    slotProps.item.responses === slotProps.item.invitees
                      ? 'bg-primary'
                      : 'bg-gray-300'
                  "
                  :style="{
                    width: `${calculateWidth(
                      slotProps.item.responses,
                      slotProps.item.invitees
                    )}%`,
                  }"
                  >&nbsp;</span
                ><span
                  class="absolute font-semibold top-0 left-0 w-full flex justify-center items-center h-full"
                  ><span
                    class="bg-white bg-opacity-50 text-gray-800 rounded-xl px-1 text-sm"
                    >{{
                      calculateWidth(
                        slotProps.item.responses,
                        slotProps.item.invitees
                      )
                    }}%</span
                  ></span
                >
              </button>
            </nuxt-link>
          </span>
          <!--          <span v-if="slotProps.item.responses === 0">No responses</span>-->
        </p>
        <p class="w-full xl:w-2/12 flex xl:justify-center mb-2 md:mb-0">
          <nuxt-link
            :to="{
              name: 'questions-id',
              params: { id: slotProps.item.code },
            }"
            @click.stop.native
          >
            <button class="btn-link">Manage Survey</button>
          </nuxt-link>
        </p>
      </template>
      <template v-slot:popup-menu="slotProps">
        <span
          :class="hovered === slotProps.item.code ? 'flex' : 'flex xl:hidden'"
          class="items-center"
        >
          <popup-menu
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
              <button v-if="slotProps.item.flags.includes('KIOSK')">
                <nuxt-link
                  class="popup-menu-button"
                  :to="{
                    name: 'survey',
                    query: { id: slotProps.item.publicIdentifier },
                  }"
                >
                  <i class="fas fa-globe-europe fa-sm fa-fw"></i>Public
                  URL</nuxt-link
                >
              </button>
            </template>
          </popup-menu>
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
import Spinner from '~/components/layouts/Spinner'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import InfoBox from '~/components/layouts/InfoBox'
import viewMixin from '~/helpers/viewMixin'
import ButtonIcon from '~/components/layouts/ButtonIcon'
import PopupMenu from '~/components/layouts/PopupMenu'
import NewSurvey from '~/components/surveys/NewSurvey'
import ToggleSwitch from '~/components/layouts/ToggleSwitch'

export default {
  name: 'SurveyList',
  components: {
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
    PopupMenu,
    NewSurvey,
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
  },
}
</script>
