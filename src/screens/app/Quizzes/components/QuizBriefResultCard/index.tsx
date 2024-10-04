import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";

interface QuizBriefResultCardProps {
  trainingName: string;
  totalQuestions: number;
  totalCorrectQuestions: number;
  onSelectQuiz: () => void;
  onRetryQuiz: () => void;
  onSeeQuizResult: () => void;
}

export function QuizBriefResultCard({
  trainingName,
  totalCorrectQuestions,
  totalQuestions,
  onRetryQuiz,
  onSeeQuizResult,
  onSelectQuiz,
}: QuizBriefResultCardProps) {
  return (
    <div
      className="w-full  p-4 bg-white dark:bg-slate-700 flex flex-col md:flex-row justify-between rounded-md"
      onMouseEnter={onSelectQuiz}
    >
      <div className="flex flex-col md:flex-row items-center mb-4 md:mb-1">
        <Title
          content={`Questionário do treinamento ${trainingName}`}
          className="text-black dark:text-white font-bold text-[12px] md:text-[14px] mr-3"
        />
        <Subtitle
          content={`${totalCorrectQuestions} de ${totalQuestions} perguntas respondidas corretamente.`}
          className="text-gray-800 dark:text-gray-200  text-[12px] md:text-[14px]"
        />
      </div>
      <div className="flex flex-row items-center">
        <div className="flex flex-row">
          <button
            className=" flex flex-row justify-center  items-center border-2 border-gray-800 dark:border-gray-200 p-1 px-3 rounded-md text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 mt-2 mr-3"
            onClick={onSeeQuizResult}
          >
            Visualizar
          </button>
          <button
            className=" flex flex-row justify-center  items-center border-2 border-gray-800 dark:border-gray-200 p-1 px-3 rounded-md text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 mt-2"
            onClick={onRetryQuiz}
          >
            Refazer
          </button>
        </div>
      </div>
    </div>
  );
}
