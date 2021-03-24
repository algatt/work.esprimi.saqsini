<template>
  <div>
    <button
      v-if="isSubMenuVisible"
      class="absolute w-full h-screen top-0 left-0 z-20 cursor-default"
      @click="hideSubMenu"
    ></button>

    <div class="py-1 flex flex-col">
      <div class="input select" @click="toggleMenu">
        <span class="flex flex-grow text-gray-800 mb-1 px-1"
          ><slot name="title"></slot
        ></span>
        <!--        <div class="flex w-12 justify-end pr-3 items-center">-->
        <!--          <i-->
        <!--            v-if="isSubMenuVisible"-->
        <!--            class="fas fa-times fa-fw text-gray-600"-->
        <!--          ></i>-->
        <!--          <i v-else class="fas fa-angle-down fa-fw text-gray-600"></i>-->
        <!--        </div>-->
      </div>

      <div class="flex relative">
        <div class="flex flex-col z-30 w-full absolute left-0 top-0">
          <transition name="fade">
            <div
              v-if="isSubMenuVisible"
              class="flex flex-col bg-white border border-gray-100 shadow"
            >
              <button
                class="flex flex-grow text-left px-3 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer"
                @click="selectAll"
              >
                <span class="flex w-8 justify-center items-center"
                  ><i
                    v-if="list.length === originalList.length"
                    class="fas fa-check-circle fa-fw text-primary"
                  ></i
                ></span>
                <span class="flex flex-grow"> Select all</span>
              </button>
              <button
                v-for="item in originalList"
                :key="item.code"
                class="flex flex-grow text-left px-3 py-2 hover:bg-gray-100 transition duration-300 cursor-pointer"
                @click="addOrRemoveItem(item)"
              >
                <span class="flex w-8 justify-center items-center"
                  ><i
                    v-if="includesItem(item)"
                    class="fas fa-check-circle fa-fw text-primary"
                  ></i
                ></span>
                <span class="flex flex-grow"> {{ item[displayField] }}</span>
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
              <span v-if="list.length > 0" class="px-2 my-1 mr-1">
                <button
                  class="text-primary hover:text-gray-500"
                  @click="clearAll"
                >
                  clear all
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
  },
  data() {
    return {
      isSubMenuVisible: false,
      list: [],
    }
  },
  mounted() {
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
        return e.code !== item.code
      })
      this.$emit('selectedItems', this.list)
    },
    addOrRemoveItem(item) {
      if (
        this.list.find((el) => {
          return el.code === item.code
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
        return el.code === item.code
      })
    },
  },
}
</script>

<style scoped></style>
