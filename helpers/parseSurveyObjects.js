import moment from 'moment'
import { PREFERRED_LANGUAGE } from '~/helpers/constants'

export function parseSurveyToForm(survey) {
  const temp = JSON.parse(JSON.stringify(survey))

  if (!temp.defaultLanguage) temp.defaultLanguage = PREFERRED_LANGUAGE
  if (!temp.referenceDate) temp.referenceDate = moment().format('YYYY-MM-DD')
  if (!temp.validFromTimestamp) {
    temp.validFromDate = moment().format('YYYY-MM-DD')
    temp.validFromTime = '08:00'
  } else {
    temp.validFromDate = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('YYYY-MM-DD')
    temp.validFromTime = moment(
      temp.validFromTimestamp.replace(' +', '+')
    ).format('HH:mm')
  }
  if (temp.validToTimestamp) {
    temp.validToDate = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'YYYY-MM-DD'
    )
    temp.validToTime = moment(temp.validToTimestamp.replace(' +', '+')).format(
      'HH:mm'
    )
  }

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    })
    temp.text = text.text
  }

  return temp
}

export function parseSurveyToAPI(survey) {
  const temp = JSON.parse(JSON.stringify(survey))

  const dateStringFrom = temp.validFromDate + ' ' + temp.validFromTime
  temp.validFromTimestamp = moment(dateStringFrom).format(
    'YYYY-MM-DD HH:MM:SSZZ'
  )
  delete temp.validFromDate
  delete temp.validFromTime

  if (temp.validToDate) {
    const dateStringTo = temp.validToDate + ' ' + temp.validToTime
    temp.validToTimestamp = moment(dateStringTo).format('YYYY-MM-DD HH:MM:SSZZ')
    delete temp.validToDate
    delete temp.validToTime
  }

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]

  return temp
}

export function parseQuestionToForm(question) {
  const temp = JSON.parse(JSON.stringify(question))

  if (!temp.defaultLanguage) temp.defaultLanguage = PREFERRED_LANGUAGE

  if (temp.text) {
    const text = temp.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    })
    temp.text = text.text
  }

  if (temp.options) {
    const options = temp.options
    temp.options = []
    options.forEach((el) => {
      const text = el.text.find((el2) => {
        return el2.language === PREFERRED_LANGUAGE
      }).text
      temp.options.push({ ordinalPosition: el.ordinalPosition, text })
    })
  }

  if (temp.surveyOptions) {
    const surveyOptions = JSON.parse(temp.surveyOptions)
    console.log(surveyOptions)
    temp.allowMultiple = surveyOptions.allowMultiple
    temp.allowOther = surveyOptions.allowOther
    delete temp.surveyOptions
  }

  return temp
}

export function parseQuestionToApi(question) {
  const temp = JSON.parse(JSON.stringify(question))

  temp.text = [{ language: PREFERRED_LANGUAGE, text: temp.text }]

  const formOptions = temp.options
  temp.options = []
  formOptions.forEach((el) => {
    temp.options.push({
      ordinalPosition: el.ordinalPosition,
      text: [{ language: PREFERRED_LANGUAGE, text: el.text }],
      value: el.text,
      surveyOptions: null,
    })
  })

  temp.surveyOptions = JSON.stringify({
    allowOther: temp.allowOther,
    allowMultiple: temp.allowMultiple,
  })

  return temp
}
