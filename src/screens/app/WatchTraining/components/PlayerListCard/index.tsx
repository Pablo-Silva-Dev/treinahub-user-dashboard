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

export function PlayerListCard({ classes }: PlayerListCardProps) {
  return (
    <div className="w-full lg:w-[40%] xl:w-[40%] flex flex-col bg-white p-4 dark:bg-slate-900 rounded-md shadow-md">
      <h3 className="text-gray-800 dark:text-gray-50 text-[13px] md:text-[14px] font-bold mb-3 text-left">
        Conteúdo
      </h3>
      {classes.map((c) =>
        c.wasWatched ? (
          <button className="w-full flex flex-row py-2 px-4 bg-gray-200 dark:bg-slate-800 items-center rounded-md  mb-3">
            <div className="flex flex-col">
              <div className="flex flex-row items-center mb-1">
                <MdReplay className="h-5 w-5 md:h-6 md:w-6 text-gray-800 dark:text-gray-200 mr-2" />
                <span className="text-gray-600 dark:text-gray-200 text-[13px] md:text-[14px] font-bold mr-3 text-left">
                  {c.name}
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
            <div className="flex flex-1 justify-end">
              <TbEyeCheck className="h-5 w-5 md:h-6 md:w-6 text-green-400" />
            </div>
          </button>
        ) : (
          <div className="w-full flex flex-row py-2 px-4 bg-gray-100 dark:bg-slate-700 items-center rounded-md  mb-3">
            <button className="flex flex-col">
              <div className="flex flex-row items-center mb-1">
                <MdPlayCircleOutline className="h-5 w-5 md:h-6 md:w-6 text-gray-800 dark:text-gray-200 mr-2" />
                <span className="text-gray-600 dark:text-gray-200 text-[13px] md:text-[14px] font-bold mr-3 text-left">
                  {c.name}
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
            </button>
          </div>
        )
      )}
    </div>
  );
}
