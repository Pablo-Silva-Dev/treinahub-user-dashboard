import { collapseLongString } from "@/utils/formats";
import ProgressBar from "@ramonak/react-progress-bar";
import Feather from "feather-icons-react";
import { useState } from "react";
import { Collapse } from "react-collapse";

interface TrainingInfoCardProps {
  training: string;
  description: string;
  cover_url: string;
  totalTrainingDuration: string;
  lastClassName: string | null;
  lastClassDuration: string | null;
  totalCourseClasses: number;
  totalWatchedClasses: number;
  onSeeTraining: () => void;
  onSeeCertificate?: () => void;
  onStartTraining?: () => void;
  userStartedTraining: boolean;
}

export function TrainingInfoCard({
  cover_url,
  training,
  description,
  totalTrainingDuration,
  lastClassName,
  lastClassDuration,
  totalCourseClasses,
  totalWatchedClasses,
  onSeeTraining,
  onSeeCertificate,
  onStartTraining,
  userStartedTraining,
}: TrainingInfoCardProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  const descriptionCollapsedLength = description.length / 2;

  const totalCourseProgressPercentage =
    totalWatchedClasses > 0
      ? Number(Number(totalWatchedClasses / totalCourseClasses) * 100).toFixed(
          0
        )
      : 0;

  return (
    <div className="w-full max-w-[480px] flex flex-col shadow-sm bg-white dark:bg-slate-700 rounded-md mr-0 md:mr-8">
      <img
        src={cover_url}
        alt="info_card_placeholder"
        className="w-full aspect-auto"
      />
      <div className="w-full p-4 flex flex-col ">
        <span className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold font-secondary mb-1">
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
        <div className="w-full h-[1px] bg-gray-200 dark:bg-slate-600 mt-2 mb-2" />
        {totalWatchedClasses === 0 && !userStartedTraining ? (
          <div className="flex flex-col w-full">
            <div className="flex flex-row mb-1 ml-1">
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1 mb-2">
                Duração do treinamento:
              </span>
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1 mb-2">
                {totalTrainingDuration}
              </span>
            </div>
            <div className="flex flex-row mb-3 ml-1">
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalWatchedClasses} de
              </span>
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalCourseClasses} aulas assistidas
              </span>
            </div>
            <div className="w-full">
              <button
                className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 p-2 rounded-md"
                //TODO-PABLO: Navigate to specific training video classes after creating new training metrics
                onClick={onStartTraining}
              >
                Iniciar treinamento
              </button>
            </div>
          </div>
        ) : totalWatchedClasses < totalCourseClasses ? (
          <div className="w-full flex flex-col">
            <div className="flex flex-row mb-3 ml-1 items-evenly">
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalWatchedClasses} de
              </span>
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalCourseClasses} aulas assistidas
              </span>
            </div>

            <div className="flex flex-row mb-3 ml-[-12px] items-center">
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
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[11px] font-primary text-pretty ml-2">
                {totalCourseProgressPercentage}% concluído
              </span>
            </div>
            <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary mb-2">
              Assitir aula
            </span>
            <button
              className="w-full flex flex-col p-3 rounded-md  bg-gray-100 dark:bg-slate-600 mb-3"
              //TODO-PABLO: Navigate to specific training video class ready to be played
              onClick={onSeeTraining}
            >
              <div className="flex flex-row items-center mb-1">
                <Feather
                  icon="play-circle"
                  className="mr-2 dark:text-white text-gray-800"
                />
                <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
                  {lastClassName}
                </span>
              </div>
              <div className="flex flex-row mt-1">
                <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                  Duração:
                </span>
                <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty">
                  {lastClassDuration}
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex flex-row mb-3 ml-1 items-center">
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalWatchedClasses} de
              </span>
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary mr-1">
                {totalCourseClasses} aulas assistidas
              </span>
            </div>

            <div className="flex flex-row mb-3 ml-[-12px] items-center">
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
              <span className="text-gray-800 dark:text-gray-50 text-[10px] lg:text-[12px] font-primary text-pretty ml-2">
                {totalCourseProgressPercentage}% concluído
              </span>
            </div>

            <div className="flex flex-row items-center mb-4">
              <Feather icon="star" className="mr-2 text-orange-300" />
              <span className="text-gray-800 dark:text-gray-50 text-[12px] lg:text-[14px] font-primary text-pretty">
                Treinamento concluído!
              </span>
            </div>
            <button
              className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 rounded-md w-full p-4"
              //TODO-Pablo open specific certificate modal on Training screen
              onClick={onSeeCertificate}
            >
              Ver certificado
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
