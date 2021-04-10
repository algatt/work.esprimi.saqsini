export default {
  data() {
    return {
      hovered: null,
      disableSave: true,
      subViewLoading: true,
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
  methods: {
    async setCurrentItem(item) {
      await this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
  },
}
