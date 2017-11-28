String.prototype.matchAll = function (regexp: RegExp): string[][] | null {
  const matches: any[] = []
    // tslint:disable-next-line:only-arrow-functions
  this.replace(regexp, function () {
    const arr = ([]).slice.call(arguments, 0)
    const extras = arr.splice(-2)
    arr.index = extras[0]
    arr.input = extras[1]
    matches.push(arr)
  } as any)
  return matches.length ? matches : null
}

const expressionRegexp = /\${([^}]*)}/g

const matchExpressions = (value: string) => value.matchAll(expressionRegexp)

export function getExpressions (elem: Node): IExpressionInfo[] {
  const result = []
  const nodes = processNode(elem)
  if (nodes) {
    for (const node of nodes) {
      result.push(node)
    }
  }
  for (const node of Array.from(elem.childNodes)) {
    const n2 = getExpressions(node)
    for (const n of n2) {
      result.push(n)
    }
  }
  return result
}

interface IExpressionInfo {
  expr: any
  node: Element
}

function processNode (node: Node): IExpressionInfo[] {
  if (node.nodeType === 3) {
    if ('nodeValue' in node && node.nodeValue) {
      const value = node.nodeValue
      const match = matchExpressions(value)
      if (match && match.length > 0) {
        const parentNode = node.parentNode
        if (parentNode) {
          const nodes = []
          const textString = value
          let i = 0
          for (const entry of match) {
            const startOffset = node.nodeValue.indexOf(entry[0])
            const endOffset = startOffset + entry[0].length
            const length2 = startOffset - i
            if (length2 > 0) {
              const str = textString.substr(i, length2)
              const textNode = document.createTextNode(str)
              parentNode.insertBefore(textNode, node)
            }

            if (match.length === 1) {
              nodes.push({
                expr: entry[1],
                node: parentNode as Element
              })
            } else {
              const newNode2 = document.createElement('span')
              parentNode.insertBefore(newNode2, node)

              nodes.push({
                expr: entry[1],
                node: newNode2 as Element
              })
            }

            i = endOffset
          }

          const length = textString.length - i
          if (length > 0) {
            const str = textString.substr(i, length)
            const textNode = document.createTextNode(str)
            parentNode.insertBefore(textNode, node)
          }
          parentNode.removeChild(node)
          return nodes
        }
      }
    }
  }
  return []
}

/** Hooks into the binding step */
export type BindingHandler = (elem: Element, expr: string, context: any) => void

/*** Evaluate and bind expressions within a certain context. */
const bindExpressions = (
    expressions: IExpressionInfo[],
    context: any, handler: BindingHandler) => {
  for (const ei of expressions) {
    const { expr, node } = ei
    handler(node, expr, context)
  }
}

/** Evaluates an expression. (Used as a hook) */
export type Evaluator = (expr: string, context: any) => any

/** Evaluate an expression within a certain context and returns the value. */
export const evalExpression = (evaluator: Evaluator, expr: string, context: any) =>
    evaluator(expr, context)

/** Evaluate and binds an expression to the DOM. (This can be replaced by extenders) */
export const bindExpression = (evaluator: Evaluator, elem: Element, expr: string, context: any) =>
    elem.innerHTML = evalExpression(evaluator, expr, context)

/** Default evaluator */
export const defaultEvaluator = (expr: string, context: any) =>
    new Function('context', `with(context) { return ${expr}; }`)(context)

/** Default binding handler */
const defaultBindingHandler = (target: Element, expr: string, context: any) => {
  bindExpression(defaultEvaluator, target, expr, context)
}

/** Bind a DOM element to some data using a binding handler. */
export const bind = (elem: Element, data: any, bindingHandler: BindingHandler = defaultBindingHandler) =>
    bindExpressions(
        getExpressions(elem),
        data,
        bindingHandler)

function cloneAttributes (element: Element, sourceNode: Node) {
    // tslint:disable-next-line:prefer-const
  let attr: Attr = null!
  const attributes = Array.prototype.slice.call(sourceNode.attributes)
    // tslint:disable-next-line:no-conditional-assignment
  while (attr = attributes.pop()) {
    if (attr !== null) {
      element.setAttribute(attr.nodeName, attr.nodeValue!)
    }
  }
}

/** Represents the template context. */
export interface ITemplateContext {
    /** The template. */
  template: Element | string
    /** The target element that the template has been rendered to. */
  target: Element
    /** The data model to bind to. */
  data: any
    /** The placeholders in this context. */
  placeholders: ITemplatePlaceholder[]
}

/** Represents a placeholder. */
export interface ITemplatePlaceholder {
    /** The element that represents the placeholder. */
  elem: Element
    /** The expression replaced by the placeholder. */
  expr: string
    /** The template context. */
  context: ITemplateContext
}

/** Renders a template to the DOM and binds it to some data.  */
export const render = (
    target: Element,
    template: Element | string,
    data: any,
    bindingHandler: BindingHandler = defaultBindingHandler) => {
  const context: ITemplateContext = {
    data,
    placeholders: [],
    target,
    template
  }
  const parent = target.parentElement!
  let templateInstance: Element = null!
  templateInstance = document.createElement('div')
  templateInstance.innerHTML = ''
  if (typeof template === 'string') {
    const templateRoot = document.createTextNode(template)
    templateInstance.appendChild(templateRoot)
  } else {
    if (template instanceof HTMLTemplateElement) {
      const templateRoot = document.importNode(template.content, true)
      templateInstance.appendChild(templateRoot)
    } else {
      const templateRoot = template.children.item(0).cloneNode(true)
      templateInstance.appendChild(templateRoot)
    }
  }
  const handlerWrapper = (elem: Element, expr: string, ctx: any) => {
    context.placeholders.push({
      context,
      elem,
      expr
    })
    bindingHandler(elem, expr, ctx)
  }
  const node = []
  bind(templateInstance, data, handlerWrapper)
    // TODO: Copy the attributes of "target" over to "templateInstance".
  cloneAttributes(templateInstance, target)
  parent.replaceChild(templateInstance, target)
  return context
}
