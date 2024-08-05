import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import ProgressBar from "@ramonak/react-progress-bar";
import { MdDownload, MdInfo } from "react-icons/md";

interface CertificateCardProps {
  onDownload: (param: any) => void;
  courseName: string;
  coverUrl: string;
  emissionDate: string;
  totalWatchedClasses: number;
  totalCourseClasses: number;
}

export function CertificateCard({
  onDownload,
  courseName,
  coverUrl,
  emissionDate,
  totalCourseClasses,
  totalWatchedClasses,
}: CertificateCardProps) {
  const totalCourseProgressPercentage =
    totalWatchedClasses > 0
      ? parseInt(
          Number(
            Number(totalWatchedClasses / totalCourseClasses) * 100
          ).toFixed(0)
        )
      : 0;

  return (
    <div className="w-full  p-5 bg-white dark:bg-slate-900 flex flex-col rounded-md">
      <Title
        content={courseName}
        className="text-black dark:text-white font-bold text-[12px] md:text-[14px]"
      />
      {totalCourseProgressPercentage >= 100 ? (
        <>
          <div className="flex flex-row w-full my-4">
            <img
              src={coverUrl}
              width={600}
              height={300}
              alt="certifado_de_conclusao"
            />
          </div>
          <div className="flex flex-col w-full">
            <Subtitle
              content={`Emitido em ${emissionDate}`}
              className="text-gray-700 dark:text-gray-100  text-[11px] md:text-[12px]"
            />
            <button
              className=" flex flex-row justify-center  items-center border-2 border-gray-800 p-3 rounded-md text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 mt-2"
              onClick={onDownload}
            >
              <MdDownload className="w-4 h-4 mr-2" />
              Baixar certificado
            </button>
          </div>
        </>
      ) : (
        <div className="w-full flex flex-col">
          <div className="flex flex-row my-3 ml-[-12px] items-center">
            <ProgressBar
              completed={totalCourseProgressPercentage}
              maxCompleted={100}
              height="8px"
              labelSize="0px"
              width="80px"
              borderRadius="2px"
              bgColor="#0267FF"
              className="ml-4"
            />
            <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-[12px] font-primary text-pretty ml-2">
              {totalCourseProgressPercentage}% concluído
            </span>
          </div>
          <div className="flex flex-row mb-3 ml-1">
            <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
              {totalWatchedClasses} de
            </span>
            <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
              {totalCourseClasses} aulas assistidas
            </span>
          </div>
          <span className="text-gray-800 dark:text-gray-50 text-[12px] lg:text-[14px] mt-8">
            Seu certificado estará disponível assim que 100% das aulas forem
            assistidas.
          </span>
          <div className="w-full flex flex-col p-4 bg-blue-400 rounded-md my-4 opacity-[.8]">
            <MdInfo className="w-6 h-6 md:w-8 md:h-8 text-white mb-2" />
            <span className="text-gray-50 text-[12px] lg:text-[14px] mb-8">
              Complete seu treinamento para liberar seu certificado.
            </span>
          </div>
          <button
            className=" flex flex-row justify-center  items-center border-2 border-gray-800 p-3 rounded-md text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 mt-2 opacity-[0.5]"
            disabled
          >
            <MdDownload className="w-4 h-4 mr-2" />
            Baixar certificado
          </button>
        </div>
      )}
    </div>
  );
}
