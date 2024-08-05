import { collapseLongString } from "@/utils/formats";
import { FaArrowLeft } from "react-icons/fa";
import { MdPlayCircleOutline } from "react-icons/md";

interface PreviousClassCardProps {
  classTitle: string;
  classDuration: string;
  onSeeClass: () => void;
}

export function PreviousClassCard({
  classDuration,
  classTitle,
  onSeeClass,
}: PreviousClassCardProps) {
  const MAX_CLASS_TITLE_LENGTH = 40;

  return (
    <div className="w-full lg:w-[320px] p-2">
      <button onClick={onSeeClass} className=" flex flex-col">
        <div className="flex flex-row mb-2 justify-end">
          <FaArrowLeft className="w-6 h-6 mr-3 text-gray-800 dark:text-gray-100" />
          <span className="text-gray-800 dark:text-gray-100 text-[13px] md:text-[14px] font-bold">
            Aula anterior
          </span>
        </div>
        <div className="w-full flex flex-row p-4  bg-white dark:bg-slate-700  rounded-md">
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