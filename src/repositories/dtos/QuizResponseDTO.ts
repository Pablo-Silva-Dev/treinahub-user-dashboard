import { IQuestionOptionDTO } from "./QuestionOptionDTO";
import { IQuizAttemptDTO } from "./QuizAttemptDTO";
import { IQuizQuestionDTO } from "./QuizQuiestionDTO";

export interface IQuizResponseDTO {
  id: string;
  quiz_attempt_id: string;
  question_id: string;
  selected_option: IQuestionOptionDTO;
  is_correct: boolean;
  correct_option: IQuestionOptionDTO;
  quiz_attempt?: IQuizAttemptDTO;
  question: IQuizQuestionDTO;
  ai_response?: string;
}

export interface ICreateQuizResponseDTO {
  quiz_attempt_id: string;
  question_id: string;
  selected_option_id: string;
}
