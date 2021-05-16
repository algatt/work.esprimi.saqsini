<template>
  <div class="w-full flex flex-col">
    <TableHeader
      ><template #left> <slot name="headerLeft"></slot></template
      ><template #right>
        <selection-delete-clear-button
          v-if="processedTableData.length !== 0 && enableSelection"
          :color="color"
          :enable-clear="enableClearAll && selectedItems.length > 0"
          :enable-select="
            enableSelectAll &&
            selectedItems.length !== processedTableData.length
          "
          :enable-delete="enableDeleteAll && selectedItems.length > 0"
          :how-many-selected="selectedItems.length"
          @clear="selectedItems = []"
          @selectAll="
            selectedItems = processedTableData
            $emit('selectItems', selectedItems)
          "
          @deleteAll="deleteAll"
        ></selection-delete-clear-button
        ><slot name="headerRight"></slot></template
    ></TableHeader>

    <div class="overflow-x-auto w-full">
      <table
        v-if="processedTableData.length > 0"
        class="w-full overflow-visible mx-auto whitespace-nowrap border-2 border-gray-100"
      >
        <thead class="bg-gray-100 border-b border-gray-200">
          <tr class="text-gray-600">
            <th class="w-8">&nbsp;</th>
            <th
              v-for="(column, columnIndex) in tableDefinition"
              :key="columnIndex"
              class="font-semibold text-sm uppercase px-6 py-4"
              :class="[
                { 'cursor-pointer': column.sortable },
                column.align ? `text-${column.align}` : 'text-left',
              ]"
              @click="column.sortable ? sort(column.field) : null"
            >
              <span>{{ column.title }}</span>
              <span v-if="column.sortable && fieldToSort == column.field">
                <i v-if="sortAscending" class="fas fa-caret-up fa-fw"></i>
                <i v-else class="fas fa-caret-down fa-fw"></i>
              </span>
              <span v-else-if="column.sortable && fieldToSort !== column.field">
                <i class="fas fa-caret-up fa-fw text-gray-300"></i>
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rowIndex) in processedTableData"
            :key="rowIndex"
            class="hover:bg-gray-50 transition duration-300 cursor-pointer border-b-2 border-gray-100"
            @mouseover="whichIsHovered = rowIndex"
            @mouseleave="whichIsHovered = null"
            @click="selectItem(row)"
          >
            <td class="w-8" style="min-width: 2rem">
              <span v-if="enableSelection" class="flex justify-center">
                <transition name="fade"
                  ><i
                    v-if="
                      whichIsHovered === rowIndex &&
                      !existsInSelectedItems(row.code)
                    "
                    class="far fa-check-circle fa-sm fa-fw text-gray-300"
                  ></i
                  ><i
                    v-else-if="existsInSelectedItems(row.code)"
                    class="fas fa-check-circle fa-sm fa-fw"
                    :class="color ? `text-${color}-600` : `text-primary`"
                  ></i> </transition
              ></span>
            </td>
            <td
              v-for="(column, columnIndex) in tableDefinition"
              :key="columnIndex"
              class="px-6 py-4"
              :class="column.align ? `text-${column.align}` : 'text-left'"
            >
              <slot v-if="column.slot" :name="column.slot" :item="row"></slot>
              <span v-else>{{ row[column.field] }}</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-else class="w-full flex justify-center font-medium py-8">
        Nothing here!
      </div>
    </div>
  </div>
</template>

<script>
import SelectionDeleteClearButton from './SelectionDeleteClearButton'
import TableHeader from './TableHeader'
import ModalService from '~/services/modal-services'
import ConfirmModal from '~/components/elements/ConfirmModal'
export default {
  name: 'DataTable',
  components: { SelectionDeleteClearButton, TableHeader },
  props: {
    tableData: {
      type: Array,
      required: true,
    },
    tableDefinition: {
      type: Array,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: null,
    },
    enableSelectAll: {
      type: Boolean,
      required: false,
      default: true,
    },
    enableClearAll: {
      type: Boolean,
      required: false,
      default: true,
    },
    enableDeleteAll: {
      type: Boolean,
      required: false,
      default: true,
    },
    enableSelection: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  data() {
    return {
      fieldToSort: null,
      sortAscending: 1,
      selectedItems: [],
      whichIsHovered: null,
    }
  },
  computed: {
    processedTableData() {
      const tempData = JSON.parse(JSON.stringify(this.tableData))
      if (tempData && tempData.length > 0)
        return tempData.sort((a, b) => {
          if (a[this.fieldToSort] < b[this.fieldToSort])
            return this.sortAscending ? -1 : 1
          if (a[this.fieldToSort] > b[this.fieldToSort])
            return this.sortAscending ? 1 : -1
          return 0
        })
      else return []
    },
  },
  watch: {
    selectAll(value) {
      if (value) this.selectedItems = this.processedTableData
    },
    clearAll(value) {
      if (value) this.selectedItems = []
    },
  },
  methods: {
    sort(field) {
      this.whichIsHovered = null
      if (this.fieldToSort === field) this.sortAscending = !this.sortAscending
      else {
        this.fieldToSort = field
        this.sortAscending = true
      }
    },
    selectItem(row) {
      if (!this.enableSelection) return
      if (
        this.selectedItems.find((el) => {
          return el.code === row.code
        })
      ) {
        this.selectedItems = this.selectedItems.filter((el) => {
          return el.code !== row.code
        })
      } else {
        this.selectedItems.push(row)
      }
      this.$emit('selectItems', this.selectedItems)
    },
    existsInSelectedItems(code) {
      return this.selectedItems.find((el) => {
        return el.code === code
      })
    },
    deleteAll() {
      ModalService.open(ConfirmModal, {
        msg: `You are deleting ${this.selectedItems.length} ${
          this.selectedItems.length === 1 ? 'item' : 'items'
        }.`,
      }).then(() => {
        this.$emit('deleteAll', this.selectedItems)
        this.selectedItems = []
      })
    },
  },
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
