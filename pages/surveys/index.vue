<template>
  <list-layout-with-sidebar v-if="!loading">
    <template #sidebar>
      <div class="px-3 py-3">
        <SurveyCategoryTreeView
          color="blue"
          :categories="categories"
          @changedOption="changedOption"
        ></SurveyCategoryTreeView></div
    ></template>
    <template #content>
      <DataTable
        :table-data="surveys"
        :table-definition="tableSurvey"
        @deleteAll="deleteMultipleSurveys"
      >
        <template #headerLeft><h6>Surveys</h6></template>
        <template #headerRight
          ><new-item-button class="ml-2" @click="showNewItem"
            >New Survey</new-item-button
          ></template
        >
        <template #Kiosk="slotProps">
          <div class="flex justify-center">
            <l-toggle
              :checked="slotProps.item.flags.includes('KIOSK')"
              @clicked="setKioskMode($event, slotProps.item)"
            >
            </l-toggle>
          </div>
        </template>
        <template #Availability="slotProps">
          <div class="flex justify-center">
            <l-toggle
              :checked="slotProps.item.flags.includes('ACTIVE')"
              @clicked="changeAvailability($event, slotProps.item)"
            >
            </l-toggle>
          </div>
        </template>
        <template #ResponseRate="slotProps">
          <nuxt-link
            :to="{
              name: 'surveys-responses-id',
              params: { id: slotProps.item.code },
            }"
          >
            <l-progress
              :current-value="slotProps.item.responses"
              :total-value="slotProps.item.invitees"
            ></l-progress>
          </nuxt-link>
        </template>
        <template #Actions="slotProps">
          <span class="flex justify-center">
            <LPopupMenu>
              <template v-slot:menu
                ><nuxt-link
                  :to="{
                    name: 'questions-id',
                    params: { id: slotProps.item.code },
                  }"
                >
                  <button>
                    <i class="fas fa-question fa-fw fa-sm"></i>Manage Questions
                  </button></nuxt-link
                >
                <button @click="editSurvey(slotProps.item)">
                  <i class="fas fa-pencil-alt fa-fw fa-sm"></i>Edit Survey
                </button>
                <button @click="duplicateSurvey(slotProps.item)">
                  <i class="fas fa-copy fa-fw fa-sm"></i>Duplicate
                </button>
                <button
                  v-if="slotProps.item.flags.includes('FLAGGED_FOR_REMOVAL')"
                  @click="unflagFromDeletion(slotProps.item)"
                >
                  <i class="fas fa-trash-restore-alt fa-fw fa-sm"></i>Restore
                </button>
                <button v-else @click="flagForDeletion(slotProps.item)">
                  <i class="fas fa-flag fa-fw fa-sm"></i>Mark for Deletion
                </button>
                <button
                  v-if="slotProps.item.flags.includes('KIOSK')"
                  @click="copyUrl(slotProps.item.publicIdentifier)"
                >
                  <i class="fas fa-globe-europe fa-sm fa-fw"></i>Public URL
                </button>
                <button @click="anonymiseResponses(slotProps.item.code)">
                  <i class="fas fa-user-secret fa-fw fa-sm"></i>Anonymise
                  Respondents
                </button>
              </template></LPopupMenu
            ></span
          >
        </template></DataTable
      >
    </template>

    <!--        <p class="w-full xl:w-2/12 flex xl:justify-center mb-2 md:mb-0">-->
    <!--          <nuxt-link-->
    :to="{ name: 'questions-id', params: { id: slotProps.item.code }, }"
    <!--            @click.stop.native-->
    <!--          >-->
    <!--            <text-link>Manage Survey</text-link>-->
    <!--          </nuxt-link>-->
    <!--        </p>-->
    <!--      </template>-->
  </list-layout-with-sidebar>
  <div v-else>loading</div>
</template>

<script>
import viewMixin from '~/helpers/viewMixin'
import SurveyCategoryTreeView from '~/components/layouts/Surveys/SurveyCategoryTreeView'
import ListLayoutWithSidebar from '~/components/layouts/ListLayoutWithSidebar'
import DataTable from '~/components/elements/DataTable/DataTable'
import NewItemButton from '~/components/elements/NewItemButton'
import ModalService from '~/services/modal-services'
import NewItemModal from '~/components/layouts/NewItemModal'
import LToggle from '~/components/elements/LToggle'
import LProgress from '~/components/LProgress'

