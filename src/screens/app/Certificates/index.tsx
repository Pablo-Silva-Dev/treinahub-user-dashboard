import { Button } from "@/components/buttons/Button";
import { NoData } from "@/components/miscellaneous/NoData";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ICertificateDTO } from "@/repositories/dtos/CertificateDTO";
import { useAuthenticationStore } from "@/store/auth";
import { showAlertSuccess } from "@/utils/alerts";
import { formatDate } from "@/utils/formats";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CertificateCard } from "./components/CertificateCard";

export default function Certificates() {
  const [certificates, setCertificates] = useState<ICertificateDTO[]>([]);
  const [, setSelectedCertificate] = useState<ICertificateDTO | null>(null);

  const { user } = useAuthenticationStore();
  const navigate = useNavigate();

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const getUserCertificates = useCallback(async () => {
    try {
      const certificates = await certificatesRepository.listCertificatesByUser(
        user.id
      );
      setCertificates(certificates);
    } catch (error) {
      console.log(error);
    }
  }, [certificatesRepository, user.id]);

  useEffect(() => {
    getUserCertificates();
  }, [getUserCertificates]);

  const handleDownloadCertificate = (certificate: ICertificateDTO) => {
    if (certificate) {
      window.location.href = certificate.url;
      showAlertSuccess(
        "O download do seu certificado foi realizado com sucesso!"
      );
    }
  };

  const handleSeeTrainings = () => {
    navigate("/dashboard/acessar-meus-treinamentos");
  };

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8 md:pl-[80px]">
      <div className="mr-3 mb-4">
        <ScreenTitleIcon screenTitle="Certificados" iconName="star" />
        <Subtitle
          content="Consulte aqui seus certificados de conclusão de treinamentos disponíveis"
          className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
        />
      </div>

      {certificates.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px] sm:gap-[20px] md:gap-[40px]">
          {certificates.map((certificate) => (
            <CertificateCard
              onSelectCertificate={() => setSelectedCertificate(certificate)}
              key={certificate.id}
              coverUrl={certificate.url}
              courseName={
                certificate.training
                  ? certificate.training.name
                  : "Treinamento indisponível"
              }
              emissionDate={formatDate(certificate.created_at.toString())}
              totalCourseClasses={
                certificate.training &&
                certificate.training.video_classes &&
                certificate.training.video_classes.length
              }
              onDownload={() => handleDownloadCertificate(certificate)}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-full max-w-[480px]">
            <NoData
              description="Você ainda não concluiu nenhum treinamento. Seus certificados
              estarão disponíveis a medida que os treinamentos forem concluídos."
            />
            <div className="w-full mt-5">
              <Button
                title="Acessar meus treinamentos"
                onClick={handleSeeTrainings}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
