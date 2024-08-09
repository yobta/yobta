import { fromEntries } from '../_internal/fromEntries/index.js'
import type { YobtaSyncRule } from '../rule/rule.js'
import { rule } from '../rule/rule.js'

export const formMessage = 'It should be HTMLFormElement or a form Event'

export const form = <I>(
  message: string = formMessage,
): YobtaSyncRule<I, Record<string, unknown>> =>
  rule((value, ctx) => {
    if (value instanceof Event && value.currentTarget) {
      if (value.type === 'submit') {
        value.preventDefault()
      }

      const { currentTarget, target } = value

      if (currentTarget instanceof HTMLFormElement) {
        ctx.form = currentTarget
      }

      // NOTE: instanceof would not work for custom elements here:
      if (target !== currentTarget) {
        ctx.input = target as HTMLInputElement
      }
    }

    if (value instanceof HTMLFormElement) {
      ctx.form = value
    }

    if (ctx.form) {
      const output = new FormData(ctx.form)
      return fromEntries(output) as Record<string, unknown>
    }

    throw new Error(message)
  })
