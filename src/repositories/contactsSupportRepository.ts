import { api, IApiSuccessResponse } from "@/services/api";
import { IContactSupportDTO } from "./dtos/ContactSupportDTO";
import { IContactsSupportRepository } from "./interfaces/contactsSupportRepository";
export class ContactsSupportRepository implements IContactsSupportRepository {
  async listContacts(): Promise<IContactSupportDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<IContactSupportDTO[]>>(
        "/contacts-support/list"
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
