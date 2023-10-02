import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface ListQuestionAnswers {
  questionId: string
  page: number
}

type ListQuestionAnswersUseCaseResponse = Either<
  null,
  {
    answers: Answer[]
  }
>

export class ListQuestionAnswersUseCase {
  constructor(private answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    page,
  }: ListQuestionAnswers): Promise<ListQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      { page },
    )

    return right({
      answers,
    })
  }
}
