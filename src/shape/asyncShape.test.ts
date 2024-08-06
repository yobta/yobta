/* eslint-disable import/extensions */

import {
  constant,
  createAsyncValidator,
  different,
  fallback,
  identical,
  shape,
  string,
  stringMessage,
} from '..'
import { createContext } from '../_internal/createContext'
import { YobtaError } from '../YobtaError'
import { asyncShape, asyncShapeMessage } from './asyncShape'

const validate = createAsyncValidator(
  asyncShape({
    age: string(),
    name: string(),
  }),
)

it('accepts valid shapes', async () => {
  const result = await validate({
    age: 1,
    name: 'yobta',
  })
  expect(result).toEqual([{ age: '1', name: 'yobta' }, null])
})

it('accepts valid shapes with overload', async () => {
  const result = await validate({
    age: 0,
    experience: 0,
    name: 'yobta',
  })
  expect(result).toEqual([{ age: '0', experience: 0, name: 'yobta' }, null])
})

it('rejects invalid input', async () => {
  const attempt = async (): Promise<any> => await validate([])
  const result = await attempt()
  expect(result).toEqual([
    null,
    [
      new YobtaError({
        field: '@',
        message: asyncShapeMessage,
        path: [],
      }),
    ],
  ])
})

it('coerces undefined', async () => {
  const validateUndefined = createAsyncValidator(asyncShape({}))
  const attempt = async (): Promise<any> => await validateUndefined(undefined)
  const result = await attempt()
  expect(result).toEqual([{}, null])
})

it('has custom error messages', async () => {
  const attempt = (): any =>
    createAsyncValidator(
      asyncShape(
        {
          name: constant('yobta'),
        },
        'yobta!',
      ),
    )([])
  const result = await attempt()
  expect(result).toEqual([
    null,
    [
      new YobtaError({
        field: '@',
        message: 'yobta!',
        path: [],
      }),
    ],
  ])
})

it('captures errors from field validators', async () => {
  const attempt = (): any =>
    validate({
      name: [],
    })
  const result = await attempt()

  expect(result).toEqual([
    null,
    [
      new YobtaError({
        field: 'age',
        message: stringMessage,
        path: ['age'],
      }),
      new YobtaError({
        field: 'name',
        message: asyncShapeMessage,
        path: ['name'],
      }),
    ],
  ])
})

it('returns errors for invalid keys', async () => {
  const context = createContext({})
  // jest.spyOn(context, 'pushError')

  const attempt = (): any =>
    asyncShape({
      name: string(),
    })(context)({
      name: {},
    })
  expect(attempt).rejects.toThrow(asyncShapeMessage)
  // expect(pushErrorMock).toHaveBeenCalledWith(new Error(stringMessage))
})

it('should replace context.data', async () => {
  const replaced = {
    newPassword: 'new yobta',
    password: 'old yobta',
    retypePassword: 'new yobta',
  }
  const attempt = createAsyncValidator(
    fallback(() => replaced),
    shape({
      newPassword: different(() => 'password'),
      password: string(),
      retypePassword: identical(() => 'newPassword'),
    }),
  )
  const result = await attempt(undefined)
  expect(result).toEqual([replaced, null])
})

it('has no racing condition', async () => {
  const attempt = createAsyncValidator(
    asyncShape({
      address: constant('yobta'),
      description: constant('yobta'),
      title: constant('yobta'),
    }),
  )
  const result = await attempt({})
  expect(result).toEqual([
    null,
    [
      new YobtaError({
        field: 'title',
        message: 'Should be identical to "yobta"',
        path: ['title'],
      }),
      new YobtaError({
        field: 'address',
        message: 'Should be identical to "yobta"',
        path: ['address'],
      }),
      new YobtaError({
        field: 'description',
        message: 'Should be identical to "yobta"',
        path: ['description'],
      }),
      new YobtaError({
        field: '@',
        message: asyncShapeMessage,
        path: ['@'],
      }),
    ],
  ])
})
