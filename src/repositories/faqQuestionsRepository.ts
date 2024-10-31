import { api, IApiSuccessResponse } from "@/services/api";
import { IFaqQuestionDTO } from "./dtos/FaqQuestionDTO";
import { IFaqQuestionsRepository } from "./interfaces/faqQuestionsRepository";

export class FaqQuestionsRepository implements IFaqQuestionsRepository {
  async listFaqQuestions(companyId: string): Promise<IFaqQuestionDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IFaqQuestionDTO[]>>(
        `/faq-questions/list/${companyId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
