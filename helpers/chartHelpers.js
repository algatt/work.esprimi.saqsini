import colours from '~/assets/settings/colours.json'
import { PREFERRED_LANGUAGE } from '~/helpers/constants'

export function getDataAggregateByDemographic(
  selectedList,
  selectedDemographic,
  originalData
) {
  const datasets = {
    labels: selectedList,
    datasets: [],
  }

  let idx = 0
  originalData.demographics[selectedDemographic].forEach((demo) => {
    const dataset = {
      label: demo,
      data: Array(selectedList.length).fill(0),
      backgroundColor: colours[idx++],
    }
    selectedList.forEach((value) => {
      originalData.responses.forEach((response) => {
        const respondents = originalData.invitees
          .filter((el) => {
            return el[selectedDemographic] && el[selectedDemographic] === demo
          })
          .map((el) => {
            return el.token
          })
        if (respondents.includes(response.token)) {
          const parsedValue = JSON.parse(response.value)
          parsedValue.forEach((el) => {
            if (value === el.value) {
              dataset.data[datasets.labels.indexOf(el.value)] += 1
            }
          })
        }
      })
    })
    datasets.datasets.push(dataset)
  })
  return datasets
}

export function getDataAggregate(legendData, selectedList, originalData) {
  let data = {}

  const selectedColours = []

  legendData.forEach((el) => {
    if (selectedList.includes(el)) {
      data[el] = 0
      selectedColours.push(colours[legendData.indexOf(el)])
    }
  })

  originalData.responses.forEach((response) => {
    if (selectedList.includes(response.value)) data[response.value] += 1
  })
  data = Object.values(data)

  return {
    labels: selectedList.map((el) => {
      return el
    }),
    datasets: [
      {
        data,
        backgroundColor: selectedColours,
      },
    ],
  }
}

export function getDifferentAnswers(question, responses) {
  let data = []

  const isRadioGrid = question.flags.includes('RADIO_GRID')
  const isRanking = question.flags.includes('RANKING')
  const isTypeIn = question.flags.includes('TYPE_IN')

  if (isRadioGrid) {
    const rows = question.options.filter((el) => {
      return el.flags.includes('ROW')
    })

    rows.forEach((el) => {
      data.push({ text: el.value, code: el.value })
    })
  } else if (isRanking) {
    question.options.forEach((el) => {
      data.push({ text: el.value, code: el.value })
    })
  } else if (!isTypeIn) {
    question.options.forEach((el) => {
      const option = el.text.find((options) => {
        return options.language === PREFERRED_LANGUAGE
      }).text
      if (el.value) data.push({ text: option, code: el.value })
    })
  }

  if (!isRadioGrid && !isRanking) {
    responses.forEach((response) => {
      if (
        !data.find((el) => {
          return el.code === response.value
        })
      ) {
        data.push({ text: response.option, code: response.value })
      }
    })
  }

  data = data.sort((a, b) => {
    return a.code > b.code ? 1 : -1
  })

  return data
}

export function getDataAggregateRanking(
  legendData,
  selectedList,
  originalData
) {
  let answers = getDifferentAnswers(
    originalData.question,
    originalData.responses
  )

  const originalAnswers = answers.map((el) => {
    return el.code
  })

  answers = originalAnswers.filter((el) => {
    return selectedList.includes(el)
  })

  const dataToReturn = {
    labels: [],
    datasets: [],
  }

  for (let i = 1; i <= originalAnswers.length; i++) {
    dataToReturn.labels.push(i)
  }

  console.log(originalAnswers)

  for (let i = 0; i < answers.length; i++) {
    dataToReturn.datasets.push({
      label: answers[i],
      data: new Array(originalAnswers.length).fill(0),
      backgroundColor: colours[originalAnswers.indexOf(answers[i])],
    })
  }

  const whichResponses = originalData.responses

  whichResponses.forEach((response) => {
    const x = dataToReturn.datasets.find((el) => {
      return el.label === response.option
    })

    const index = dataToReturn.labels.indexOf(Number(response.value))
    if (x) x.data[index]++
  })
  return dataToReturn
}
