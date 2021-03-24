<script>
import { Pie, mixins } from 'vue-chartjs'

export default {
  extends: Pie,
  mixins: [mixins.reactiveProp],
  props: {
    options: {
      type: Object,
      required: false,
      default: () => {
        return { maintainAspectRatio: false }
      },
    },
  },

  mounted() {
    this.renderChart(this.chartData, this.options)
  },
}
</script>
