import {
  ICertificateDTO,
  IGenerateCertificateDTO,
} from "../dtos/CertificateDTO";

export interface ICertificatesRepository {
  generateCertificate(data: IGenerateCertificateDTO): Promise<ICertificateDTO>;
  listCertificatesByUser(userId: string): Promise<ICertificateDTO[]>;
  getCertificateById(certificatesId: string): Promise<ICertificateDTO>;
}
