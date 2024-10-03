export interface IQuizResultDTO {
  id: string;
  quiz_id: string;
  quiz_attempt_id: string;
  user_id: string;
  total_quiz_questions: number;
  total_correct_questions: number;
  total_correct_questions_percentage: number;
}

export interface ICreateQuizResultDTO {
  quiz_id: string;
  quiz_attempt_id: string;
  user_id: string;
}

export interface IGetQuizResultDTO {
  quiz_attempt_id: string;
  user_id: string;
}
