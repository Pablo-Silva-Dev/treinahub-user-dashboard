import { collapseLongString } from "@/utils/formats";
import { FaArrowLeft } from "react-icons/fa";

interface PreviousClassCardProps {
  classTitle: string;
  classDuration: string;
  onSeeClass: () => void;
  showsPreviousClassButton: boolean;
}

export function PreviousClassCard({
  classDuration,
  classTitle,
  onSeeClass,
  showsPreviousClassButton,
}: PreviousClassCardProps) {
  const MAX_CLASS_TITLE_LENGTH = 24;

  return (
    <div
      className="w-full lg:w-[400px] p-2"
      style={{ opacity: showsPreviousClassButton ? 1 : 0.5 }}
    >
      <button
        onClick={onSeeClass}
        className="w-full flex flex-col"
        disabled={!showsPreviousClassButton}
      >
        <div className="flex flex-row mb-2 justify-end">
          <FaArrowLeft className="w-6 h-6 mr-3 text-gray-800 dark:text-gray-100" />
          <span className="text-gray-800 dark:text-gray-100 text-[13px] md:text-[14px] font-bold">
            Aula anterior
          </span>
        </div>
        {showsPreviousClassButton && (
               <div className="w-full flex flex-col p-4 bg-white dark:bg-slate-700  rounded-md">
               <div className="flex flex-col  w-full ">
                 <span className="text-gray-600 dark:text-gray-200 text-[11px] md:text-[14px] font-bold text-left">
                   {collapseLongString(classTitle, MAX_CLASS_TITLE_LENGTH)}
                 </span>
               </div>
               <div className="flex flex-row w-full">
                 <span className="text-gray-600 dark:text-gray-200 text-[9px] md:text-[11px] font-bold mr-1 text-left">
                   Duração:{" "}
                 </span>
                 <span className="text-gray-600 dark:text-gray-200 text-[9px] md:text-[11px]  text-left">
                   {classDuration}
                 </span>
               </div>
             </div>
        )}
      </button>
    </div>
  );
}
