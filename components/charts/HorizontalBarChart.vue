<script>
import { HorizontalBar, mixins } from 'vue-chartjs'

export default {
  extends: HorizontalBar,
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
