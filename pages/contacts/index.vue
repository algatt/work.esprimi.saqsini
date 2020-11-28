<template>
  <div class="flex flex-col">
    <top-info-bar
      v-if="selectedItemsLength > 0"
      store-object="contacts"
    ></top-info-bar>
    <top-header-bar v-else
      ><template v-slot:title>Contacts</template>
      <template v-slot:button>New</template></top-header-bar
    >
    <top-title-bar>
      <template v-slot:content>
        <p class="w-3/12">Name</p>
        <p class="w-2/12">Birth Date</p>
        <p class="w-3/12">Email</p>
        <p class="w-1/12">Gender</p>
        <p class="w-2/12">Phone</p></template
      ></top-title-bar
    >

    <div class="flex flex-col w-11/12 mx-auto">
      <row-component
        v-for="item in contacts"
        :key="item.code"
        :item="item"
        @hovered="hovered = $event"
      >
        <template v-slot:content>
          <p class="w-full md:w-3/12 md:pl-1">{{ item.displayName }}</p>
          <p class="w-full md:w-2/12 md:pl-1">{{ item.dob }}</p>
          <p class="w-full md:w-3/12 md:pl-1">
            {{ item.email }}
          </p>
          <p class="w-full md:w-1/12 md:pl-1">
            <template v-if="item.gender !== 'X'">{{ item.gender }}</template>
          </p>
          <p class="w-full md:w-2/12 md:pl-1">
            <template v-if="item.contactNumber !== 0"
              >{{ item.countryExtension }} {{ item.contactNumber }}</template
            >
          </p>
          <p class="w-full md:w-1/12 flex justify-end">
            <span v-if="hovered === item.code" class="flex items-center"
              ><button class="btn-link" @click.stop="editItem(item)">
                <i class="fas fa-pencil-alt fa-fw"></i></button
            ></span>
            <span v-else>&nbsp;</span>
          </p>
        </template>
      </row-component>
    </div>
  </div>
</template>

<script>
import RowComponent from '~/components/layouts/RowComponent'
import TopInfoBar from '~/components/layouts/TopInfoBar'
import TopTitleBar from '~/components/layouts/TopTitleBar'
export default {
  name: 'IndexVue',
  components: { TopTitleBar, TopInfoBar, RowComponent },
  data() {
    return {
      hovered: null,
    }
  },
  computed: {
    contacts() {
      return this.$store.getters.getItems('contacts')
    },
    loading() {
      return this.$store.state.loading
    },
    selectedItemsLength() {
      return this.$store.state.selectedItems.length
    },
  },
  created() {
    this.$store.dispatch('contacts/getContacts', { limit: 100, offset: 0 })
  },
  methods: {
    editItem(item) {
      console.log(item)
    },
  },
}
</script>

<style scoped></style>
