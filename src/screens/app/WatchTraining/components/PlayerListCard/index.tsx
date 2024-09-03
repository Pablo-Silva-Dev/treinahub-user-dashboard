import { collapseLongString } from "@/utils/formats";
import { MdPlayCircleOutline, MdReplay } from "react-icons/md";
import { TbEyeCheck } from "react-icons/tb";

interface IClass {
  name: string;
  duration: string;
  url?: string;
  wasWatched?: boolean;
}

interface PlayerListCardProps {
  classes: IClass[];
}
//TODO-pablo: add button to remove a watched video class and update training metrics at once
export function PlayerListCard({ classes }: PlayerListCardProps) {
  const MAX_CLASS_TITLE_LENGTH = 32;

  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-900 p-4 rounded-md shadow-md h-[400px] md:h-[480px] xl:h-[580px] overflow-y-auto">
      <h3 className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold mb-3 text-left">
        Conteúdo
      </h3>
      {classes.map((c) => (
        <button
          key={c.name}
          className={`w-full flex flex-row py-2 px-4 ${
            c.wasWatched
              ? "bg-gray-200 dark:bg-slate-800"
              : "bg-gray-100 dark:bg-slate-700"
          } items-center rounded-md mb-3`}
        >
          <div className="flex flex-col">
            {c.wasWatched ? (
              <MdReplay className="h-5 w-5 md:h-6 md:w-6 text-gray-800 dark:text-gray-200 mr-1 mb-2" />
            ) : (
              <MdPlayCircleOutline className="h-5 w-5 md:h-6 md:w-6 text-gray-800 dark:text-gray-200 mr-1 mb-2" />
            )}
            <div className="flex flex-row items-center mb-1">
              <span className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[12.5px] font-bold mr-3 text-left">
                <span className="block sm:hidden">
                  {collapseLongString(c.name, MAX_CLASS_TITLE_LENGTH)}
                </span>
                <span className="hidden sm:block">{c.name}</span>
              </span>
            </div>
            <div className="flex flex-row">
              <span className="text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] font-bold mr-3 text-left">
                Duração:{" "}
              </span>
              <span className="text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] font-bold mr-3 text-left">
                {c.duration}{" "}
              </span>
            </div>
          </div>
          {c.wasWatched && (
            <div className="flex flex-1 justify-end">
              <TbEyeCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
            </div>
          )}
        </button>
      ))}
    </div>
  );
}
