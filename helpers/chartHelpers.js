import colours from '~/assets/settings/colours.json'

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
  legendData.forEach((el) => {
    if (selectedList.includes(el)) data[el] = 0
  })

  originalData.responses.forEach((response) => {
    const parsedValues = JSON.parse(response.value)
    parsedValues.forEach((value) => {
      if (selectedList.includes(value.value)) data[value.value] += 1
    })
  })
  data = Object.values(data)

  return {
    labels: selectedList.map((el) => {
      return el
    }),
    datasets: [
      {
        data,
        backgroundColor: colours,
      },
    ],
  }
}

export function getDifferentAnswers(question, responses) {
  let data = []

  if (question.options) {
    question.options.forEach((el) => {
      data.push({ text: el.value, code: el.value })
    })
  }
  responses.forEach((response) => {
    const parsedValue = JSON.parse(response.value)
    parsedValue.forEach((value) => {
      if (
        !data.find((el) => {
          return el.code === value.value ? value.value : value
        })
      )
        data.push({
          text: value.value ? value.value : value,
          code: value.value ? value.value : value,
        })
    })
  })

  data = data.sort((a, b) => {
    return a.code > b.code ? 1 : -1
  })

  return data
}

export function getDataAggregateRanking(
  legendData,
  selectedList,
  originalData,
  selectedDemographic
) {
  let answers = getDifferentAnswers(
    originalData.question,
    originalData.responses
  )

  answers = answers
    .map((el) => {
      return el.code
    })
    .filter((el) => {
      return selectedList.includes(el)
    })

  const dataToReturn = {
    labels: [],
    datasets: [],
  }

  for (let i = 0; i < answers.length; i++) {
    dataToReturn.labels.push(i + 1)

    dataToReturn.datasets.push({
      label: answers[i],
      data: new Array(answers.length).fill(0),
      backgroundColor: colours[i],
    })
  }

  const whichResponses = originalData.responses
  const invitees = []

  // if (selectedDemographic.length !== 0) {
  //   const demographicValues = selectedDemographic.map((el) => {
  //     return el.name
  //   })
  //   const whichDemographic = selectedDemographic[0].type
  //   invitees = originalData.invitees
  //     .filter((el) => {
  //       return (
  //         el[whichDemographic] &&
  //         demographicValues.includes(el[whichDemographic])
  //       )
  //     })
  //     .map((el) => {
  //       return el.token
  //     })
  // }

  whichResponses.forEach((response) => {
    const parsedValues = JSON.parse(response.value)
    for (let i = 0; i < parsedValues.length; i++) {
      const x = dataToReturn.datasets.find((el) => {
        return (
          (selectedDemographic.length === 0 &&
            el.label === parsedValues[i].value) ||
          (selectedDemographic.length !== 0 &&
            invitees.includes(response.token) &&
            el.label === parsedValues[i].value)
        )
      })
      if (x) x.data[i] += 1
    }
  })
  return dataToReturn
}
