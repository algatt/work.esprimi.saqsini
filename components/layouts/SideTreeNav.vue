<template>
  <div class="flex flex-col relative mb-2 md:mb-0">
    <button
      class="flex items-center font-bold justify-between py-2 mb-2 px-2 bg-gray-100 focus:outline-none border-b border-gray-200"
      :class="isCollapsed ? 'shadow' : null"
      @click="isCollapsed = !isCollapsed"
    >
      <slot name="title"></slot>
      <button class="btn-link">
        <i
          class="fas"
          :class="isCollapsed ? 'fa-caret-down' : 'fa-caret-up'"
        ></i>
      </button>
    </button>
    <div v-if="!isCollapsed">
      <button
        class="tree-view-parent-button"
        :class="
          selectedParent === -1
            ? 'text-primary border-l-2 border-primary'
            : 'text-gray-600'
        "
        @click="selectParent({ code: -1 })"
      >
        <span
          ><i
            class="fas fa-fw mr-1"
            :class="
              selectedParent === -1
                ? 'fa-folder-open text-primary'
                : 'fa-folder text-gray-300'
            "
          ></i
          >All</span
        >
      </button>
      <div
        v-for="parentItem in parents"
        :key="parentItem.code"
        class="flex flex-col"
        :class="
          selectedParent === parentItem.code
            ? 'border-l-2 border-primary'
            : null
        "
      >
        <button
          class="tree-view-parent-button"
          :class="
            selectedParent === parentItem.code
              ? 'text-primary'
              : 'text-gray-600'
          "
          @mouseenter="hoverParent = parentItem.code"
          @mouseleave="hoverParent = null"
          @click="selectParent(parentItem)"
        >
          <span
            ><i
              class="fas fa-fw mr-1"
              :class="
                selectedParent === parentItem.code
                  ? 'fa-folder-open text-primary'
                  : 'fa-folder text-gray-300'
              "
            ></i
            >{{ truncateString(parentItem.name) }}</span
          >
          <div class="flex items-center justify-end">
            <button
              :class="hoverParent === parentItem.code ? 'flex' : 'md:hidden'"
              class="btn-link"
              @click.stop="$emit('newParent', parentItem)"
            >
              <i class="fas fa-pencil-alt fa-fw fa-sm"></i>
            </button>
            <span v-if="countName" class="badge-gray-small">{{
              parentItem[countName]
            }}</span>
          </div>
        </button>
        <template v-if="selectedParent === parentItem.code">
          <div
            v-for="childItem in filteredChildren(parentItem.code)"
            :key="childItem.code"
            class="flex flex-col pl-2"
          >
            <button
              class="tree-view-parent-button"
              :class="
                selectedChild === childItem.code
                  ? 'text-primary'
                  : 'text-gray-600'
              "
              @mouseleave="hoverChild = null"
              @click="selectChild(childItem)"
              @mouseover="hoverChild = childItem.code"
            >
              <span
                ><i
                  class="fas fa-fw mr-1"
                  :class="
                    selectedChild === childItem.code
                      ? 'fa-folder-open text-primary'
                      : 'fa-folder text-gray-300'
                  "
                ></i
                >{{ truncateString(childItem.name) }}</span
              >
              <div class="flex items-center justify-end">
                <button
                  :class="hoverChild === childItem.code ? 'flex' : 'md:hidden'"
                  class="btn-link"
                  @click.stop="$emit('newChild', childItem)"
                >
                  <i class="fas fa-pencil-alt fa-fw fa-sm"></i>
                </button>
                <span v-if="countName" class="badge-gray-small">{{
                  childItem[countName]
                }}</span>
              </div>
            </button>
          </div>
          <div class="flex flex-col pl-2">
            <button
              class="tree-view-parent-button text-gray-600"
              @click="
                $emit('newChild', {
                  code: -1,
                  [parentCodeName]: parentItem.code,
                })
              "
            >
              <span
                ><i class="fas fa-fw fa-folder-plus mr-1 text-gray-300"></i
                >New</span
              >
            </button>
          </div>
        </template>
      </div>
      <button
        class="tree-view-parent-button text-gray-600"
        @click="$emit('newParent', { code: -1 })"
      >
        <span
          ><i class="fas fa-fw fa-folder-plus mr-1 text-gray-300"></i
          ><slot name="newText"></slot
        ></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideTreeNav',
  props: {
    parents: {
      type: Array,
      required: true,
    },
    children: {
      type: Array,
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
      hoverParent: null,
      hoverChild: null,
      isCollapsed: false,
    }
  },

  methods: {
    truncateString(str) {
      return str.length < 15 ? str : str.substring(0, 12) + '...'
    },
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

<style scoped>
.tree-view-parent-button {
  @apply w-full flex items-center justify-between font-medium hover:text-primary transition duration-300 focus:outline-none mb-1 px-2;
}

.badge-gray-small {
  @apply mx-1 bg-gray-200 rounded text-xs font-semibold px-1 py-0.5 text-gray-500;
}
</style>
