import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import ProgressBar from "@ramonak/react-progress-bar";
import Feather from "feather-icons-react";

interface TrainingInfoCardProps {
  training: string;
  trainingId: string;
  description: string;
  cover_url: string;
  lastClassName: string | null;
  lastClassDuration: string | null;
  totalCourseClasses: number;
  totalWatchedClasses: number;
  onSeeTraining: () => void;
  onSeeCertificate?: () => void;
  onStartTraining?: () => void;
  userStartedTraining: boolean;
  watchedClasses: IWatchedClassDTO[];
  showSeeCertificateButton: boolean;
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
  onSeeCertificate,
  onStartTraining,
  userStartedTraining,
  watchedClasses,
  showSeeCertificateButton,
  trainingId,
}: TrainingInfoCardProps) {
  const totalCourseProgressPercentage =
    totalWatchedClasses > 0
      ? Number(Number(totalWatchedClasses / totalCourseClasses) * 100).toFixed(
          0
        )
      : 0;

  const userHasCompletelyWatchedAllClasses = watchedClasses
    .filter((wc) => wc.training_id === trainingId)
    .every((wc) => wc.completely_watched);

  return (
    <div className="w-full md:max-w-[320px] flex flex-col shadow-sm bg-white dark:bg-slate-700 rounded-md mr-0 md:mr-8">
      <img
        src={cover_url}
        alt="info_card_placeholder"
        className="w-full h-[140px] object-cover rounded-t-md"
      />
      <div className="w-full p-4 flex flex-col ">
        <span className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold font-secondary mb-1">
          {training}
        </span>
        <div className="w-full max-h-[64px] overflow-y-auto overflow-x-hidden">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {description}
          </span>
        </div>

        <div className="w-full h-[1px] bg-gray-200 dark:bg-slate-600 mt-3 mb-2" />
        {totalWatchedClasses === 0 && !userStartedTraining ? (
          <div className="flex flex-col w-full">
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
                onClick={onStartTraining}
              >
                Iniciar treinamento
              </button>
            </div>
          </div>
        ) : totalWatchedClasses < totalCourseClasses ||
          !userHasCompletelyWatchedAllClasses ? (
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
              Assistir aula
            </span>
            <button
              className="w-full flex flex-col p-3 rounded-md  bg-gray-100 dark:bg-slate-600 mb-3"
              onClick={onSeeTraining}
            >
              <div className="flex flex-row items-center justify-start mb-1">
                <Feather
                  icon="play-circle"
                  className="mr-2 dark:text-white text-gray-800"
                  strokeWidth={1}
                />
                <span className="text-gray-800 dark:text-gray-50 text-[11px]  lg:text-[12px] font-primary text-pretty  text-left">
                  {lastClassName}
                </span>
              </div>
              {lastClassDuration && (
                <div className="flex flex-row mt-1">
                  <span className="text-gray-800 dark:text-gray-50 text-[9px] lg:text-[10px] font-primary mr-1">
                    Duração:
                  </span>
                  <span className="text-gray-800 dark:text-gray-50 text-[9px] lg:text-[10px] font-primary text-pretty">
                    {lastClassDuration}
                  </span>
                </div>
              )}
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
            <div className="flex flex-row">
              {showSeeCertificateButton && (
                <button
                  className=" bg-gray-100 dark:bg-slate-600 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 rounded-md w-full p-2 mr-4"
                  onClick={onSeeCertificate}
                >
                  Ver certificado
                </button>
              )}
              <button
                className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 rounded-md w-full p-2"
                onClick={onSeeTraining}
              >
                Rever treinamento
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
