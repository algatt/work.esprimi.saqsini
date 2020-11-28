<template>
  <div v-if="!loading">
    <top-info-bar
      v-if="selectedItemsLength > 0"
      :store-object="typeOfObject"
    ></top-info-bar>
    <top-header-bar v-else
      ><template v-slot:title><slot name="title"></slot></template>
      <template v-slot:button>
        <button class="btn-primary px-5" @click="setCurrentItem({ code: -1 })">
          New
        </button></template
      ></top-header-bar
    >
    <top-title-bar>
      <template v-slot:content> <slot name="titleContent"></slot></template
    ></top-title-bar>

    <div class="flex flex-col w-11/12 mx-auto">
      <row-component
        v-for="item in items"
        :key="item.code"
        :item="item"
        @hovered="$emit('hovered', $event)"
      >
        <template v-slot:content>
          <slot name="content" :item="item"></slot>
        </template>
      </row-component>
    </div>

    <slot name="extraContent"></slot>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import TopInfoBar from '~/components/layouts/TopInfoBar'
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import TopTitleBar from '~/components/layouts/TopTitleBar'
import RowComponent from '~/components/layouts/RowComponent'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'DisplayTableComponent',
  components: { Spinner, TopInfoBar, TopTitleBar, TopHeaderBar, RowComponent },
  props: {
    typeOfObject: {
      type: String,
      required: true,
    },
  },
  computed: {
    selectedItemsLength() {
      return this.$store.state.selectedItems.length
    },
    items() {
      return this.$store.getters.getItems(this.typeOfObject)
    },
    loading() {
      return this.$store.state.loading
    },
  },
  methods: {
    setCurrentItem(item) {
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
  },
}
</script>

<style scoped></style>
