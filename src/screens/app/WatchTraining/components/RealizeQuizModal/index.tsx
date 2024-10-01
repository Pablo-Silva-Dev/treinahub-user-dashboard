import { Button } from "@/components/buttons/Button";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { KeyboardEvent, MouseEvent } from "react";
import Modal from "react-modal";

interface RealizeQuizModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  trainingName: string | null;
  totalQuestions: number;
  onClose: () => void;
  onStartQuiz: () => void;
}

export function RealizeQuizModal({
  isOpen,
  onRequestClose,
  onClose,
  onStartQuiz,
  trainingName,
  totalQuestions,
}: RealizeQuizModalProps) {
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
        content="Instruções para realização do questionário"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content="Você assistiu todas as aulas deste treinamento. Realize o questionário para emitir seu certificado."
        className="text-center text-black dark:text-white mb-4  text-[14px] md:text-[16px] max-w-[480px]  mx-auto"
      />
      <Subtitle
        content={`O questionário do ${trainingName} é composto por ${totalQuestions} questões.`}
        className="text-center text-black dark:text-white mb-4  text-[14px] md:text-[16px] max-w-[480px]  mx-auto"
      />
      <Subtitle
        content="Recomendamos que reserve alguns minutos para preencher o questionário sem interrupções."
        className="text-center text-black dark:text-white mb-4  text-[14px] md:text-[16px] max-w-[480px]  mx-auto"
      />
      <div className="w-full flex flex-col items-center">
        <div className="w-full mt-5">
          <Button title="Iniciar questionário" onClick={onStartQuiz} />
        </div>
        <button
          onClick={onClose}
          className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
        >
          Fechar
        </button>
      </div>
    </Modal>
  );
}
