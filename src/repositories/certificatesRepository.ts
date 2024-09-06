import { api, IApiSuccessResponse } from "@/services/api";
import {
  ICertificateDTO,
  IGenerateCertificateDTO,
} from "./dtos/CertificateDTO";
import { ICertificatesRepository } from "./interfaces/certificatesRepository";

export class CertificatesRepository implements ICertificatesRepository {
  async generateCertificate(
    data: IGenerateCertificateDTO
  ): Promise<ICertificateDTO> {
    try {
      const response = await api.post<IApiSuccessResponse<ICertificateDTO>>(
        "/certificates/create",
        data
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async listCertificatesByUser(userId: string): Promise<ICertificateDTO[]> {
    try {
      const response = await api.get<IApiSuccessResponse<ICertificateDTO[]>>(
        `/certificates/list-by-user/${userId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
  async getCertificateById(certificateId: string): Promise<ICertificateDTO> {
    try {
      const response = await api.get<IApiSuccessResponse<ICertificateDTO>>(
        `/certificates/get-by-id/${certificateId}`
      );
      return response.data.RES;
    } catch (error) {
      throw error;
    }
  }
}
