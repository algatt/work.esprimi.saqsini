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
    setCurrentItem(item) {
      console.log(item)
      this.$store.dispatch('setCurrentItemToBeEdited', item)
    },
  },
}
