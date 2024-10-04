import { Button } from "@/components/buttons/Button";
import { MdStar } from "react-icons/md";

interface TrainingFinishedWarningCardProps {
  onStartQuiz: () => void;
  content: string;
  buttonTitle: string;
}

export function TrainingFinishedWarningCard({
  onStartQuiz,
  content,
  buttonTitle,
}: TrainingFinishedWarningCardProps) {
  return (
    <div className="w-full flex flex-col bg-white dark:bg-slate-600  shadow-sm rounded-md p-4 mt-2">
      <div className="w-full flex ">
        <MdStar className="text-primary dark:text-primary-light mr-2 w-5 h-5" />
        <span className="mb-2 text-gray-800 dark:text-gray-200 text-[14px] md:text-[15px] text-pretty w-full font-bold">
          Treinamento concluído
        </span>
      </div>
      <span className="mb-2 text-gray-600 dark:text-gray-200 text-[12px] md:text-[14px] text-pretty w-full">
        {content}
      </span>
      <Button title={buttonTitle} onClick={onStartQuiz} />
    </div>
  );
}
