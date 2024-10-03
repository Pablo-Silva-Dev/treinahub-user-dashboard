import congratulations_animation from "@/assets/congratulations_animation.json";
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
import Lottie from "react-lottie";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

interface PositiveQuizResultModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  trainingName: string | null;
  totalQuestions: number;
  totalCorrectQuestions: number;
  onCheckQuizResponses: () => void;
}

export function PositiveQuizResultModal({
  isOpen,
  onRequestClose,
  onCheckQuizResponses,
  trainingName,
  totalQuestions,
  totalCorrectQuestions,
}: PositiveQuizResultModalProps) {
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const animationOptions = {
    animationData: congratulations_animation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleSeeCertificates = () =>
    navigate("/dashboard/acessar-meus-certificados");

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Treinamento concluído com sucesso"
        className="text-center text-black dark:text-white mb-5 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content={`Parabéns por concluir o treinamento de ${trainingName}!`}
        className="text-black dark:text-white mb-4  text-[12px] md:text-[14px] max-w-[480px]"
      />
      {totalCorrectQuestions && totalQuestions && (
        <Subtitle
          content={`Você acertou ${totalCorrectQuestions} de ${totalQuestions} questões.`}
          className="text-black dark:text-white mb-4  text-[12px] md:text-[14px] max-w-[480px]"
        />
      )}
      <LinkButton
        title="Clique aqui para conferir suas respostas"
        onClick={onCheckQuizResponses}
      />
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col items-start relative max-w-[480px]">
          <Lottie
            speed={0.5}
            height={240}
            width={240}
            options={animationOptions}
          />
          <Subtitle
            content="O seu certificado de conclusão já está disponível para download. Acesse seus certificados para visualizar o novo certificado disponível."
            className="text-center text-black dark:text-white mb-4  text-[12px] md:text-[14px] max-w-[480px]  mx-auto"
          />
          <div className="w-full mt-5">
            <Button
              title="Acessar meus certificados"
              onClick={handleSeeCertificates}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
