<template>
  <TreeView
    :items="categories"
    :color="color"
    parent-name="Category"
    child-name="Subcategory"
    count-field="surveyCount"
    @updateParent="updateCategory"
    @updateChild="updateSubcategory"
    @changedOption="changedOption"
    @deleteParent="deleteCategory"
    @deleteChild="deleteSubcategory"
    @saveParent="saveCategory"
    @saveChild="saveSubcategory"
    >Categories</TreeView
  >
</template>

<script>
import TreeView from '~/components/elements/TreeView/TreeView'
export default {
  name: 'SurveyCategoryTreeView',
  components: { TreeView },
  props: {
    categories: {
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
      selectedCategory: null,
      selectedSubcategory: null,
    }
  },
  methods: {
    changedOption(newOptions) {
      this.$emit('changedOption', newOptions)
      this.selectedCategory = newOptions.parent
      this.selectedSubcategory = newOptions.child
    },
    updateCategory(code, name) {
      this.$store
        .dispatch('categories/updateCategory', { code, name })
        .then(() => {
          this.$toasted.show(`Category ${name} updated`)
        })
    },
    updateSubcategory(code, name) {
      this.$store
        .dispatch('categories/updateSubcategory', { code, name })
        .then(() => {
          this.$toasted.show(`Subcategory ${name} updated`)
        })
    },
    deleteCategory(code) {
      this.$store.dispatch('categories/deleteCategory', code).then(() => {
        this.$toasted.show('Category deleted')
      })
    },
    deleteSubcategory(code) {
      this.$store.dispatch('categories/deleteSubcategory', code).then(() => {
        this.$toasted.show('Subcategory deleted')
      })
    },
    saveCategory(name) {
      this.$store.dispatch('categories/saveCategory', name).then(() => {
        this.$toasted.show(`Category ${name} created`)
      })
    },
    saveSubcategory(name) {
      this.$store
        .dispatch('categories/saveSubcategory', {
          name,
          categoryCode: this.selectedCategory.code,
        })
        .then(() => {
          this.$toasted.show(`Subcategory ${name} created`)
        })
    },
  },
}
</script>

<style scoped></style>
