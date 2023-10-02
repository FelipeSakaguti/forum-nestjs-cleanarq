import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { EditAnswerUseCase } from './edit-answer'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { InMemoryAnswerAttachmentsRepository } from 'test/repositories/in-memory-answer-attachments-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentsRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswersAttachmentRepository =
      new InMemoryAnswerAttachmentsRepository()
    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswersAttachmentRepository,
    )

    sut = new EditAnswerUseCase(
      inMemoryAnswersRepository,
      inMemoryAnswersAttachmentRepository,
    )
  })

  it('should be able to edit a answer', async () => {
    const newAnswer = makeAnswer()

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: newAnswer.authorId.toValue(),
      answerId: newAnswer.id.toValue(),
      content: 'Novo Conteudo',
      attachmentsIds: ['1', '2'],
    })

    inMemoryAnswersAttachmentRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityId('2'),
      }),
    )

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.answer).toMatchObject({
        content: 'Novo Conteudo',
      })
      expect(
        inMemoryAnswersRepository.items[0].attachments.currentItems,
      ).toEqual([
        expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
        expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
      ])
    }
  })

  it('should not be able to delete a answer from another user', async () => {
    const newAnswer = makeAnswer({
      authorId: new UniqueEntityId('author-1'),
    })

    await inMemoryAnswersRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'author-2',
      answerId: newAnswer.id.toValue(),
      content: 'Novo Conteudo',
      attachmentsIds: [],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
