/*
Provide a list of validation to <UiInput> so that it is
applied as native html validation.

Provides support for custom messages and validation of multiple rules at once

Rule types are based on: https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation

rules: [
  {
    type: 'required',
    message: 'You must type a name',
    breaking: true | false  // Do not check further rules if this one fails
  },
  {
    type: 'minlength',
    value: 6,
    message: 'Word be at least 6 characters',
    breaking: false
  },
  {
    type: 'maxlength',
    value: 30,
    message: 'Don\'t go over 30 characters',
    breaking: false
  },
  {
    type: 'pattern',
    value: 'some|pattern|here',
    message: 'This doesnt really match whatever',
    breaking: false
  },
  {
    // auto-applied if <UiInput type is supported>
    type: ... number, email, url
    message: 'Dude?',
    breaking: false
  },
]
*/

export function toHTMLProps(rules) {
  if (!Array.isArray(rules)) {
    return null
  }

  const retval = { required: false }

  rules.forEach((rule) => {
    switch (rule?.type) {
    case 'required':
      retval.required = true
      break

    case 'minlength':
    case 'maxlength':
    case 'pattern':
      retval[rule.type] = rule?.value
      break
    }
  })

  return retval
}