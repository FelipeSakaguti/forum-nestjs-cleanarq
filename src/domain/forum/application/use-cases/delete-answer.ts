import { Either, left, right } from '@/core/either'
import { AnswersRepository } from '../repositories/answers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'

interface DeleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

type DeleteAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteAnswerUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const Answer = await this.answersRepository.findById(answerId)

    if (!Answer) {
      return left(new ResourceNotFoundError())
    }

    if (authorId !== Answer.authorId.toString()) {
      return left(new NotAllowedError())
    }

    await this.answersRepository.delete(Answer)

    return right(null)
  }
}
