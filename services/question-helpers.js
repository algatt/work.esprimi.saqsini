import {
  QUESTION_TYPES,
  PREFERRED_LANGUAGE,
} from '~/assets/settings/survey-settings'

export function getQuestionTypeText(flags) {
  for (const i in flags) {
    Object.keys(QUESTION_TYPES).includes(flags[i])
    if (Object.keys(QUESTION_TYPES).includes(flags[i]))
      return QUESTION_TYPES[flags[i]].text
  }
}

export function getQuestionType(item) {
  const questionTypes = Object.keys(QUESTION_TYPES)
  let whichQuestion = ''
  questionTypes.forEach((type) => {
    if (item.flags.includes(type)) whichQuestion = type
  })
  return whichQuestion
}

export function convertQuestionFromApiToForm(
  question,
  language = PREFERRED_LANGUAGE
) {
  const temp = JSON.parse(JSON.stringify(question))
  const whichQuestion = getQuestionType(temp)

  if (!temp.defaultLanguage) temp.defaultLanguage = language

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === language
    })
    temp.text = text.text
  }

  if (temp.options) {
    const options = temp.options
    temp.options = []
    options.forEach((el) => {
      const text = el.text.find((el2) => {
        return el2.language === language
      }).text
      const obj = {
        ordinalPosition: el.ordinalPosition,
        text,
        value: el.value,
        surveyOptions: JSON.parse(el.surveyOptions),
      }
      if (el.flags) obj.flags = el.flags

      temp.options.push(obj)
    })
  }

  if (temp.surveyOptions) {
    const surveyOptions = JSON.parse(temp.surveyOptions)

    QUESTION_TYPES[whichQuestion].options.forEach((item) => {
      temp[item] = surveyOptions[item]
    })

    if (surveyOptions.branching) {
      temp.branching = surveyOptions.branching
    } else {
      temp.branching = {
        rules: [],
      }
    }

    if (surveyOptions.disqualify) {
      temp.disqualify = surveyOptions.disqualify
    } else {
      temp.disqualify = { rules: [] }
    }

    if (surveyOptions.maxChoice) {
      temp.maxChoice = Number(surveyOptions.maxChoice)
    }

    if (surveyOptions.isMultipleChoiceImage) temp.isMultipleChoiceImage = true

    delete temp.surveyOptions
  }

  temp.isMandatory = temp.flags.includes('IS_MANDATORY')

  return temp
}

