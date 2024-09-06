import { IFaqQuestionDTO } from "../dtos/FaqQuestionDTO.ts";

export interface IFaqQuestionsRepository {
  listFaqQuestions(): Promise<IFaqQuestionDTO[]>;
}
