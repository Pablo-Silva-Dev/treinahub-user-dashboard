import { IQuizDTO } from "./QuizDTO";
import { IQuizResponseDTO } from "./QuizResponseDTO";

export interface IQuizAttemptDTO {
  id: string;
  quiz_id: string;
  user_id: string;
  startedAt: Date;
  finishedAt?: Date;
  quiz_responses?: IQuizResponseDTO[];
  quiz?: IQuizDTO;
}

export interface ICreateQuizAttemptDTO {
  quiz_id: string;
  user_id: string;
}

export interface IListQuizAttemptsByUserAndQuizDTO {
  quiz_id: string;
  user_id: string;
}

