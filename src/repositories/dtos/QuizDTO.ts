import { IQuizAttemptDTO } from "./QuizAttemptDTO";
import { IQuizQuestionDTO } from "./QuizQuiestionDTO";
import { ITrainingDTO } from "./TrainingDTO";

export interface IQuizDTO {
  id: string;
  training_id: string;
  question?: IQuizQuestionDTO[];
  quiz_attempts?: IQuizAttemptDTO[];
}

export interface ICreateQuizDTO {
  training_id: never;
}
export interface ICompleteQuizQuestionDTO {
  id: string;
  quiz_id: string;
  content: string;
  questions: IQuizQuestionDTO[];
  quiz: IQuizDTO;
  training: ITrainingDTO;
  quiz_attempts?: IQuizAttemptDTO[];
}
