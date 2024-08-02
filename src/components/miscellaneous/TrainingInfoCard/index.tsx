import { collapseLongString } from "@/utils/formats";
import Feather from "feather-icons-react";
import { useState } from "react";
import { Collapse } from "react-collapse";

interface TrainingInfoCardProps {
  training: string;
  description: string;
  cover_url: string;
  lastClassName: string;
  lastClassDuration: string;
  totalCourseClasses: number;
  totalWatchedClasses: number;
  onSeeTraining: () => void;
}

export function TrainingInfoCard({
  cover_url,
  training,
  description,
  lastClassName,
  lastClassDuration,
  totalCourseClasses,
  totalWatchedClasses,
  onSeeTraining,
}: TrainingInfoCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const descriptionCollapsedLength = description.length / 2;

  return (
    <div className="w-full sm:w-[320px] lg:w-[400px] flex flex-col shadow-sm bg-white dark:bg-slate-900 rounded-md mr-0 md:mr-8">
      <img
        src={cover_url}
        alt="info_card_placeholder"
        className="w-full aspect-auto"
      />
      <div className="w-full p-4 flex flex-col ">
        <span className="text-gray-800 dark:text-gray-50 text-sm md:text-lg font-bold font-secondary mb-1">
          {training}
        </span>
        <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
          {isCollapsed &&
            collapseLongString(description, descriptionCollapsedLength)}
        </span>
        <Collapse isOpened={!isCollapsed}>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {description}
          </span>
        </Collapse>
        <div className="w-full flex-row justify-start">
          {isCollapsed ? (
            <button
              className="font-bold text-gray-800 dark:text-gray-50 mt-2 text-[11px] lg:text-sm"
              onClick={() => setIsCollapsed(false)}
            >
              Mostrar mais
            </button>
          ) : (
            <button
              className=" font-bold text-gray-800 dark:text-gray-50 mt-2 text-[11px] lg:text-sm"
              onClick={() => setIsCollapsed(true)}
            >
              Mostrar menos
            </button>
          )}
        </div>
        <div className="w-full h-[1px] bg-gray-200 dark:bg-slate-600 mt-2 mb-4" />
        <div className="flex w-full flex-row mb-2 items-center justify-between">
          <div className="flex flex-row items-center">
            <Feather
              icon="play-circle"
              className="mr-2 dark:text-white text-gray-800"
            />
            <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
              {lastClassName}
            </span>
          </div>
          <div className="flex flex-row">
            <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
              Duração:
            </span>
            <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
              {lastClassDuration}
            </span>
          </div>
        </div>
        <div className="flex flex-row mb-3 ml-1">
          <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
            {totalWatchedClasses} de
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
            {totalCourseClasses} aulas assistidas
          </span>
        </div>
        <div className="flex flex-row justify-between items-center">
          <button
            className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 p-2 rounded-md"
            onClick={onSeeTraining}
          >
            Continuar aula
          </button>
        </div>
      </div>
    </div>
  );
}
