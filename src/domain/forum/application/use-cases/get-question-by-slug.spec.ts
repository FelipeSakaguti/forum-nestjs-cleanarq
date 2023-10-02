import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objetcts/slug'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )
    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
  })

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('slug-teste'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      slug: 'slug-teste',
    })
    expect(result.isRight()).toBe(true)
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        title: newQuestion.title,
      }),
    })
  })
})
