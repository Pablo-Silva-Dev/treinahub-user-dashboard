import { ICreateQuizAttemptDTO, IQuizAttemptDTO } from "../dtos/QuizAttemptDTO";

export interface IQuizAttemptsRepository {
  createQuizAttempt(data: ICreateQuizAttemptDTO): Promise<IQuizAttemptDTO>;
  listQuizAttemptsByUser(userId: string): Promise<IQuizAttemptDTO[]>;
  getQuizAttemptsById(quizAttemptId: string): Promise<IQuizAttemptDTO>;
}
