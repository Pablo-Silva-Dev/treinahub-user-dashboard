import { IFaqQuestionDTO } from "../dtos/FaqQuestionDTO.ts";

export interface IFaqQuestionsRepository {
  listFaqQuestions(companyId: string): Promise<IFaqQuestionDTO[]>;
}
