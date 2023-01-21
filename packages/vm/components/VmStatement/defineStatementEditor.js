export const definedEditors = []

/*
defineStatementEditor(
  (statement) => typeof statement.search !== 'undefined',
  {
    editor: MySearchEditor,
    props: {
      // fixed props to send to the editor,
      // along with v-model, which will be the statement being edited
    }
  }
)

*/
export default function definineStatementEditor(fnCheck, objEditor) {
  definedEditors.push({ fnCheck, objEditor })
}