export function convertQuestionFromFormToApi(question) {
  const temp = JSON.parse(JSON.stringify(question))

  const whichQuestion = getQuestionType(temp)

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]
  if (temp.flags.includes('MULTIPLE_CHOICE_IMAGE')) {
    temp.flags = temp.flags.filter((el) => {
      return el !== 'MULTIPLE_CHOICE_IMAGE'
    })
    temp.flags.push('MULTIPLE_CHOICE')
  }

  if (temp.options) {
    const formOptions = temp.options
    temp.options = []
    formOptions.forEach((el) => {
      const obj = {
        ordinalPosition: el.ordinalPosition,
        text: [{ language: PREFERRED_LANGUAGE, text: el.text }],
        value: el.value,
        surveyOptions: JSON.stringify(el.surveyOptions),
      }
      if (el.mask) obj.mask = el.mask
      if (el.flags) obj.flags = el.flags
      temp.options.push(obj)
    })
  }

  temp.surveyOptions = {}

  QUESTION_TYPES[whichQuestion].options.forEach((item) => {
    temp.surveyOptions[item] = temp[item]
  })

  temp.surveyOptions.branching = question.branching
  temp.surveyOptions.disqualify = question.disqualify

  if (question.maxChoice) {
    temp.surveyOptions.maxChoice = Number(question.maxChoice)
  }

  temp.surveyOptions = JSON.stringify(temp.surveyOptions)

  temp.flags = temp.flags.filter((el) => {
    return el !== 'IS_MANDATORY'
  })

  if (temp.isMandatory) temp.flags.push('IS_MANDATORY')

  delete temp.translatedText

  return temp
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
    // question.options.forEach((el) => {
    //   data.push({ text: el.value, code: el.value })
    // })
    let tempOptions = Array.from(
      new Set(
        question.options.map((el) => {
          return el.value
        })
      )
    )
    tempOptions = tempOptions.sort((a, b) => {
      return a > b ? 1 : -1
    })
    tempOptions.forEach((el) => {
      data.push({ text: el, code: el })
    })
  } else if (!isTypeIn) {
    question.options.forEach((el) => {
      const option = el.text.find((options) => {
        return options.language === PREFERRED_LANGUAGE
      }).text
      if (el.value) data.push({ text: option, code: el.value })
    })
  } else if (isTypeIn) {
    responses.forEach((response) => {
      if (
        !data.find((el) => {
          return el.value === response.value
        })
      ) {
        data.push({ text: response.value, code: response.value })
      }
    })
  }

  if (!isRadioGrid && !isRanking && !isTypeIn) {
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

export function getDataAggregate(legendData, selectedList, originalData) {
  let data = {}

  legendData.forEach((el) => {
    if (selectedList.includes(el)) {
      data[el] = 0
    }
  })

  originalData.responses.forEach((response) => {
    if (selectedList.includes(response.value)) data[response.value] += 1
  })
  data = Object.values(data)

  return {
    labels: selectedList
      .map((el) => {
        if (isNaN(el)) return el.length > 25 ? el.substr(0, 23) + '...' : el
        else return Number(el)
      })
      .sort((a, b) => {
        return a > b ? 1 : -1
      }),
    data,
  }
}

// export function getDataAggregateRanking(
//   legendData,
//   selectedList,
//   originalData
// ) {
//   let answers = getDifferentAnswers(
//     originalData.question,
//     originalData.responses
//   )
//
//   const originalAnswers = answers.map((el) => {
//     return el.code
//   })
//
//   answers = originalAnswers.filter((el) => {
//     return selectedList.includes(el)
//   })
//
//   const dataToReturn = {
//     labels: [],
//     datasets: [],
//   }
//
//   for (let i = 1; i <= originalAnswers.length; i++) {
//     dataToReturn.labels.push(i)
//   }
//
//   for (let i = 0; i < answers.length; i++) {
//     dataToReturn.datasets.push({
//       maxBarThickness: 56,
//       label: answers[i],
//       data: new Array(originalAnswers.length).fill(0),
//       backgroundColor: colours[originalAnswers.indexOf(answers[i])],
//     })
//   }
//
//   const whichResponses = originalData.responses
//
//   whichResponses.forEach((response) => {
//     const x = dataToReturn.datasets.find((el) => {
//       return el.label === response.option
//     })
//
//     const index = dataToReturn.labels.indexOf(Number(response.value))
//     if (x) x.data[index]++
//   })
//   return dataToReturn
// }

export function getDataAggregateRanking(
  legendData,
  selectedList,
  originalData
) {
  const originalAnswers = originalData.responses.map((el) => {
    return el.value
  })

  const dataToReturn = {
    labels: [],
    categories: [],
    series: [],
  }

  const numberOfChoices = JSON.parse(
    originalData.question.surveyOptions
  ).maxChoice

  for (let i = 1; i <= numberOfChoices; i++) dataToReturn.labels.push(i)

  dataToReturn.categories = originalData.question.options
    .filter((el) => {
      return selectedList.includes(el.value)
    })
    .map((el) => {
      return el.value
    })
    .sort((a, b) => {
      return a > b ? 1 : -1
    })

  dataToReturn.labels.forEach((choice) => {
    const data = []
    dataToReturn.categories.forEach((category) => {
      if (selectedList.includes(category))
        data.push(
          originalAnswers.filter((el) => {
            return el === `${category} (${choice})`
          }).length
        )
    })
    dataToReturn.series.push({ name: choice, data })
  })

  return dataToReturn
}

export function getOptionText(option, language) {
  return option.find((el) => {
    return el.language === language
  }).text
}

export function getQuestionOptionsAndOtherAnswers(question, answers) {
  const options = question.options
    .sort((a, b) => {
      return a.ordinalPosition > b.ordinalPosition ? 1 : -1
    })
    .map((option) => {
      return {
        ordinalPosition: option.ordinalPosition,
        text: getOptionText(option.text, PREFERRED_LANGUAGE),
        value: option.value,
        flags: option.flags,
        surveyOptions: option.surveyOptions,
      }
    })

  const answerOptions = answers.map((answer) => {
    return {
      ordinalPosition: null,
      text:
        answer.option && answer.option !== '' ? answer.option : answer.value,
      value: answer.value,
    }
  })

  if (!['RANKING', 'LIKERT'].includes(getQuestionType(this.question)))
    answerOptions.forEach((el) => {
      const found = options.find((option) => {
        return option.text === el.text && option.value === el.value
      })
      if (!found) options.push(el)
    })
  return options
}
