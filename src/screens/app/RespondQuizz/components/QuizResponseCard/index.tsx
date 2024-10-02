import { IQuestionOptionDTO } from "@/repositories/dtos/QuestionOptionDTO";

interface QuizResponseCardProps {
  question: string;
  questionId: string;
  options: IQuestionOptionDTO[];
  selectedOptionId?: string;
  onSelectOption: (optionId: string) => void;
}

export function QuizResponseCard({
  question,
  options,
  questionId,
  selectedOptionId,
  onSelectOption,
}: QuizResponseCardProps) {
  return (
    <div className="w-full p-5 flex flex-col rounded-md">
      <h1 className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
        {question}
      </h1>
      {options.map((option) => (
        <div className="flex items-center mb-2" key={option.id}>
          <input
            type="radio"
            id={`option-${option.id}`}
            name={`quiz-option-${questionId}`}
            value={option.id}
            checked={selectedOptionId === option.id}
            onChange={() => onSelectOption(option.id)}
            className="mr-2 w-3 h-3 md:w-4 md:h-4"
            color="blue"
          />
          <label
            htmlFor={`option-${option.id}`}
            className="text-gray-700 dark:text-gray-300 text-[11px] md:text-[14px]"
          >
            {option.content}
          </label>
        </div>
      ))}
    </div>
  );
}
