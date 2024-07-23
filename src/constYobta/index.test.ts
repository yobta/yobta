/* eslint-disable import/extensions */
import { constMessage, constYobta } from '.'
import { createValidator } from '../createValidator/createValidator'
import { shape } from '../shape/shape'

it('accepts when identical', () => {
  const validate = createValidator(
    shape({
      a: constYobta('a'),
    }),
  )
  const result = validate({ a: 'a' })
  expect(result).toEqual({ a: 'a' })
})

it('rejects when not identical', () => {
  const validate = createValidator(
    shape({
      a: constYobta('b', 'yobta'),
    }),
  )
  const attempt = (): any => validate({ a: 'a' })
  expect(attempt).toThrow('yobta')
})

it('rejects when not undefined', () => {
  const validate = createValidator(
    shape({
      a: constYobta('b', 'yobta'),
    }),
  )
  const attempt = (): any => validate({})
  expect(attempt).toThrow('yobta')
})

it('has default error mesage', () => {
  const validate = createValidator(
    shape({
      a: constYobta('b'),
    }),
  )
  const attempt = (): any => validate({ a: 'a' })
  expect(attempt).toThrow(constMessage('b'))
})
