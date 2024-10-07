import { IVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { collapseLongString, secondsToFullTimeString } from "@/utils/formats";
import { MdPlayCircleOutline, MdReplay } from "react-icons/md";

interface PlayerListCardProps {
  classes: IVideoClassDTO[];
  watchedClasses: IWatchedClassDTO[];
  onSelectClass: (classId: string) => void;
  selectedVideoClassId: string | null;
}

export function PlayerListCard({
  classes,
  watchedClasses,
  onSelectClass,
  selectedVideoClassId
}: PlayerListCardProps) {
  const MAX_CLASS_TITLE_LENGTH = 32;

  const wasVideoClassesWatched = (videoClassId: string) =>
    watchedClasses.some(
      (wc) => wc.videoclass_id === videoClassId && wc.completely_watched
    );

  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-600 p-4 rounded-md shadow-md h-[400px] md:h-[480px] xl:h-[580px] overflow-y-auto cursor-pointer">
      <h3 className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold mb-3 text-left">
        Conteúdo
      </h3>
      {classes.map((c) => (
        <div
          key={c.name}
          className={`w-full flex flex-row justify-between  ${
            wasVideoClassesWatched(c.id)
              ? "bg-gray-200 dark:bg-slate-800 px-3 py-4"
              : "bg-gray-100 dark:bg-slate-700 p-5"
          } 
          ${selectedVideoClassId === c.id && 'border-2 border-primary-light'}
          items-center rounded-md mb-3`}
        >
          <div
            className="flex items-center w-full  mr-3"
            onClick={() => onSelectClass(c.id)}
          >
            {wasVideoClassesWatched(c.id) ? (
              <MdReplay className="h-6 w-6 md:h-7 md:w-7 text-gray-800 dark:text-gray-200 mr-1 mb-2" />
            ) : (
              <MdPlayCircleOutline className="h-6 w-6 md:h-7 md:w-7 text-gray-800 dark:text-gray-200 mr-1 mb-2" />
            )}
            <div className="flex flex-col ml-2">
              <div className="flex flex-row items-center mb-1">
                <span className="text-gray-600 dark:text-gray-200 text-[10px] md:text-[12.5px] font-bold mr-3 text-left">
                  <span className="block sm:hidden">
                    {collapseLongString(c.name, MAX_CLASS_TITLE_LENGTH)}
                  </span>
                  <span className="hidden sm:block">{c.name}</span>
                </span>
              </div>
              <div className="flex flex-row">
                <span className="text-gray-600 dark:text-gray-200 text-[10px] md:text-[12px] font-bold mr-3 text-left">
                  Duração:{" "}
                </span>
                <span className="text-gray-600 dark:text-gray-200 text-[10px] md:text-[12px] font-bold mr-3 text-left">
                  {secondsToFullTimeString(c.duration)}{" "}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
