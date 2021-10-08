const PageHelper = {
  sanitizePage(incomingPage) {
    let incoming = incomingPage ? JSON.parse(JSON.stringify(incomingPage)) : {}
    let sections = incoming?.sections || []

    incoming.layout = incoming?.layout || [
      {
        columns: [
          { blocks: [] },
        ],
      },
    ]

    // Pagina "vieja".  blocks:[] y layout
    if (Array.isArray(incoming?.blocks)) {
      let rows = incoming.layout

      rows.forEach((row, rowIndex) => {
        row.id = row.id || `row-${rowIndex}`
        row.title = row.title || `Row ${rowIndex + 1}`
        row.class = ''

        row.columns = row.columns || []
        row.columns.forEach((column, colIndex) => {
          column.id = column.id || `col-${colIndex}`
          column.flex = column.flex || 1
          column.title = column.title || `Column ${colIndex + 1}`
          column.class = ''

          column.blocks = []
        })
      })

      for (let blockIndex = 0; blockIndex < incoming.blocks.length; blockIndex++) {
        let block = incoming.blocks[blockIndex]

        block.id = block.id || `block-${blockIndex}`
        block.class = block.class || ''

        let targetRow = block?.layout?.row || 0
        let targetColumn = block?.layout?.column || 0
        delete block.layout

        rows[targetRow].columns[targetColumn].blocks.push(block)
      }

      sections = [
        {
          id: 'section-0',
          class: '',
          rows,
        },
      ]
    }

    if (!sections.length) {
      sections.push({
        id: 'section-0',
        class: '',
        rows: [
          {
            id: 'row-0',
            columns: [],
          },
        ],
      })
    }

    return {
      id: incoming?.id,
      theme: 'default',
      sections,
    }
  },

  sanitizeLayout(incoming, blocks = []) {
    console.log('PageHelper.sanitizeLayout', incoming, blocks)
    if (!Array.isArray(blocks)) {
      blocks = []
    }

    let retval = {
      rows: [
        {
          title: 'Row I',
          columns: [
            {
              title: 'Column I',
              flex: 1,
              blocks: [],
            },
          ],
        },
      ],
    }

    if (!incoming) {
      return retval
    }

    // Layout "viejo".  Array de rows
    if (Array.isArray(incoming)) {
      incoming = { rows: incoming }
    }

    let seenBlocks = {}

    retval.rows = [...(incoming.rows || [])]
    for (let rowIndex = 0; rowIndex < retval.rows.length; rowIndex++) {
      let row = retval.rows[rowIndex]

      row.id = row.id || `row-${rowIndex}`
      row.title = row.title || `Row ${rowIndex + 1}`
      row.class = ''

      row.columns = [...(row.columns || [])]
      for (let colIndex = 0; colIndex < row.columns.length; colIndex++) {
        let column = row.columns[colIndex]

        column.id = column.id || `col-${colIndex}`
        column.flex = 1
        column.title = column.title || `Column ${colIndex + 1}`
        column.class = ''

        column.blocks = [...(column.blocks || [])]
        for (
          let blockIndex = 0;
          blockIndex < column.blocks.length;
          blockIndex++
        ) {
          let block = column.blocks[blockIndex] || {}
          block.id = block.id || `block-${blockIndex}`
          block.class = ''

          if (block.index) {
            seenBlocks[block.index] = block
          }
        }
      }
    }

    // Asegurarse de que todos los bloques esten contenidos en el layout
    for (let blockIndex = 0; blockIndex < blocks.length; blockIndex++) {
      if (typeof seenBlocks[blockIndex] != 'undefined') {
        continue
      }

      let block = blocks[blockIndex]
      let targetRow = block?.layout?.row || 0
      let targetColumn = block?.layout?.column || 0

      retval.rows[targetRow].columns[targetColumn].blocks.push({
        id: block.id || `block-${blockIndex}`,
        class: '',
        index: blockIndex,
      })

    }

    return retval
  },

  getPageValidationRules(page) {
    if (!page) {
      return []
    }

    let rules = []

    // Atributo "validation" en la pagina
    if (Array.isArray(page.validation) && page.validation.length > 0) {
      rules = rules.concat(page.validation)
    }

    // Atributo "validation" en los bloques
    page.blocks
      .filter((b) => Array.isArray(b.validation) && b.validation.length > 0)
      .forEach((b) => (rules = rules.concat(b.validation)))


    // Bloques asociados a v-model con la prop "required"
    page.blocks
      .filter((block) => block['v-model'] && block.props && block.props.required)
      .forEach((requiredBlock) => {
        let props = requiredBlock.props || {}
        let label = props.label || props.title || requiredBlock['v-model']

        rules.push({
          text: `'${label}' es obligatorio`,
          rule: { [requiredBlock['v-model']]: { '&nempty': true } },
        })
      })


    return rules
  },

  getPageBlocks(page) {
    if (Array.isArray(page?.blocks)) {
      return page.blocks
    }

    if (!Array.isArray(page?.sections)) {
      return []
    }

    let retval = []
    for (let section of page?.sections) {
      for (let row of section?.rows) {
        for (let column of row?.columns) {
          retval = retval.concat(column?.blocks || [])
        }
      }
    }
    return retval
  },

  getDataSchema(page) {
    let retval = {
      type: 'object',
      properties: {},
    }

    let blocks = PageHelper.getPageBlocks(page)
    if (!blocks.length) {
      return retval
    }

    blocks
      .filter((b) => !!b['v-model'])
      .forEach((block) => {
        let props = block.props || {}

        let field = {
          name: block['v-model'],
          title: props.label || props.title || block['v-model'],
          label: props.label || props.title || block['v-model'],
          text: props.label || props.title || block['v-model'],
          secondary: props.label || props.title || block['v-model'],
          type: null,
          props: null,
        }

        switch (block.component) {
        case 'CmsInput':
          switch (props.type) {
          case 'select':
            if (props.multiple) {
              field.type = 'array'
              field.items = {
                type: 'string',
                enum: props.options || [],
              }
            } else {
              field.type = 'string'
              field.enum = props.options || []
            }
            break

          case 'text':
          case 'textarea':
            field.type = 'text'
            break

          case 'number':
            field.type = 'number'
            break

          case 'checkbox':
            field.type = 'boolean'
            break
          }
          break

        case 'CmsInputSelect':
        case 'InputSelect':
          if (props.multiple) {
            field.type = 'array'
            field.items = {
              type: 'string',
              enum: props.options || [],
            }
          } else {
            field.type = 'string'
            field.enum = props.options || []
          }
          break

        case 'CmsInputText':
        case 'CmsInputTextarea':
        case 'InputText':
        case 'InputTextarea':
          field.type = 'text'
          break

        case 'CmsInputNumber':
        case 'InputNumber':
          field.type = 'number'
          break

        case 'CmsInputCheckbox':
        case 'InputCheckbox':
          field.type = 'boolean'
          break

        case 'CmsQuizQuestion':
        case 'QuizQuestion':
          field.type = 'string'
          field.enum = props.options || []
          break

        default:
          field.type = 'string'
          break
        }

        retval.properties[field.name] = field
      })

    return retval
  },

  getPageFields(page) {
    if (!page || !page.blocks || !page.blocks.length) {
      return []
    }

    let retval = []
    page.blocks
      .filter((b) => !!b['v-model'])
      .forEach((block) => {
        let props = block.props || {}

        let field = {
          name: block['v-model'],
          label: props.label || props.title || block['v-model'],
          type: null,
          options: null,
        }

        switch (block.component) {
        case 'CmsInput':
          switch (props.type) {
          case 'select':
            field.type = 'list'
            field.options = {
              multiple: props.multiple,
              values: props.options,
            }
            break

          case 'text':
          case 'textarea':
            field.type = 'text'
            break

          case 'number':
            field.type = 'number'
            break

          case 'checkbox':
            field.type = 'boolean'
            break
          }
          break

        case 'CmsInputSelect':
        case 'InputSelect':
          field.type = 'list'
          field.options = {
            multiple: props.multiple,
            values: props.options,
          }
          break

        case 'CmsInputText':
        case 'CmsInputTextarea':
        case 'InputText':
        case 'InputTextarea':
          field.type = 'text'
          break

        case 'CmsInputNumber':
        case 'InputNumber':
          field.type = 'number'
          break

        case 'CmsInputCheckbox':
        case 'InputCheckbox':
          field.type = 'boolean'
          break

        case 'CmsQuizQuestion':
        case 'QuizQuestion':
          field.type = 'list'
          field.options = {
            multiple: false,
            values: props.options,
          }
          break

        default:
          field.type = 'text'
          break
        }

        retval.push(field)
      })

    return retval
  },
}

export default PageHelper