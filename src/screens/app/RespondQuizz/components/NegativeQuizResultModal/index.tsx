import { Button } from "@/components/buttons/Button";
import { LinkButton } from "@/components/buttons/LinkButton";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { KeyboardEvent, MouseEvent } from "react";
import Modal from "react-modal";

interface NegativeQuizResultModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  trainingName: string | null;
  totalQuestions: number;
  totalCorrectQuestions: number;
  onCheckQuizResponses: () => void;
  onRetryQuiz: () => void;
}

export function NegativeQuizResultModal({
  isOpen,
  onRequestClose,
  onCheckQuizResponses,
  onRetryQuiz,
  trainingName,
  totalQuestions,
  totalCorrectQuestions,
}: NegativeQuizResultModalProps) {
  const { theme } = useThemeStore();

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Número de acertos insufisciente"
        className="text-center text-black dark:text-white mb-5 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content={`Infelizmente você não acertou o número mínimo de questões para liberar a emissão do certificado para o treinamento ${trainingName}.`}
        className="text-black dark:text-white mb-4  text-[12px] md:text-[14px] max-w-[480px]"
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
    </Modal>
  );
}
