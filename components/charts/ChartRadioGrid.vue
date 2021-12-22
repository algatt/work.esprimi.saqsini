<template>
  <div class="flex flex-col">
    <div class="overflow-auto">
      <table class="w-full min-w-md table-auto">
        <tr class="border-b-2 border-gray-200 bg-gray-100">
          <th class="py-4">
            <div class="flex justify-start pl-3 items-center space-x-2">
              <span>Display %</span>
              <input v-model="asPercentages" type="checkbox" />
            </div>
          </th>
          <th
            v-for="(header, index) in grid.columns"
            :key="index"
            style="min-width: 125px"
          >
            {{ header.value }}
          </th>
        </tr>
        <tr
          v-for="(row, index) in grid.rows"
          :key="index"
          class="border-b border-gray-200"
        >
          <td class="py-2">{{ row.value }}</td>
          <td
            v-for="(val, colIndex) in grid.responses[index]"
            :key="colIndex"
            class="text-center"
          >
            <span
              v-if="val === grid.stats[index].min"
              class="bg-red-200 text-red-500 px-1 py-1 rounded"
              ><template v-if="asPercentages"
                >{{
                  Number((val / grid.stats[index].total) * 100).toFixed(2)
                }}%</template
              ><template v-else>{{ val }}</template></span
            >
            <span
              v-else-if="val === grid.stats[index].max"
              class="bg-green-200 text-green-500 px-1 py-1 rounded"
              ><template v-if="asPercentages"
                >{{
                  Number((val / grid.stats[index].total) * 100).toFixed(2)
                }}%</template
              ><template v-else>{{ val }}</template></span
            >
            <span v-else
              ><template v-if="asPercentages"
                >{{
                  Number((val / grid.stats[index].total) * 100).toFixed(2)
                }}%</template
              ><template v-else>{{ val }}</template></span
            >
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ChartRadioGrid',
  props: {
    elements: {
      type: Array,
      required: true,
    },
    responses: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      asPercentages: true,
    }
  },
  computed: {
    grid() {
      const rows = this.elements.filter((el) => {
        if (el.flags) return el.flags.includes('ROW')
      })
      const columns = this.elements.filter((el) => {
        if (el.flags) return el.flags.includes('COLUMN')
      })

      const responses = new Array(rows.length)
        .fill(0)
        .map(() => new Array(columns.length).fill(0))

      const stats = new Array(rows.length).fill({})

      for (let i = 0; i < rows.length; i++) {
        for (let j = 0; j < columns.length; j++) {
          responses[i][j] = this.responses.filter((el) => {
            return el.option === rows[i].value && el.value === columns[j].value
          }).length
        }
        stats[i] = {
          min: Math.min(...responses[i]),
          max: Math.max(...responses[i]),
          total: responses[i].reduce((p, n) => {
            return p + n
          }),
        }
      }

      return { rows, columns, responses, stats }
    },
  },
}
</script>
