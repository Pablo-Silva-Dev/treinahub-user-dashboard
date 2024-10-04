import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";

interface NegativeQuizResultContentProps {
  trainingName: string | null;
  totalQuestions: number;
  totalCorrectQuestions: number;
  onCheckQuizResponses: () => void;
  onRetryQuiz: () => void;
}

export function NegativeQuizResultContent({
  onCheckQuizResponses,
  onRetryQuiz,
  trainingName,
  totalQuestions,
  totalCorrectQuestions,
}: NegativeQuizResultContentProps) {
  return (
    <div className="w-full flex flex-col">
      <Title
        content="Número de acertos insufisciente"
        className="text-center text-black dark:text-white mb-5 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content={`Infelizmente você não acertou o número mínimo de questões para liberar a emissão do certificado para o treinamento ${trainingName}.`}
        className="text-black dark:text-white mb-4  text-[12px] md:text-[14px]"
      />
      {totalQuestions && (
        <Subtitle
          content={`Você acertou ${totalCorrectQuestions} de ${totalQuestions} questões.`}
          className="text-black dark:text-white mb-4  text-[12px] md:text-[14px] max-w-[480px]"
        />
      )}
      <div className="w-full mb-4">
        <LinkButton
          title="Clique aqui para conferir suas respostas"
          onClick={onCheckQuizResponses}
        />
      </div>
      <div className="w-full mt-5">
        <Button title="Refazer questionário" onClick={onRetryQuiz} />
      </div>
    </div>
  );
}
