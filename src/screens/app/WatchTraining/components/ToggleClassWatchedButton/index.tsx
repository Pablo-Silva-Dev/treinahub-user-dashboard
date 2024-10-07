import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

interface ToggleClassWatchedButtonProps {
  classWasWatched: boolean;
  onUnwatchClass: () => void;
  onWatchClass: () => void;
  disabled: boolean;
}

export function ToggleClassWatchedButton({
  classWasWatched,
  onUnwatchClass,
  onWatchClass,
  disabled,
}: ToggleClassWatchedButtonProps) {
  return (
    <>
      {classWasWatched ? (
        <button
          className="flex items-center p-2 md:p-4 bg-white dark:bg-slate-600 rounded-md disabled:opacity-[0.5]"
          onClick={onUnwatchClass}
          disabled={disabled}
        >
          <MdCheckBox className="h-6 w-6 md:h-7 md:w-7 text-green-400 mr-2" />
          <span className="w-full text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] leading-3 whitespace-nowrap">
            Marcar como não assistida
          </span>
        </button>
      ) : (
        <button
          className="flex items-center p-2 md:p-4 bg-white dark:bg-slate-600 rounded-md disabled:opacity-[0.5]"
          onClick={onWatchClass}
          disabled={disabled}
        >
          <MdCheckBoxOutlineBlank className="h-6 w-6 md:h-7 md:w-7 text-green-400 mr-2" />
          <span className="w-full text-gray-600 dark:text-gray-200 text-[11px] md:text-[12px] leading-3 whitespace-nowrap">
            Marcar como assistida
          </span>
        </button>
      )}
    </>
  );
}
