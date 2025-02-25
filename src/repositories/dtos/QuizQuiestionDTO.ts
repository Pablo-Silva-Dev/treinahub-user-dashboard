import { IQuestionOptionDTO } from "./QuestionOptionDTO";

export interface IQuizQuestionDTO {
  id: string;
  quiz_id: string;
  content: string;
  options?: IQuestionOptionDTO[];
}

export interface ICreateQuizQuestionDTO {
  quiz_id: string;
  content: string;
}

export interface IUpdateQuizQuestionDTO {
  id: string;
  content?: string;
}

export interface IExplainQuestionDTO {
  question: string;
  questionId?: string;
  selectedOptionContent: string;
  correctOptionContent: string;
}

