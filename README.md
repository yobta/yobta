# Yobta!
A promising and ridiculously small es6 validator that tree-shakes well and respects your bundle.

**Current state: work in progress**

## General Plan
We want to fulfill the front-end needs and create functional promise-based validator which is fun to work with.

## General Requirements
- Functional
- Universal
- Immutable
- Sync/async
- Coercion (https://ajv.js.org/coercion.html)

## Functional requirements
- Validate: maps, arrays, strings, numbers, booleans, dates, FormData, URLSearchParams
- Flow control: fall-backs, side effects, logic operators, serializers

## API proposals

### Case 1: Store hydration
We need to get a type-safe initial state (map) from the URL,
the operation should be sync and silent (no errors).

```js
const getInitialState = syncYobta(
  URLSearchParamsYobta(),
  shapeYobta({
    name:
      catchYobta(
        'A hacker, yobta!',
        stringYobta(),
        defaultYobta('Anonymous'),
        minYobta(2),
        maxYobta(160),
      ),
    age:
      catchYobta(
        NaN,
        numberYobta(),
        minYobta(16),
        maxYobta(150),
      )
  }),
)

const [initialState] = getInitialState()

const myStore = createStore('name', initialState)
```

### Case 2: Form validation
We need to get a type-safe form data, but the validation operation should be async,
because we don't know if one of the fields exists in our database. This operation
can produce errors and we need human friendly error messages.

```js
async function confirmPassword (password) (
  const response = await fetch(`/api/my-endpoint?password=${password}`)
  if (!response.ok) throw new Error('Wrong password')
  return password.data.password
)

const validate = asyncYobta(
  formYobta({
    password: [
      stringYobta('No hacking yobta!'),
      requiredYobta('Please enter password'),
      awaitYobta(confirmPassword),
    ],
    newPassword: [
      stringYobta('No hacking yobta!'),
      requiredYobta('Please enter new password'),
      trim, // take it from lodash
      minYobta(6, 'Should be at least 6 characters'),
      maxYobta(16, 'Should be within 16 characters'),
      matchYobta(passwordRegExp), // pease make your own RegExp
    ],
    passwordRetype: [
      sameYobta('newPassword', 'Should match new password')
    ],
  })
)

const myForm = window.getElementByID('myForm')

const [formData, errors] = await validate(myForm)
```

## Problems and Limitations

Due to typescript design [limitation](https://github.com/microsoft/TypeScript/issues/25256) the `required` rule needs an explicit type when chained (`requiredYobta<string>('My error')`). To avoid manual errors I decided to chose the wrapping approach:

```js
requiredYobta(
  stringYobta('String type error message'),
  'Required error message'
)
```

### Types
- [-] Async validator
- [+] Sync validator
- [+] Shape validator
- [-] Enum validator
- [+] Array validator
  - [+] items
  - [-] contains
  - [+] unique
  - [+] minimum items
  - [+] maximum items
- [+] String validator
  - [+] minimum characters
  - [+] maximum characters
  - [+] email
  - [-] href
  - [-] credit card number
  - [-] phone number
  - [-] base64
- [+] Number validator
  - [+] int
  - [+] minimum
  - [+] maximum
- [+] Boolean validator
- [+] Date validator
  - [+] minimum date
  - [+] maximum date
- [+] RegExp test
- [-] FormData validator
- [-] URL
- [-] URLSearchParams validator

### Flow Utilities
- [+] required
- [+] default
- [+] catch
- [-] identical
- [-] different
- [-] oneOf
- [-] anyOf

### Docs
- [-] Readme for all
- [-] JSDoc for all

## Samples
- Ajv — Follows [json-schema.org](https://json-schema.org) specs, great choice for a back-end
- Yup — Popular front-end library
- Shark-Validator — a validator es6, but class-based
- formurai — to be researched

Docs coming soon


###### Kudos:
[Andrey Sitnik](https://sitnik.ru)
[Joe Calzaretta](https://github.com/jcalz)
[Jon Schlinkert](https://github.com/jonschlinkert)
[John-David Dalton](https://github.com/jdalton)
###### Pokes:
[YoptaScript](github.com/samgozman/YoptaScript)
