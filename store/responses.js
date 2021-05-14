export const state = () => ({
  items: [],
})

export const actions = {
  // getResponses({ state, commit }, code) {
  //   return new Promise((resolve) => {
  //     commit(
  //       'setItems',
  //       {
  //         which: 'responses',
  //         items: {
  //           survey: {
  //             name: 'Test Survey',
  //             totalInvites: 20,
  //             totalRespondents: 5,
  //             referenceDate: '2020-01-01',
  //           },
  //           questions: [
  //             {
  //               code: 1,
  //               text: 'Do you like fruit?',
  //               name: 'Fruit Like',
  //               type: 'MULTIPLE_CHOICE',
  //               number: 1,
  //               availableOptions: [
  //                 {
  //                   text: 'Orange',
  //                   value: 'Orange',
  //                 },
  //                 {
  //                   text: 'Apple',
  //                   value: 'Apple',
  //                 },
  //                 {
  //                   text: 'Kiwi',
  //                   value: 'Kiwi',
  //                 },
  //               ],
  //             },
  //             {
  //               code: 2,
  //               text: 'How do you rate Vanilla?',
  //               name: 'Vanilla Like',
  //               type: 'LIKERT',
  //               number: 2,
  //               availableOptions: [
  //                 { text: 'I like it a lot', value: 3 },
  //                 { text: 'Indifferent', value: 2 },
  //                 { text: 'I do not like it', value: 1 },
  //               ],
  //             },
  //             {
  //               code: 3,
  //               text: 'How do you rank flavours?',
  //               name: 'Flavour Rank',
  //               type: 'RANKING',
  //               number: 3,
  //               availableOptions: [
  //                 { text: 'Strawberry', value: 'Strawberry' },
  //                 { text: 'Mint', value: 'Mint' },
  //                 { text: 'Chocolate', value: 'Chocolate' },
  //                 { text: 'Vanilla', value: 'Vanilla' },
  //               ],
  //             },
  //             {
  //               code: 4,
  //               text: 'How do rate your experience at our IceCream Shop?',
  //               name: 'Flavour Rank',
  //               type: 'LIKERT',
  //               number: 4,
  //               availableOptions: [
  //                 { text: '1', value: 1 },
  //                 { text: '2', value: 2 },
  //                 { text: '3', value: 3 },
  //                 { text: '4', value: 4 },
  //                 { text: '5', value: 5 },
  //                 { text: '6', value: 6 },
  //                 { text: '7', value: 7 },
  //                 { text: '8', value: 8 },
  //                 { text: '9', value: 9 },
  //                 { text: '10', value: 10 },
  //               ],
  //             },
  //           ],
  //           invitees: [
  //             {
  //               code: 1,
  //               age: 32,
  //               gender: 'Female',
  //               role: 'CEO',
  //               department: 'Marketing',
  //               company: 'Actavis',
  //             },
  //             {
  //               code: 2,
  //               age: 42,
  //               gender: 'Male',
  //               role: 'Accountant',
  //               department: 'Accounts',
  //               company: 'Actavis',
  //             },
  //             { code: 3, age: 22, gender: 'Male' },
  //             {
  //               code: 4,
  //               age: 45,
  //               gender: 'Female',
  //               role: 'Accountant',
  //               department: 'Accounts',
  //               company: 'Actavis',
  //             },
  //             {
  //               code: 5,
  //               age: 32,
  //               gender: 'Male',
  //               role: 'Accountant',
  //               department: 'Accounts',
  //               company: 'Baxter',
  //             },
  //           ],
  //           sessions: [
  //             { code: 1, invitee: 1, finishedAt: '20200101' },
  //             { code: 2, invitee: 2, finishedAt: '20200102' },
  //             { code: 3, invitee: 3, finishedAt: '20200101' },
  //             { code: 4, invitee: 4, finishedAt: '20200101' },
  //             { code: 5, invitee: 5, finishedAt: '20200103' },
  //           ],
  //           responses: [
  //             {
  //               question: 1,
  //               invitee: 1,
  //               session: 1,
  //               value: ['Apple'],
  //             },
  //             {
  //               question: 1,
  //               invitee: 2,
  //               session: 2,
  //               value: ['Orange'],
  //             },
  //             {
  //               question: 1,
  //               invitee: 3,
  //               session: 3,
  //               value: ['Orange'],
  //             },
  //             {
  //               question: 1,
  //               invitee: 4,
  //               session: 4,
  //               value: ['Lettuce'],
  //             },
  //             {
  //               question: 1,
  //               invitee: 5,
  //               session: 5,
  //               value: ['Apple', 'Orange'],
  //             },
  //             {
  //               question: 2,
  //               invitee: 1,
  //               session: 1,
  //               value: [3],
  //             },
  //             {
  //               question: 2,
  //               invitee: 2,
  //               session: 2,
  //               value: [2],
  //             },
  //             {
  //               question: 2,
  //               invitee: 3,
  //               session: 3,
  //               value: [2],
  //             },
  //             {
  //               question: 2,
  //               invitee: 4,
  //               session: 4,
  //               value: [1],
  //             },
  //             {
  //               question: 2,
  //               invitee: 5,
  //               session: 5,
  //               value: [1],
  //             },
  //             {
  //               question: 3,
  //               invitee: 1,
  //               session: 1,
  //               value: ['Mint', 'Strawberry', 'Chocolate', 'Vanilla'],
  //             },
  //             {
  //               question: 3,
  //               invitee: 2,
  //               session: 2,
  //               value: ['Strawberry', 'Chocolate', 'Mint', 'Vanilla'],
  //             },
  //             {
  //               question: 3,
  //               invitee: 3,
  //               session: 3,
  //               value: ['Vanilla', 'Mint', 'Chocolate', 'Strawberry'],
  //             },
  //             {
  //               question: 3,
  //               invitee: 4,
  //               session: 4,
  //               value: ['Strawberry', 'Vanilla', 'Mint', 'Chocolate'],
  //             },
  //             {
  //               question: 3,
  //               invitee: 5,
  //               session: 5,
  //               value: ['Strawberry', 'Mint', 'Vanilla', 'Chocolate'],
  //             },
  //             {
  //               question: 4,
  //               invitee: 1,
  //               session: 1,
  //               value: [1],
  //             },
  //             {
  //               question: 4,
  //               invitee: 2,
  //               session: 2,
  //               value: [1],
  //             },
  //             {
  //               question: 4,
  //               invitee: 3,
  //               session: 3,
  //               value: [6],
  //             },
  //             {
  //               question: 4,
  //               invitee: 4,
  //               session: 4,
  //               value: [9],
  //             },
  //             {
  //               question: 4,
  //               invitee: 5,
  //               session: 5,
  //               value: [10],
  //             },
  //           ],
  //         },
  //       },
  //       { root: true }
  //     )
  //     resolve(state.items)
  //   })
  // },
}
