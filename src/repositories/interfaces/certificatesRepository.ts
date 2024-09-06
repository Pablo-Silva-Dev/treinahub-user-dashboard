import { ICertificateDTO } from "../dtos/CertificateDTO";

export interface ICertificatesRepository {
  listCertificatesByUser(userId: string): Promise<ICertificateDTO[]>;
  getCertificateById(certificatesId: string): Promise<ICertificateDTO>;
}
