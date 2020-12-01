<template>
  <div class="w-full flex-col">
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

    <div class="flex w-full flex-wrap">
      <div :class="$slots.sideNav ? 'w-11/12 mx-auto md:w-2/12' : 'hidden'">
        <slot name="sideNav"></slot>
      </div>

      <div
        class="flex flex-col px-3"
        :class="
          $slots.sideNav ? 'w-11/12 md:w-10/12 mx-auto' : 'w-11/12 mx-auto'
        "
      >
        <top-title-bar>
          <template v-slot:content> <slot name="titleContent"></slot></template
        ></top-title-bar>
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
    </div>

    <div class="flex flex-col w-11/12 mx-auto">
      <slot name="extra"></slot>
    </div>
  </div>
</template>

<script>
import TopHeaderBar from '~/components/layouts/TopHeaderBar'
import TopTitleBar from '~/components/layouts/TopTitleBar'
import RowComponent from '~/components/layouts/RowComponent'

export default {
  name: 'DisplayTableComponent',
  components: { TopTitleBar, TopHeaderBar, RowComponent },
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
