import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { MdDownload } from "react-icons/md";

interface CertificateCardProps {
  onDownload: (param: any) => void;
  courseName: string;
  coverUrl: string;
  emissionDate: string;
}

export function CertificateCard({
  onDownload,
  courseName,
  coverUrl,
  emissionDate,
}: CertificateCardProps) {
  return (
    <div className="w-full p-5 bg-white dark:bg-slate-900 flex flex-col rounded-md">
      <Title
        content={courseName}
        className="text-black dark:text-white font-bold text-[12px] md:text-[14px]"
      />
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
    </div>
  );
}
