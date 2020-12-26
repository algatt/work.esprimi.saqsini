<template>
  <div class="w-full flex-col">
    <top-header-bar :which="which" :has-side-nav="$slots.sideNav"
      ><template v-slot:title><slot name="title"></slot></template>
      <template v-slot:button>
        <slot name="button"></slot>
        <button
          v-if="!hideNewButton"
          class="btn-primary px-5"
          :disabled="!!disableNewButton"
          @click="setCurrentItem({ code: -1 })"
        >
          New {{ newText }}
        </button></template
      ></top-header-bar
    >

    <div class="flex w-full flex-wrap p-0 md:p-5">
      <div :class="$slots.sideNav ? 'w-full md:mx-auto lg:w-3/12' : 'hidden'">
        <slot name="sideNav"></slot>
      </div>

      <div
        class="flex flex-col pl-0"
        :class="$slots.sideNav ? 'w-full lg:w-9/12 md:pl-3' : 'w-full'"
      >
        <top-title-bar>
          <template v-slot:content> <slot name="titleContent"></slot></template
          ><template v-slot:contentSmall
            ><slot name="titleContentSmall"></slot></template
        ></top-title-bar>
        <row-component
          v-for="item in items"
          :key="item.code"
          :item="item"
          @hovered="$emit('hovered', $event)"
          @clicked="$emit('clicked', $event)"
        >
          <template v-slot:content>
            <slot name="content" :item="item"></slot>
          </template>
          <template v-slot:popup-menu>
            <slot name="popup-menu" :item="item"></slot>
          </template>
        </row-component>
        <slot name="extra"></slot>
      </div>
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
    newText: {
      type: String,
      required: false,
    },
    disableNewButton: {
      type: Boolean,
      required: false,
      default: false,
    },
    hideNewButton: {
      type: Boolean,
      required: false,
      default: false,
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
