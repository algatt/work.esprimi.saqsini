<template>
  <div>
    <button
      v-if="isSubMenuVisible"
      class="absolute w-full h-full top-0 left-0 z-20 cursor-default"
      @click="hideSubMenu"
    ></button>

    <div class="flex flex-col">
      <span v-if="$slots.default" class="font-semibold mb-2 text-gray-700">
        <slot></slot
      ></span>

      <div
        class="flex w-full border-2 border-gray-200 rounded py-1.5 px-1 focus:ring-0 focus:outline-none transition duration-300 disabled:border-gray-300 disabled:bg-gray-100"
        :class="color ? `focus:border-${color}-700` : `focus:border-primary`"
        @click="toggleMenu"
      >
        <span class="flex flex-grow text-gray-800 px-1"
          ><slot name="title"></slot
        ></span>

        <div class="flex w-12 justify-end pr-3 items-center">
          <i
            v-if="isSubMenuVisible"
            class="fas fa-times fa-fw text-gray-600"
          ></i>
          <i v-else class="fas fa-angle-down fa-fw text-gray-600"></i>
        </div>
      </div>

      <div class="flex relative">
        <div class="flex flex-col z-30 w-full absolute left-0 top-0">
          <transition name="fade">
            <div
              v-if="isSubMenuVisible"
              class="flex flex-col bg-white border border-gray-100 shadow overflow-auto z-30"
              style="max-height: 250px"
            >
              <button
                class="flex flex-1 text-left items-center px-3 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer"
                @click="selectAll"
              >
                <span class="flex w-8 justify-center items-center"
                  ><i
                    v-if="list.length === originalList.length"
                    class="fas fa-check-circle fa-fw"
                    :class="color ? `text-${color}-600` : `text-primary`"
                  ></i
                ></span>
                <span class="flex"> Select all</span>
              </button>
              <button
                v-for="item in originalList"
                :key="item[keyField]"
                class="flex flex-grow items-center text-left px-3 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer"
                @click="addOrRemoveItem(item)"
              >
                <span class="flex w-8 justify-center items-center"
                  ><i
                    v-if="includesItem(item)"
                    class="fas fa-check-circle fa-fw"
                    :class="color ? `text-${color}-600` : `text-primary`"
                  ></i
                ></span>
                <span class="flex flex-1"> {{ item[displayField] }}</span>
              </button>
            </div>
          </transition>
        </div>
        <div
          class="flex-col relative py-2 px-2 w-full"
          :class="list.length > 0 ? 'flex' : 'hidden'"
        >
          <transition name="fade">
            <div class="flex flex-wrap">
              <span v-if="list.length > 0" class="px-2 my-1 mr-1">
                <button
                  class="hover:text-gray-500"
                  :class="color ? `text-${color}-600` : `text-primary`"
                  @click="clearAll"
                >
                  clear all
                </button>
              </span>
              <span
                v-for="(selectedItem, index) in list"
                :key="index"
                class="bg-gray-100 border border-gray-200 rounded hover:bg-gray-200 hover:border-gray-300 transition duration-300 px-2 my-1 mr-1"
              >
                {{ selectedItem[displayField] }}
                <button @click="removeItem(selectedItem)">
                  <i
                    class="fas fa-times-circle fa-sm fa-fw text-gray-400 hover:text-gray-500 transition duration-300"
                  ></i>
                </button>
              </span>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    originalList: {
      type: Array,
      required: true,
    },
    selectedList: {
      type: Array,
      required: true,
    },
    displayField: {
      type: String,
      default: 'name',
    },
    color: {
      type: String,
      default: null,
    },
    keyField: {
      type: String,
      default: 'code',
    },
  },
  data() {
    return {
      isSubMenuVisible: false,
      list: [],
    }
  },
  beforeMount() {
    this.list = this.selectedList
  },
  methods: {
    toggleMenu() {
      this.isSubMenuVisible = !this.isSubMenuVisible
      this.$emit('submenuVisibility', this.isSubMenuVisible)
    },
    hideSubMenu() {
      this.isSubMenuVisible = false
      this.$emit('submenuVisibility', this.isSubMenuVisible)
    },
    removeItem(item) {
      this.list = this.list.filter((e) => {
        return e[this.keyField] !== item[this.keyField]
      })
      this.$emit('selectedItems', this.list)
    },
    addOrRemoveItem(item) {
      if (
        this.list.find((el) => {
          return el[this.keyField] === item[this.keyField]
        })
      ) {
        this.removeItem(item)
      } else {
        this.list.push(item)
      }
      this.$emit('selectedItems', this.list)
    },
    selectAll() {
      this.list = JSON.parse(JSON.stringify(this.originalList))
      this.$emit('selectedItems', this.list)
    },
    clearAll() {
      this.list = []
      this.$emit('selectedItems', this.list)
    },
    includesItem(item) {
      return this.list.find((el) => {
        return el[this.keyField] === item[this.keyField]
      })
    },
  },
}
</script>

<style scoped></style>
