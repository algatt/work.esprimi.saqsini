<script>
import { Bar, mixins } from 'vue-chartjs'
import { OPTIONS_BAR_CHART } from '~/assets/settings/charts-settings'

export default {
  extends: Bar,
  mixins: [mixins.reactiveProp],
  data() {
    return {
      OPTIONS_BAR_CHART,
    }
  },

  mounted() {
    this.renderChart(this.chartData, this.OPTIONS_BAR_CHART)
  },
}
</script>
