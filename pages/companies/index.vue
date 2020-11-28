<template>
  <div>
    <display-table-component
      type-of-object="companies"
      @hovered="hovered = $event"
    >
      <template v-slot:title>Companies</template>
      <template v-slot:titleContent>
        <p class="w-5/12">Name</p>
        <p class="w-3/12">Size</p>
        <p class="w-3/12">Logo</p>
      </template>
      <template v-slot:content="slotProps"
        ><p class="w-full md:w-5/12 md:pl-1">
          {{ slotProps.item.name }}
        </p>
        <p class="w-full md:w-3/12 md:pl-1">{{ slotProps.item.size }}</p>
        <p class="w-full md:w-3/12 md:pl-1">
          {{ slotProps.item.logo }}
        </p>
        <p class="w-full md:w-1/12 flex justify-end">
          <span v-if="hovered === slotProps.item.code" class="flex items-center"
            ><button
              class="btn-link"
              @click.stop="setCurrentItem(slotProps.item)"
            >
              <i class="fas fa-pencil-alt fa-fw"></i></button
          ></span>
          <span v-else>&nbsp;</span>
        </p>
      </template>
    </display-table-component>

    <transition name="fade">
      <edit-object-modal v-if="currentItemToBeEdited">
        <template v-slot:content>
          <new-contact></new-contact>
        </template>
      </edit-object-modal>
    </transition>
  </div>
</template>

<script>
import EditObjectModal from '~/components/layouts/EditObjectModal'
import DisplayTableComponent from '~/components/layouts/DisplayTableComponent'
import NewContact from '~/components/contacts/NewContact'
export default {
  name: 'CompaniesList',
  components: {
    NewContact,
    DisplayTableComponent,
    EditObjectModal,
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
  },
  created() {
    this.$store.dispatch('setLoading', true)
    this.$store
      .dispatch('companies/getCompanies', { limit: 100, offset: 0 })
      .finally(() => {
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
