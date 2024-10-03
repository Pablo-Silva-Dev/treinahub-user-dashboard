interface QuizResultCardProps {
  question: string;
  questionId: string;
  selectedOptionContent: string;
  correctOptionContent: string;
}

export function QuizResultCard({
  question,
  selectedOptionContent,
  correctOptionContent,
}: QuizResultCardProps) {
  return (
    <div className="w-full p-5 flex flex-col rounded-md">
      <h1 className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
        {`Questão: ${question}`}
      </h1>
      <span className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
        {`Você respondeu: "${selectedOptionContent}"`}
      </span>
      <span className="text-green-400 text-[12px] md:text-[15px] font-bold mb-3">
        {`Resposta correta: "${correctOptionContent}"`}
      </span>
    </div>
  );
}
