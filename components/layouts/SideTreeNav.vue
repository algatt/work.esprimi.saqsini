<template>
  <div class="flex flex-col relative mb-2 md:mb-0">
    <button
      class="flex items-center font-bold justify-between py-2 mb-2 px-2 bg-gray-100 focus:outline-none"
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
      >
        <button
          class="tree-view-parent-button"
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
            <div :class="hoverParent === parentItem.code ? null : 'md:hidden'">
              <button
                class="pencil-rounded-small"
                @click.stop="$emit('newParent', parentItem)"
              >
                <span> <i class="fas fa-pencil-alt fa-fw fa-sm"></i></span>
              </button>
            </div>
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
                <div
                  :class="hoverChild === childItem.code ? null : 'md:hidden'"
                >
                  <button
                    class="pencil-rounded-small"
                    @click.stop="$emit('newChild', childItem)"
                  >
                    <span> <i class="fas fa-pencil-alt fa-fw fa-sm"></i></span>
                  </button>
                </div>

                <span v-if="countName" class="badge-gray-small">{{
                  childItem[countName]
                }}</span>
              </div>
            </button>
          </div>
          <div class="flex flex-col pl-2">
            <button
              class="tree-view-parent-button"
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
        class="tree-view-parent-button"
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
  @apply w-full flex items-center justify-between font-medium hover:text-primary transition duration-300 focus:outline-none mb-1 px-2 text-gray-600;
}

.badge-gray-small {
  @apply mx-1 bg-gray-100 rounded text-sm font-semibold px-1.5 py-0.5 text-gray-500;
}

.pencil-rounded-small {
  @apply h-5 w-5 focus:bg-gray-200 flex justify-center items-center rounded-full focus:outline-none text-gray-600 transition duration-300;
}
</style>
