import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/miscellaneous/Loading";
import { TPlan } from "@/repositories/dtos/CompanyDTO";
import { FaWandMagicSparkles } from "react-icons/fa6";

interface QuizResultCardProps {
  question: string;
  questionId: string;
  requestedAiQuestions: string[];
  selectedOptionContent: string;
  correctOptionContent: string;
  onRequestAiExplanation: () => void;
  companyPlan: TPlan;
  isLoading?: boolean;
  aiExplanation?: string;
}

export function QuizResultCard({
  question,
  selectedOptionContent,
  correctOptionContent,
  questionId,
  requestedAiQuestions,
  onRequestAiExplanation,
  companyPlan,
  isLoading,
  aiExplanation,
}: QuizResultCardProps) {
  return (
    <div
      id={questionId}
      className="w-full p-5 flex flex-col rounded-md bg-gray-50 dark:bg-slate-700 shadow-md mb-4"
    >
      <h1 className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
        {`Questão: ${question}`}
      </h1>
      <span className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
        {`Você respondeu: "${selectedOptionContent}"`}
      </span>
      <span className="text-green-400 text-[12px] md:text-[15px] font-bold mb-3">
        {`Resposta correta: "${correctOptionContent}"`}
      </span>
      {isLoading ? (
        <div className="w-full my-8">
          <Loading type="cylon" color="#0267FF" text="Gerando explicação da IA..."/>
        </div>
      ) : aiExplanation && requestedAiQuestions.includes(questionId) ? (
        <span className="text-gray-600 dark:text-gray-200 text-[12px] md:text-[15px] font-bold mb-3">
          {`Explicação da IA: "${aiExplanation}"`}
        </span>
      ) : (
        <div className="w-full flex justify-end">
          {companyPlan && !companyPlan.includes("bronze") && (
            <Button
              title="Solicitar explicação da IA"
              className="w-full md:w-60 h-[52px] flex items-center justify-center bg-gradient-to-r from-[#4e5081] to-[#0000FF] normal-case text-[12px] md:text-md  font-medium font-poppins rounded-lg disabled:opacity-[0.5] text-gray-50 font-secondary"
              icon={<FaWandMagicSparkles className="ml-4 text-white" />}
              onClick={onRequestAiExplanation}
              isLoading={isLoading}
              disabled={isLoading}
            />
          )}
        </div>
      )}
    </div>
  );
}
