import { booleanYobta } from '../booleanYobta'
import { catchYobta } from '../catchYobta'
import { minCharactersYobta } from '../minCharactersYobta'
import { numberYobta } from '../numberYobta'
import { enumYobta } from '../enumYobta'
import { requiredYobta } from '../requiredYobta'
import { shapeYobta } from '../shapeYobta'
import { stringYobta } from '../stringYobta'
import { urlSearchParamsYobta } from '../urlSearchParamsYobta'
import { syncYobta } from './'

let validate = syncYobta(numberYobta('yobta!'))

it('accepts valid', () => {
  let result = validate(1)
  expect(result).toBe(1)
})

it('can pipe rules', () => {
  let validateMultiple = syncYobta(
    stringYobta(),
    requiredYobta(),
    minCharactersYobta(5)
  )
  let result = validateMultiple('yobta')
  expect(result).toBe('yobta')
})

it('rejects invalid', () => {
  let attempt = (): any => validate([])
  expect(attempt).toThrow('yobta!')
})

let validateSearch = syncYobta(
  urlSearchParamsYobta(),
  shapeYobta({
    currentTab: [
      catchYobta(
        'tab-1',
        enumYobta(['tab-1', 'tab-2', 'tab-3']),
        requiredYobta()
      )
    ],
    myModalIsOpen: [catchYobta(false, booleanYobta(), requiredYobta())]
  })
)

it("creates default state when can't extract it from url", () => {
  expect(validateSearch('')).toEqual({
    currentTab: 'tab-1',
    myModalIsOpen: false
  })
})

it('extracts state from url', () => {
  expect(validateSearch('currentTab=tab-3&myModalIsOpen=true')).toEqual({
    currentTab: 'tab-3',
    myModalIsOpen: true
  })
})
