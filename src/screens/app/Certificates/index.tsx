import { ImageCardButton } from "@/components/miscellaneous/ImageCardButton";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { certificates } from "@/data/mocked";
import { CertificateCard } from "./components/CertificateCard";

export function Certificates() {
  const fileUrl =
    "https://pscodepscoursetrack.blob.core.windows.net/certificates/curso-de-react-pablo-santana-silva2-certificado.png";

  const handleDownloadCertificate = () => (window.location.href = fileUrl);

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8 md:pl-[80px]">
      <div className="mr-3 mb-4">
        <ScreenTitleIcon screenTitle="Certificados" iconName="star" />
        <Subtitle
          content="Certificados de conclusão de treinamentos disponíveis"
          className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
        />
      </div>

      {certificates.length > 0 ? (
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-[20px] sm:gap-[20px] md:gap-[40px]">
          {certificates.map((certificate) => (
            <CertificateCard
              key={certificate.courseName}
              coverUrl={fileUrl}
              courseName={certificate.courseName}
              emissionDate={certificate.emissionDate}
              totalCourseClasses={certificate.totalCourseClasses}
              totalWatchedClasses={certificate.totalWatchedClasses}
              onDownload={handleDownloadCertificate}
            />
          ))}
        </div>
      ) : (
        <div className="w-full flex flex-col">
          <span className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]">
            Acesse seus treinamentos
          </span>
          <ImageCardButton />
          <span className="mt-5 text-gray-600 dark:text-gray-300 text-sm md:text-[15px]">
            Você não possui nenhum treinamento em andamento no momento.
          </span>
        </div>
      )}
    </div>
  );
}
