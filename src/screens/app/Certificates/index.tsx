import empty_box_animation from "@/assets/empty_box_animation.json";
import { Button } from "@/components/buttons/Button";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ICertificateDTO } from "@/repositories/dtos/CertificateDTO";
import { useAuthenticationStore } from "@/store/auth";
import { showAlertSuccess } from "@/utils/alerts";
import { formatDate } from "@/utils/formats";
import { useCallback, useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { CertificateCard } from "./components/CertificateCard";

export function Certificates() {
  const [certificates, setCertificates] = useState<ICertificateDTO[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ICertificateDTO | null>(null);

  const { user } = useAuthenticationStore();

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const getUserCertificates = useCallback(async () => {
    try {
      const certificates = await certificatesRepository.listCertificatesByUser(
        user.id
      );
      setCertificates(certificates);
      console.log(certificates);
    } catch (error) {
      console.log(error);
    }
  }, [certificatesRepository, user.id]);

  useEffect(() => {
    getUserCertificates();
  }, [getUserCertificates]);

  const handleDownloadCertificate = () => {
    if (selectedCertificate) {
      window.location.href = selectedCertificate.url;
      showAlertSuccess(
        "O download do seu certificate foir realizado com sucesso!"
      );
    }
  };

  const animationOptions = {
    animationData: empty_box_animation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
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
              onDownload={handleDownloadCertificate}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col items-start relative max-w-[480px]">
            <Lottie
              speed={0.25}
              height={200}
              width={200}
              options={animationOptions}
            />
            <span className="mt-3 text-gray-600 dark:text-gray-300 text-sm md:text-[15px] text-center">
              Você ainda não concluiu nenhum treinamento. Seus certificados
              estarão disponíveis a medida que os treinamentos forem concluídos.
            </span>
            <div className="w-full mt-5">
              <Button title="Acessar meus treinamentos" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
