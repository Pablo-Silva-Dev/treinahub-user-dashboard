import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { secondsToFullTimeString } from "@/utils/formats";
import Feather from "feather-icons-react";

interface ReturnLastClassCardProps {
  handleContinueLastClass: (training_id: string, videoclass_id: string) => void;
  lastWatchedClassInfo: IWatchedClassDTO;
  trainingName: string;
}

export function ReturnLastClassCard({
  handleContinueLastClass,
  lastWatchedClassInfo,
  trainingName,
}: ReturnLastClassCardProps) {
  return (
    <div
      className="flex flex-col bg-white dark:bg-slate-700 rounded-lg p-4 shadow-sm cursor-pointer"
      onClick={() =>
        handleContinueLastClass(
          lastWatchedClassInfo.training_id,
          lastWatchedClassInfo.videoclass_id
        )
      }
    >
      <div className="flex items-center">
        <Feather
          icon="play-circle"
          className="mr-2 text-primary w-10 h-10"
          strokeWidth={1}
        />
        {lastWatchedClassInfo.videoclass && (
          <div className="flex flex-col w-full">
            <span className="text-gray-800 dark:text-gray-50 text-[.8rem] md:text-[.85rem] font-bold">
              {trainingName}
            </span>
            <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between">
              <span className="text-gray-600 dark:text-gray-300 text-[.8rem] md:text-[.85rem]">
                {lastWatchedClassInfo.videoclass.name}
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-[.7rem] md:text-[.75rem] mt-2 md:mt-0">
                {secondsToFullTimeString(
                  lastWatchedClassInfo.videoclass.duration
                )}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
