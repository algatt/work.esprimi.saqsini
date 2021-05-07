export const PREFERRED_LANGUAGE = 'en'

export const SURVEY_COLOURS = {
  accentColours: [
    '#3B82F6',
    '#EF4444',
    '#F59E0B',
    '#10B981',
    '#8B5CF6',
    '#EC4899',
  ],
  backgroundColours: [
    '#DBEAFE',
    '#FEE2E2',
    '#FEF3C7',
    '#D1FAE5',
    '#EDE9FE',
    '#FCE7F3',
  ],
  textColours: ['#4B5563'],
}
export const SURVEY_OPTIONS = {
  accentColour: SURVEY_COLOURS.accentColours[0],
  backgroundColour: SURVEY_COLOURS.backgroundColours[0],
  textColour: SURVEY_COLOURS.textColours[0],
  headerImage: '',
  footerImage: '',
}

export const QUESTION_TYPES = {
  SECTION: {
    code: 0,
    text: 'Page',
    flag: 'SECTION',
    icon: 'fas fa-file fa-fw',
    options: [],
  },
  MULTIPLE_CHOICE: {
    code: 1,
    text: 'Multiple Choice',
    flag: 'MULTIPLE_CHOICE',
    icon: 'fas fa-ellipsis-v fa-fw',
    options: ['allowOther', 'allowMultiple'],
  },
  LIKERT: {
    code: 2,
    text: 'Likert',
    flag: 'LIKERT',
    icon: 'fas fa-ellipsis-h fa-fw',
    options: ['showWeights'],
  },
  DROPDOWN: {
    code: 3,
    text: 'Dropdown',
    flag: 'DROPDOWN',
    icon: 'fas fa-chevron-circle-down fa-fw',
    options: ['allowOther', 'allowMultiple'],
  },
  TYPE_IN: {
    code: 4,
    text: 'Type In',
    flag: 'TYPE_IN',
    icon: 'fas fa-keyboard fa-fw',
    options: [],
  },
  RANKING: {
    code: 5,
    text: 'Ranking',
    flag: 'RANKING',
    icon: 'fas fa-trophy fa-fw',
    options: [],
  },
  RADIO_GRID: {
    code: 6,
    text: 'Radio Grid',
    flag: 'RADIO_GRID',
    icon: 'fas fa-grip-horizontal fa-fw',
    options: [],
  },
}
