<template>
  <div class="flex flex-col">
    <h1>charts</h1>
    <div
      class="flex items-stretch w-6/12 mx-auto bg-red-200"
      style="height: 400px"
    >
      <g-chart
        type="BarChart"
        :data="chartData"
        :options="chartOptions"
        style="width: 100%"
      ></g-chart>
    </div>
  </div>
</template>

<script>
import { GChart } from 'vue-google-charts'
export default {
  name: 'ChartsVue',
  components: { GChart },
  data() {
    return {
      chartData: [
        ['Year', 'Sales', 'Expenses', 'Profit'],
        ['2014', 1000, 400, 200],
        ['2015', 1170, 460, 250],
        ['2016', 660, 1120, 300],
        ['2017', 1030, 540, 350],
      ],
      chartOptions: {
        chart: {
          title: 'Company Performance',
          subtitle: 'Sales, Expenses, and Profit: 2014-2017',
        },
      },
    }
  },
}
</script>

<style scoped></style>
