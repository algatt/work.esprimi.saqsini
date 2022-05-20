<template>
  <TreeView
    :items="sectors"
    :color="color"
    parent-name="Sector"
    child-name="Industry"
    count-field="companyCount"
    @updateParent="updateSector"
    @updateChild="updateIndustry"
    @changedOption="changedOption"
    @deleteParent="deleteSector"
    @deleteChild="deleteIndustry"
    @saveParent="saveSector"
    @saveChild="saveIndustry"
    >Sectors & Industries</TreeView
  >
</template>

<script>
import TreeView from '@/components/elements/TreeView/TreeView'
export default {
  name: 'CompanySectorTreeView',
  components: { TreeView },
  props: {
    sectors: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      default: 'blue',
    },
  },
  data() {
    return {
      selectedSector: null,
      selectedIndustry: null,
    }
  },
  methods: {
    changedOption(newOptions) {
      this.$emit('changedOption', newOptions)
      this.selectedSector = newOptions.parent
      this.selectedIndustry = newOptions.child
    },
    updateSector(code, name) {
      this.$store.dispatch('sectors/updateSector', { code, name }).then(() => {
        this.$toasted.show(`Sector ${name} updated`)
      })
    },
    updateIndustry(code, name) {
      this.$store
        .dispatch('industries/updateIndustry', { code, name })
        .then(() => {
          this.$toasted.show(`Industry ${name} updated`)
        })
    },
    deleteSector(code) {
      this.$store.dispatch('sectors/deleteSector', code).then(() => {
        this.$toasted.show('Sector deleted')
      })
    },
    deleteIndustry(code) {
      this.$store.dispatch('industries/deleteIndustry', code).then(() => {
        this.$toasted.show('Industry deleted')
      })
    },
    saveSector(name) {
      this.$store.dispatch('sectors/newSector', name).then(() => {
        this.$toasted.show(`Sector ${name} created`)
      })
    },
    saveIndustry(name) {
      this.$store
        .dispatch('industries/newIndustry', {
          name,
          abbr: name,
          sectorCode: this.selectedSector.code,
        })
        .then(() => {
          this.$toasted.show(`Industry ${name} created`)
        })
    },
  },
}
</script>

<style scoped></style>
