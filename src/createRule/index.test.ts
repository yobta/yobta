import { jest } from '@jest/globals'

import { ValidationContext } from '../syncYobta'
import { createRule } from './'

function validateNumber<I>(input: I): number {
  let number = Number(input)
  if (isNaN(number)) throw new Error('youbta!')
  return number
}

it('validates input', () => {
  let pushError = jest.fn()
  let testNumber = createRule(validateNumber)
  let result = testNumber({
    data: 1,
    path: ['price'],
    pushError,
    field: 'f'
  })(1)
  expect(result).toEqual(1)
  expect(pushError).toHaveBeenCalledTimes(0)
})

it('does not intercept errors', () => {
  let pushError = jest.fn()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let simulateUnexpectedException = createRule((data: number) => {
    throw new Error('yobta!')
  })
  expect(() =>
    simulateUnexpectedException({
      data: 1,
      field: 'f',
      path: ['price'],
      pushError
    })(1)
  ).toThrow('yobta!')
  expect(pushError).toHaveBeenCalledTimes(0)
})

it('gets both data and context', () => {
  let pushError = jest.fn()
  let spy = jest.fn()
  let validationContext: ValidationContext = {
    data: 1,
    field: 'f',
    path: ['price'],
    pushError
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let simulateUnexpectedException = createRule(
    (data: number, context: ValidationContext) => {
      spy(data, context)
      return data
    }
  )
  simulateUnexpectedException(validationContext)(1)
  expect(spy).toHaveBeenCalledWith(1, validationContext)
})
