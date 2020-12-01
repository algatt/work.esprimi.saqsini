<template>
  <div v-if="!loading">
    <!--    <top-info-bar v-if="selectedItemsLength > 0" :which="which"></top-info-bar>-->
    <top-header-bar :which="which"
      ><template v-slot:title><slot name="title"></slot></template>
      <template v-slot:button>
        <slot name="button"></slot>
        <button
          class="btn-primary px-5"
          :disabled="!!disableNewButton"
          @click="setCurrentItem({ code: -1 })"
        >
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
        :height-of-row="heightOfRow"
        @hovered="$emit('hovered', $event)"
      >
        <template v-slot:content>
          <slot name="content" :item="item"></slot>
        </template>
        <template v-slot:popup-menu>
          <slot name="popup-menu" :item="item"></slot>
        </template>
      </row-component>
    </div>

    <div class="flex flex-col w-11/12 mx-auto">
      <slot name="extra"></slot>
    </div>
  </div>
  <spinner v-else></spinner>
</template>

<script>
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import TopTitleBar from '~/components/layouts/TopTitleBar'
import RowComponent from '~/components/layouts/RowComponent'
import Spinner from '~/components/layouts/Spinner'

export default {
  name: 'DisplayTableComponent',
  components: { Spinner, TopTitleBar, TopHeaderBar, RowComponent },
  props: {
    items: {
      type: Array,
      required: true,
    },
    which: {
      type: String,
      required: true,
    },
    disableNewButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    heightOfRow: {
      required: false,
      type: String,
      default: 'h-auto md:h-14',
    },
  },
  computed: {
    selectedItemsLength() {
      return this.$store.state.selectedItems.length
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
