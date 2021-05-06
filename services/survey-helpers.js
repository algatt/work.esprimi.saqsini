import {
  PREFERRED_LANGUAGE,
  SURVEY_OPTIONS,
} from '@/assets/settings/survey-settings'
import { DateTime } from 'luxon'

function convertSurveyFromApiToForm(survey) {
  if (Object.keys(survey).length === 0) return {}

  const tempSurvey = JSON.parse(JSON.stringify(survey))

  // options
  if (tempSurvey.options) tempSurvey.options = JSON.parse(tempSurvey.options)

  // description
  if (tempSurvey.text) {
    const text = tempSurvey.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    })
    if (text && text.text) tempSurvey.textConverted = text.text
  }

  // dates
  if (tempSurvey.validFromTimestamp) {
    const validFromTimestamp = DateTime.fromFormat(
      tempSurvey.validFromTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.validFromDate = validFromTimestamp.toISODate()
    tempSurvey.validFromTime = validFromTimestamp.toLocaleString(
      DateTime.TIME_24_SIMPLE
    )
  }

  if (tempSurvey.validToTimestamp) {
    const validToTimestamp = DateTime.fromFormat(
      tempSurvey.validToTimestamp,
      'yyyy-MM-dd hh:mm:ss ZZZ'
    )

    tempSurvey.validToDate = validToTimestamp.toISODate()
    tempSurvey.validToTime = validToTimestamp.toLocaleString(DateTime)
  }

  return tempSurvey
}

function convertSurveyFromFormToApi(survey) {
  if (Object.keys(survey).length === 0) return {}

  const tempSurvey = JSON.parse(JSON.stringify(survey))

  if (!tempSurvey.defaultLanguage)
    tempSurvey.defaultLanguage = PREFERRED_LANGUAGE

  // description
  if (tempSurvey.text) {
    tempSurvey.text.find((el) => {
      return el.language === PREFERRED_LANGUAGE
    }).text = tempSurvey.textConverted
  } else {
    tempSurvey.text = [
      { language: PREFERRED_LANGUAGE, text: tempSurvey.textConverted },
    ]
  }

  delete tempSurvey.textConverted

  // dates
  if (tempSurvey.validFromDate) {
    tempSurvey.validFromTimestamp = DateTime.fromISO(
      `${tempSurvey.validFromDate}T${tempSurvey.validFromTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.validFromTime
    delete tempSurvey.validFromDate
  }

  if (tempSurvey.validToDate) {
    tempSurvey.validToTimestamp = DateTime.fromISO(
      `${tempSurvey.validToDate} ${tempSurvey.validToTime}`
    ).toFormat('yyyy-MM-dd hh:mm:ssZZZ')
    delete tempSurvey.validToTime
    delete tempSurvey.validToDate
  }

  // options
  if (!tempSurvey.options) {
    tempSurvey.options = JSON.stringify(SURVEY_OPTIONS)
  }
  tempSurvey.options = JSON.stringify(tempSurvey.options)

  if (tempSurvey.categoryCode) delete tempSurvey.categoryCode

  return tempSurvey
}

export { convertSurveyFromFormToApi, convertSurveyFromApiToForm }
