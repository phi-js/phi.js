import { getProperty, setProperty, parse } from './utils'

import vmOperators from './operators/index.js'
import { registeredFunctions } from '../plugins/registerPlugin'

export default class VM {
  constructor() {
    this.operators = Object.assign({}, vmOperators)
    this.onModelSet = null
  }

  debug() {
    return
    // console.log('VM.debug:', ...arguments)
  }

  setModelProperty(propertyName, propertyValue, localScope) {
    this.debug('setModelProperty', localScope, propertyName, propertyValue)
    localScope && setProperty(localScope, propertyName, propertyValue)
    this.onModelSet && this.onModelSet(propertyName, propertyValue, localScope)
  }

  eval(expr, localScope = null) {
    this.debug('eval', expr, localScope)

    if (!expr || (typeof expr != 'string' && typeof expr != 'object')) {
      return expr
    }

    if (typeof expr == 'string') {
      return parse(expr, localScope)
    }

    if (Array.isArray(expr)) {
      const retval = []
      for (let i = 0; i < expr.length; i++) {
        retval.push(this.eval(expr[i], localScope))
      }
      return retval
    }

    // Backwards compatibility
    if (typeof expr.do !== 'undefined') {
      return this.stmtAssign({
        assign: expr.assign,
        stmt: expr.do,
      }, localScope)
    }

    if (typeof expr.assign !== 'undefined') {
      return this.stmtAssign(expr, localScope)
    }

    if (typeof expr.call !== 'undefined') {
      return this.stmtCall(expr.call, expr.args, localScope)
    }

    if (Array.isArray(expr.chain)) {
      return this.stmtChain(expr.chain, localScope)
    }

    if (typeof expr.op !== 'undefined') {
      return this.stmtOperator(expr.op, expr.field, expr.args, localScope)
    }

    if (typeof expr.if !== 'undefined') {
      return this.stmtIf(expr.if, expr.then, expr.else, localScope)
    }

    if (typeof expr.switch !== 'undefined') {
      return this.stmtSwitch(expr.switch, expr.case, expr.default, localScope)
    }

    if (typeof expr.not !== 'undefined') {
      return !this.eval(expr.not, localScope)
    }


    /*
    and/or statememts
    */
    if (Array.isArray(expr.or)) {
      for (let i = 0; i < expr.or.length; i++) {
        if (this.eval(expr.or[i], localScope)) {
          return true
        }
      }
      return false
    }

    if (Array.isArray(expr.and)) {
      for (let i = 0; i < expr.and.length; i++) {
        if (!this.eval(expr.and[i], localScope)) {
          return false
        }
      }
      return true
    }

    // JavaScript EVAL (via new Function)
    if (typeof expr.eval !== 'undefined') {
      const fx = new Function(['$modelValue'], '"use strict"; var window = null; var document = null;' + expr.eval)
      return fx(localScope)
    }

    /**
     * The expression is a general object:
     *
     * {
     *   "title": "Hi, this is whatever",
     *   "count": "{{people.length}}",
     *   "things": {
     *     "call": "fetch",
     *     "args": {
     *       "url": "https://......"
     *     }
     *   }
     * }
     */

    // /*
    // Only PARSE object (parse is recursive)
    // i.e. if the generic object has subproperties that can be interpreted as statements (i.e. object.and, object.call, etc)
    // then they are NOT evaluated
    // */
    // return parse(expr, localScope, true)

    /*
      Eval object recursivelly
    */
    const retval = {}
    for (const [propName, propValue] of Object.entries(expr)) {
      retval[propName] = this.eval(propValue, localScope)
    }
    return retval
  }

  // Assign a statement execution result to a modelValue property
  // {assign: [empty thing], stmt: some statement} will still run stmt, without assigning anything
  stmtAssign(expr, localScope) {
    const result = this.eval(expr.stmt, localScope)

    if (expr.assign) {
      if (typeof result?.then == 'function') {
        result.then((resolved) => this.setModelProperty(expr.assign, resolved, localScope))
      } else {
        this.setModelProperty(expr.assign, result, localScope)
      }
    }

    return result
  }


  /**
   * Operators
   * some.model.property >= 3
   *
   * {
   *   "op": "number.gte",
   *   "field": "some.model.property",
   *   "args": 3
   * }
   */
  stmtOperator(opName, field = null, args = null, localScope = null) {
    if (typeof this.operators[opName] == 'undefined') {
      // throw `undefined operator '${opName}'`
      console.warn(`undefined operator '${opName}'`)
      return undefined
    }

    const fieldValue = getProperty(localScope, field)
    const evaldArgs = this.eval(args, localScope)

    return this.operators[opName].bind(this)(fieldValue, evaldArgs, localScope)
  }

  /**
   * Function calls
   * fetch({url: '...'}).then(...)
   *
   * {
   *   "call": "fetch",
   *   "args": {
   *     "url": "https://........"
   *   },
   *   "then": ...
   * }
   *
   */
  stmtCall(functionName, functionArgs = null, localScope = null) {
    if (typeof registeredFunctions[functionName]?.callback == 'undefined') {
      throw `undefined function '${functionName}'`
    }

    const callback = registeredFunctions[functionName].callback
    const args = functionArgs ? this.eval(functionArgs, localScope) : null

    return callback.bind(this)(args, localScope, this)
  }

  /**
   * IF statement
   * {
   *   "if": "...expr...",
   *   "then": "...expr...",
   *   "else": "...expr..."
   * }
   */
  stmtIf(condition, exprThen = null, exprElse = null, localScope = null) {
    const boo = this.eval(condition, localScope)
    if (boo) {
      return exprThen ? (this.eval(exprThen, localScope)) : undefined
    }
    return exprElse ? (this.eval(exprElse, localScope)) : undefined
  }

  /**
   * Switch statement
   * {
   *    "switch": "...expr...",
   *    "case": [
   *      {
   *        "value": "rojo",
   *        "do": "...expr..."
   *      }
   *    ],
   *    "default": "... expr ..."
   * }
  */
  stmtSwitch(expr, cases = [], defaultCase = null, localScope = null) {
    let res = this.eval(expr, localScope)

    for (let i = 0; i < cases.length; i++) {
      if (cases[i].value == res) {
        return this.eval(cases[i].do, localScope)
      }
    }

    if (defaultCase) {
      return this.eval(defaultCase, localScope)
    }
  }


  /**
   * Chain statement
   *
   * Runs the statements, one at a time, awaiting each one
   *
   * {
   *   "chain": [
   *     { ...stmt1 },
   *     { ...stmt2 },
   *     { ...stmt3 },
   *   ]
   * }
   *
   */
  async stmtChain(arrChain = [], localScope = null) {
    if (!arrChain.length) {
      return []
    }

    const retval = []
    for (let i = 0; i < arrChain.length; i++) {
      const result = await this.eval(arrChain[i], localScope)
      retval.push(result)
    }

    return retval
  }
}