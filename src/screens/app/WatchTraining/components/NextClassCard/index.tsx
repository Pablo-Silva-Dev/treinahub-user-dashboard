import { collapseLongString } from "@/utils/formats";
import { FaArrowRight } from "react-icons/fa";
import { MdPlayCircleOutline } from "react-icons/md";

interface NextClassCardProps {
  classTitle: string;
  classDuration: string;
  onSeeClass: () => void;
}

export function NextClassCard({
  classDuration,
  classTitle,
  onSeeClass,
}: NextClassCardProps) {
  const MAX_CLASS_TITLE_LENGTH = 40;

  return (
    <div className="w-full lg:w-[400px] p-2">
      <button onClick={onSeeClass} className="w-full flex flex-col">
        <div className="flex flex-row mb-2 md:justify-end w-full">
          <span className="text-gray-800 dark:text-gray-100 text-[13px] md:text-[14px] font-bold">
            Próxima aula
          </span>
          <FaArrowRight className="w-6 h-6 ml-3 text-gray-800 dark:text-gray-100" />
        </div>
        <div className="w-full flex flex-col p-4  bg-white dark:bg-slate-700 rounded-md">
          <div className="flex flex-col">
            <MdPlayCircleOutline className="h-5 w-5 md:h-8 md:w-8 text-gray-800 dark:text-gray-200 mb-2" />
            <span className="text-gray-600 dark:text-gray-200 text-[13px] md:text-[14px] font-bold mr-3 text-left">
              {collapseLongString(classTitle, MAX_CLASS_TITLE_LENGTH)}
            </span>
          </div>
          <div className="flex flex-row">
            <span className="text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] font-bold mr-3 text-left">
              Duração:{" "}
            </span>
            <span className="text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] font-bold mr-3 text-left">
              {classDuration}
            </span>
          </div>
        </div>
      </button>
    </div>
  );
}
