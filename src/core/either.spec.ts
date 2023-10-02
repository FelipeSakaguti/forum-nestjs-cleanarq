import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return right('success')
  } else {
    return left('error')
  }
}

test('success result', () => {
  const successResult = doSomething(true)

  expect(successResult.isRight()).toBe(true)
})

test('error result', () => {
  const successResult = doSomething(false)

  expect(successResult.isLeft()).toBe(true)
})
