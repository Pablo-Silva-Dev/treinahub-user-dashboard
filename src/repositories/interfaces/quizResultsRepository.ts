import {
  ICreateQuizResultDTO,
  IGetQuizResultDTO,
  IQuizResultDTO,
} from "../dtos/QuizResultDTO";

export interface IQuizResultsRepository {
  createQuizResult(data: ICreateQuizResultDTO): Promise<IQuizResultDTO>;
  getQuizResultByUserAndQuizAttempt(
    data: IGetQuizResultDTO
  ): Promise<IQuizResultDTO>;
  deleteQuizResult(quizResultId: string): Promise<void>;
  listQuizzesResultsByUser(userId: string): Promise<IQuizResultDTO[]>;
}
