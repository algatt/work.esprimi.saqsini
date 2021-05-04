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
    icon: 'fas fa-file',
    options: [],
  },
  MULTIPLE_CHOICE: {
    code: 1,
    text: 'Multiple Choice',
    flag: 'MULTIPLE_CHOICE',
    icon: 'fas fa-ellipsis-v',
    options: ['allowOther', 'allowMultiple'],
  },
  LIKERT: {
    code: 2,
    text: 'Likert',
    flag: 'LIKERT',
    icon: 'fas fa-ellipsis-h',
    options: ['showWeights'],
  },
  DROPDOWN: {
    code: 3,
    text: 'Dropdown',
    flag: 'DROPDOWN',
    icon: 'fas fa-chevron-circle-down',
    options: ['allowOther', 'allowMultiple'],
  },
  TYPE_IN: {
    code: 4,
    text: 'Type In',
    flag: 'TYPE_IN',
    icon: 'fas fa-keyboard',
    options: [],
  },
  RANKING: {
    code: 5,
    text: 'Ranking',
    flag: 'RANKING',
    icon: 'fas fa-trophy',
    options: [],
  },
  RADIO_GRID: {
    code: 6,
    text: 'Radio Grid',
    flag: 'RADIO_GRID',
    icon: 'fas fa-grip-horizontal',
    options: [],
  },
}

export const QUESTION_HELP = {
  NUMBER: 'This is an internal number that can be used for reference.',
  TEXT: 'This is the question text that will be seen by a respondent.',
  NAME:
    'This is an internal name for the question that can be used for reference.',
  REQUIRED:
    'If set to yes the respondent must answer the question before progressing.',
}

export const SURVEY_LANGUAGE_GENERIC_TERMS = {
  survey_title: 0,
  clear: 1,
  next: 2,
  previous: 3,
  finish: 4,
  not_selected: 5,
  ranking_instructions: 6,
  required: 7,
  position: 8,
}

export const USER_META_DATA = {
  navigator: [
    'appCodeName',
    'appVersion',
    'buildId',
    'cookieEnabled',
    'doNotTrack',
    'language',
    'languages',
    'maxTouchPoints',
    'oscpu',
    'platform',
    'userAgent',
  ],
  window: ['fullScreen', 'innerHeight', 'innerWidth'],
}

export const NOTIFICATION_EDITOR_FIELDS = [
  'Gender',
  'Age',
  'Full Name',
  'Sector Name',
  'Industry Name',
  'Company Name',
  'Company Abbreviation',
  'Department Name',
  'Department Abbreviation',
  'Role Name',
  'Role Abbreviation',
]