export default {
  name: 'SurveyList',
  middleware: ['surveyBuilder'],
  layout: 'authlayout',
  components: {
    LProgress,
    LToggle,
    DataTable,
    ListLayoutWithSidebar,
    SurveyCategoryTreeView,
    NewItemButton,
  },
  mixins: [viewMixin],
  data() {
    return {
      selectedCategory: null,
      selectedSubcategory: null,
      selectedData: [],
      objectToCreate: null,
      showSubMenu: null,
      tableSurvey: [
        {
          title: 'Survey',
          field: 'name',
          sortable: true,
        },
        { title: 'Date', field: 'referenceDate', sortable: true },
        { title: 'Kiosk', slot: 'Kiosk', align: 'center' },
        { title: 'Availability', slot: 'Availability', align: 'center' },
        { title: 'Response Rate', slot: 'ResponseRate', align: 'center' },
        { title: 'Actions', slot: 'Actions', align: 'center' },
      ],
    }
  },
  computed: {
    categories() {
      return this.$store.getters['categories/getCategoriesForTreeView']
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
    showNewItem() {
      const dataItem = {}
      if (this.selectedCategory)
        dataItem.categoryCode = this.selectedCategory.code
      if (this.selectedSubcategory)
        dataItem.subCategoryCode = this.selectedSubcategory.code

      ModalService.open(NewItemModal, {
        whichComponent: 'NewSurvey',
        dataItem,
        options: { header: 'New Survey' },
      }).then((response) => {
        this.$store
          .dispatch('surveys/newSurvey', response)
          .then((survey) => {
            this.$toasted.show(`Survey ${survey.name} created`)
            this.$store.dispatch('categories/getCategories')
            this.changedOption({
              parent: this.selectedCategory,
              child: this.selectedSubcategory,
            })
          })
          .catch(() => {
            this.$toasted.error('There was a problem creating the survey')
          })
      })
    },
    editSurvey(dataItem) {
      ModalService.open(NewItemModal, {
        whichComponent: 'NewSurvey',
        dataItem,
        options: { header: `Edit ${dataItem.name}` },
      }).then((response) => {
        this.$store
          .dispatch('surveys/updateSurvey', response)
          .then((survey) => {
            this.$store.dispatch('categories/getCategories')
            this.$toasted.show(`Survey ${survey.name} updated`)
          })
          .catch(() => {
            this.$toasted.error('There was a problem updating the survey')
          })
      })
    },
    changedOption(newOption) {
      this.selectedCategory = newOption.parent
      this.selectedSubcategory = newOption.child
      if (!this.selectedCategory)
        this.$store.dispatch('surveys/getSurveysAll', { limit: 100, offset: 0 })
      else if (this.selectedCategory && !this.selectedSubcategory)
        this.$store.dispatch('surveys/getSurveysCategory', {
          code: this.selectedCategory.code,
        })
      else {
        this.$store.dispatch('surveys/getSurveysSubcategory', {
          code: this.selectedSubcategory.code,
        })
      }
    },
    deleteMultipleSurveys(surveys) {
      const calls = []
      for (const survey in surveys) {
        calls.push(
          this.$store.dispatch('surveys/deleteSurvey', surveys[survey].code)
        )
      }
      Promise.all(calls)
        .then(() => {
          this.$toasted.show(`${surveys.length} surveys deleted`)
          this.$store.dispatch('categories/getCategories')
          this.changedOption({
            parent: this.selectedCategory,
            child: this.selectedSubcategory,
          })
        })
        .catch(() => {
          this.$toasted.error('There was a problem deleting the surveys')
        })
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

    copyUrl(url) {
      url = `${process.env.siteUrl}survey?id=${url}`
      navigator.clipboard.writeText(url).then(() => {
        this.$toasted.show('URL copied to clipboard', {
          action: { text: 'GO', href: url, target: '_blank' },
        })
      })
    },
    anonymiseResponses(code) {
      this.$store
        .dispatch('invitations/anonymiseResponses', code)
        .then(() => {
          this.$toasted.show('Responses anonymised')
        })
        .catch(() => {
          this.$toasted.show('There was a problem anonymising the responses')
        })
    },
  },
}
</script>
