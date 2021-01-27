<template>
  <div class="flex-col">
    <div class="flex w-full flex-wrap p-5 items-start">
      <div class="flex flex-col pl-0 rounded-lg shadow w-full">
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
import TopTitleBar from '~/components/layouts/TopTitleBar'
import RowComponent from '~/components/layouts/RowComponent'

export default {
  name: 'DisplayTableComponent',
  components: { TopTitleBar, RowComponent },
  props: {
    items: {
      type: Array,
      required: true,
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
