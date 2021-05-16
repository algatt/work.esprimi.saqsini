export const CHART_TYPE_COMPONENT = {
  MULTIPLE_CHOICE: 'chart-multiple-choice',
  DROPDOWN: 'chart-multiple-choice',
  LIKERT: 'chart-likert',
  RANKING: 'chart-ranking',
  TYPE_IN: 'chart-type-in',
  RADIO_GRID: 'chart-radio-grid',
}

export const OPTIONS_PIE_CHART = {
  title: {
    display: true,
    // text: 'Title Goes Here',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  legend: {
    position: 'bottom',
    labels: { fontFamily: 'Poppins' },
  },
  maintainAspectRatio: false,
  responsive: true,
}

export const OPTIONS_LINE_CHART = {
  title: {
    display: true,
    // text: 'Title Goes Here',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  legend: {
    display: false,
  },
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
        scaleLabel: {
          display: true,
          // labelString: 'Date',
        },
      },
    ],
    yAxes: [
      {
        display: true,
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
        scaleLabel: {
          display: true,
          // labelString: 'Count',
        },
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
}

export const OPTIONS_HORIZONTAL_BAR = {
  title: {
    display: true,
    // text: 'Title goes here',
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  responsive: false,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
      },
    ],
  },
}

export const OPTIONS_BAR_CHART = {
  responsive: false,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },

  scales: {
    xAxes: [
      {
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
      },
    ],
    yAxes: [
      {
        gridLines: {
          display: true,
          drawBorder: true,
          drawOnChartArea: false,
        },
        ticks: {
          beginAtZero: true,
          precision: 0,
        },
      },
    ],
  },
}
