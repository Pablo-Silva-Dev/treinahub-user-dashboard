import { IContactSupportDTO } from "../dtos/ContactSupportDTO";

export interface IContactsSupportRepository {
  listContacts(companyId: string): Promise<IContactSupportDTO[]>;
}
