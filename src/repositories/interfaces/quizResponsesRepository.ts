import {
  ICreateQuizResponseDTO,
  IQuizResponseDTO,
} from "../dtos/QuizResponseDTO";

export interface IQuizResponsesRepository {
  createQuizResponse(data: ICreateQuizResponseDTO): Promise<IQuizResponseDTO>;
  listQuizResponsesByAttempt(attemptId: string): Promise<IQuizResponseDTO[]>;
  getQuizResponseById(quizResponseId: string): Promise<IQuizResponseDTO>;
  deleteManyQuizzesResponsesByQuizAttempt(attemptId: string): Promise<void>;
}
