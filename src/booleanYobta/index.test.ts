import { syncYobta } from '../syncYobta'
import { booleanYobta, booleanMessage } from './'

const customMessage = 'yobta!'
const validate = syncYobta(booleanYobta(customMessage))

it('accepts truthy', () => {
  let variants = ['yes', 'true', 'Yes', 'tRue', true, 1, '1']
  variants.forEach(variant => {
    let result = validate(variant)
    expect(result).toBe(true)
  })
})

it('accepts falsy', () => {
  let variants = ['no', 'false', 'No', 'FALSE', false, null, 'null', 0, '0']
  variants.forEach(variant => {
    let result = validate(variant)
    expect(result).toBe(false)
  })
})

it('accepts undefined', () => {
  let result = validate(undefined)
  expect(result).toBeUndefined()
})

it('rejects invalid', () => {
  let variants = [
    [],
    {},
    new Date(),
    Symbol('y'),
    new Set(),
    new Map(),
    2,
    () => 'yobta'
  ]
  variants.forEach(variant => {
    let attemt = (): any => validate(variant)
    expect(attemt).toThrow(customMessage)
  })
})

it('has default error message', () => {
  let rule = booleanYobta()
  let validateDefault = syncYobta(rule)
  let attemt = (): any => validateDefault('yobta')
  expect(attemt).toThrow(booleanMessage)
})
