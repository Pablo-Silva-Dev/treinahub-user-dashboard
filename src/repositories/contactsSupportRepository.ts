import { api, IApiSuccessResponse } from "@/services/api";
import { IContactSupportDTO } from "./dtos/ContactSupportDTO";
import { IContactsSupportRepository } from "./interfaces/contactsSupportRepository";
export class ContactsSupportRepository implements IContactsSupportRepository {
  async listContacts(companyId: string): Promise<IContactSupportDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IContactSupportDTO[]>>(
        `/contacts-support/list/${companyId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
