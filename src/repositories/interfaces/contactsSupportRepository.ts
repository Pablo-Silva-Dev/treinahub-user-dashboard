import { IContactSupportDTO } from "../dtos/ContactSupportDTO";

export interface IContactsSupportRepository {
  listContacts(): Promise<IContactSupportDTO[]>;
}
