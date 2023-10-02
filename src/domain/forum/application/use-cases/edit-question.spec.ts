import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from './edit-question'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from 'test/repositories/in-memory-question-attachment-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryQuestionsRepository,
      inMemoryQuestionAttachmentsRepository,
    )
  })

  it('should be able to edit a question', async () => {
    const newQuestion = makeQuestion()

    await inMemoryQuestionsRepository.create(newQuestion)

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    const result = await sut.execute({
      authorId: newQuestion.authorId.toValue(),
      questionId: newQuestion.id.toValue(),
      content: 'Novo Conteudo',
      title: 'Novo Titulo',
      attachmentsIds: ['1', '3'],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.question).toMatchObject({
        content: 'Novo Conteudo',
        title: 'Novo Titulo',
      })
      expect(inMemoryQuestionsRepository.items[0].id).toEqual(
        result.value?.question.id,
      )
      expect(
        inMemoryQuestionsRepository.items[0].attachments.currentItems,
      ).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
      ])
    }
  })

  it('should not be able to delete a question from another user', async () => {
    const newQuestion = makeQuestion({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryQuestionsRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: newQuestion.id.toValue(),
      content: 'Novo Conteudo',
      title: 'Novo Titulo',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
