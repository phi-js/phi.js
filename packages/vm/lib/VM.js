import { getProperty, setProperty, parse } from './utils'

import vmFunctions from './functions/index.js'
import vmOperators from './operators/index.js'

export default class VM {
  constructor() {
    this.functions = Object.assign({}, vmFunctions)
    this.operators = Object.assign({}, vmOperators)
    this.onModelSet = null
  }

  async eval(expr, localScope = null) {
    if (!expr || (typeof expr != 'string' && typeof expr != 'object')) {
      return expr
    }

    if (typeof expr == 'string') {
      return parse(expr, localScope)
    }

    if (Array.isArray(expr)) {
      let retval = []
      for (let i = 0; i < expr.length; i++) {
        retval[i] = await this.eval(expr[i], localScope)
      }
      return retval
    }

    // Declaracion de un Closure. No se evalúa
    if (typeof expr.function !== 'undefined') {
      return expr
    }

    if (typeof expr.call !== 'undefined') {
      return this.stmtCall(expr.call, expr.args, expr.then, localScope)
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
      return !(await this.eval(expr.not, localScope))
    }

    if (Array.isArray(expr.or)) {
      let statements = expr.or
      for (let i = 0; i < statements.length; i++) {
        if (await this.eval(statements[i], localScope)) {
          return true
        }
      }
      return false
    }

    if (Array.isArray(expr.and)) {
      let statements = expr.and
      for (let i = 0; i < statements.length; i++) {
        if (!(await this.eval(statements[i], localScope))) {
          return false
        }
      }
      return true
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
    let retval = {}
    for (let propertyName in expr) {
      if (!Object.prototype.hasOwnProperty.call(expr, propertyName)) {
        continue
      }
      retval[propertyName] = await this.eval(expr[propertyName], localScope)
    }

    return retval
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
  async stmtOperator(opName, field = null, args = null, localScope = null) {
    if (typeof this.operators[opName] == 'undefined') {
      throw `undefined operator '${opName}'`
    }

    let fieldValue = getProperty(localScope, field)
    let evaldArgs = await this.eval(args, localScope)

    return await this.operators[opName].bind(this)(fieldValue, evaldArgs, localScope)
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
  async stmtCall(functionName, functionArgs = null, functionThen = null, localScope = null) {
    if (typeof this.functions[functionName] == 'undefined') {
      throw `undefined function '${functionName}'`
    }

    let args = functionArgs ? await this.eval(functionArgs, localScope) : null
    let result = await this.functions[functionName].bind(this)(args, localScope)

    if (functionThen) {
      return await this.eval(functionThen, { ...localScope, $foo: result })
    } else {
      return result
    }

  }

  /**
   * IF statement
   * {
   *   "if": "...expr...",
   *   "then": "...expr...",
   *   "else": "...expr..."
   * }
   */
  async stmtIf(condition, exprThen, exprElse = null, localScope = null) {
    let retval = null
    let boo = await this.eval(condition, localScope)
    if (boo) {
      retval = await this.eval(exprThen, localScope)
    } else if (exprElse) {
      retval = await this.eval(exprElse, localScope)
    }

    return retval
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
  async stmtSwitch(expr, cases = [], defaultCase = null, localScope = null) {
    let res = await this.eval(expr, localScope)

    for (let i = 0; i < cases.length; i++) {
      if (cases[i].value == res) {
        return await this.eval(cases[i].do, localScope)
      }
    }

    if (defaultCase) {
      return await this.eval(defaultCase, localScope)
    }
  }


  /**
   * Chain statement
   * {
   *   "chain": [
   *     {
   *       "info": {..item...},
   *       "do": {...expr...},
   *       "assign": "name of model variable to store results"
   *     },
   *     {
   *       "info": {..item...},
   *       "do": {...expr...},
   *       "assign": "name of model variable to store results"
   *     }
   *   ]
   * }
   *
   */
  async stmtChain(arrChain = [], localScope = null) {
    if (!arrChain.length) {
      return
    }

    let scope = localScope
    let res
    for (let i = 0; i < arrChain.length; i++) {
      let link = arrChain[i]
      if (typeof link?.do === 'undefined') {
        continue
      }

      res = await this.eval(link.do, scope)
      if (link.assign) {
        setProperty(scope, link.assign, res)
        this.onModelSet && this.onModelSet(link.assign, res, scope)
      }
    }

    return res
  }

  /**
   * Recibe una expresion de tipo CLOSURE:
   * {
   *    arguments: ['arg1', 'arg2', ...],
   *    function: {
   *      call: 'doStuff'
   *    }
   * }
   * equivale a (arg1, arg2) => { return doStuff() }
   *
   * y la ejecuta con los argumentos dados.
   *
   * runClosure(fn, args)  es equivalente a ....
   *
   * let callable = (argsname) => { fn }
   * return callable(args);
   */
  runClosure(fn, arrArgs = [], localScope = null) {
    if (!Array.isArray(arrArgs)) {
      throw 'invalid arguments in function call'
    }

    if (!fn.function) {
      throw 'invalid function'
    }

    let argValues = {}
    if (Array.isArray(fn.arguments)) {
      for (let i = 0; i < fn.arguments.length; i++) {
        let argName = fn.arguments[i]
        if (typeof arrArgs[i] != 'undefined') {
          argValues[argName] = arrArgs[i]
        }
      }
    }

    return this.eval(fn.function, { ...localScope, ...argValues })
  }

}