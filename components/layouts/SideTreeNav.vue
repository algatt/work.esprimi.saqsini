<template>
  <div class="flex flex-col">
    <div class="h-16 flex items-center font-bold">Sectors and Industries</div>
    <button
      class="w-full flex items-center justify-between mb-1 p-1 font-medium hover:text-primary transition duration-300"
      :class="selectedParent === -1 ? 'text-primary' : 'text-gray-600'"
      @click="selectParent({ code: -1 })"
    >
      <span
        ><i
          class="fas fa-fw mr-1"
          :class="
            selectedParent === -1
              ? 'fa-folder-open text-primary'
              : 'fa-folder text-gray-400'
          "
        ></i
        >All</span
      >
    </button>
    <div
      v-for="parentItem in parents"
      :key="parentItem.code"
      class="mb-1 p-1 flex flex-col"
    >
      <button
        class="w-full flex items-center justify-between font-medium mb-1 hover:text-primary transition duration-300"
        :class="
          selectedParent === parentItem.code ? 'text-primary' : 'text-gray-600'
        "
        @click="selectParent(parentItem)"
      >
        <span
          ><i
            class="fas fa-fw mr-1"
            :class="
              selectedParent === parentItem.code
                ? 'fa-folder-open text-primary'
                : 'fa-folder text-gray-400'
            "
          ></i
          >{{ parentItem.name }}</span
        >
        <div class="flex items-center justify-end">
          <button
            v-if="selectedParent === parentItem.code"
            class="text-gray-400 hover:text-primary transition duration-300"
            @click="$emit('newParent', parentItem)"
          >
            <i class="fas fa-pencil-alt fa-fw"></i>
          </button>
          <span v-if="countName">{{ parentItem[countName] }}</span>
        </div>
      </button>
      <template v-if="selectedParent === parentItem.code">
        <div
          v-for="childItem in filteredChildren(parentItem.code)"
          :key="childItem.code"
          class="flex flex-col pl-2 mb-1"
        >
          <button
            class="w-full flex items-center justify-between font-medium hover:text-primary transition duration-300"
            :class="
              selectedChild === childItem.code
                ? 'text-primary'
                : 'text-gray-600'
            "
            @click="selectChild(childItem)"
          >
            <span
              ><i
                class="fas fa-fw mr-1"
                :class="
                  selectedChild === childItem.code
                    ? 'fa-folder-open text-primary'
                    : 'fa-folder text-gray-400'
                "
              ></i
              >{{ childItem.name }}</span
            >
            <div class="flex items-center justify-end">
              <button
                v-if="selectedChild === childItem.code"
                class="text-gray-400 hover:text-primary transition duration-300"
                @click="$emit('newChild', childItem)"
              >
                <i class="fas fa-pencil-alt fa-fw"></i>
              </button>
              <span v-if="countName">{{ childItem[countName] }}</span>
            </div>
          </button>
        </div>
        <div class="flex flex-col pl-2 mb-1">
          <button
            class="w-full flex items-center justify-between font-medium text-gray-600 hover:text-primary transition duration-300"
            @click="$emit('newChild', { code: -1 })"
          >
            <span
              ><i class="fas fa-fw fa-folder-plus mr-1 text-gray-400"></i
              >New</span
            >
          </button>
        </div>
      </template>
    </div>
    <button
      class="w-full flex items-center justify-between mb-1 p-1 font-medium hover:text-primary transition duration-300 text-gray-600"
      @click="$emit('newParent', { code: -1 })"
    >
      <span
        ><i class="fas fa-fw fa-folder-plus mr-1 text-gray-400"></i>New
        Sector</span
      >
    </button>
  </div>
</template>

<script>
export default {
  name: 'SideTreeNav',
  props: {
    parent: {
      type: String,
      required: true,
    },
    child: {
      type: String,
      required: true,
    },
    parentCodeName: {
      type: String,
      required: true,
    },
    countName: {
      type: String,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      selectedParent: -1,
      selectedChild: null,
    }
  },
  computed: {
    parents() {
      return this.$store.getters.getItems(this.parent)
    },
    children() {
      return this.$store.getters.getItems(this.child)
    },
  },
  created() {
    this.$store.dispatch('getItems', this.parent)
    this.$store.dispatch('getItems', this.child)
  },
  methods: {
    selectParent(item) {
      this.selectedParent = item.code
      this.$emit('parentChanged', this.selectedParent)
      this.selectedChild = null
      this.$emit('childChanged', null)
    },
    selectChild(item) {
      this.selectedChild = item.code
      this.selectedParent = item[this.parentCodeName]
      this.$emit('childChanged', item.code)
    },
    filteredChildren(parentCode) {
      return this.children.filter((el) => {
        return el[this.parentCodeName] === parentCode
      })
    },
  },
}
</script>

<style scoped></style>
