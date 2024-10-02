import { ICompleteQuizQuestionDTO } from "../dtos/QuizDTO";

export interface IQuizzesRepository {
  getQuizById(quizId: string): Promise<ICompleteQuizQuestionDTO>;
  getQuizByTraining(trainingId: string): Promise<ICompleteQuizQuestionDTO>;
}
