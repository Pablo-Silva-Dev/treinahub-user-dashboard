import congratulations_animation from "@/assets/congratulations_animation.json";
import { Button } from "@/components/buttons/Button";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { secondsToFullTimeString } from "@/utils/formats";
import { KeyboardEvent, MouseEvent } from "react";
import Lottie from "react-lottie";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

interface TrainingCompleteModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  training: ITrainingDTO | null;
}

export function TrainingCompleteModal({
  isOpen,
  onRequestClose,
  training,
}: TrainingCompleteModalProps) {
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
        content="Treinamento concluído!"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />
      <Subtitle
        content={`Parabéns por completar seu treinamento ${training && training.name} com duração de ${training && secondsToFullTimeString(training.duration)}!`}
        className="text-center text-black dark:text-white mb-4  text-[14px] md:text-[16px] max-w-[480px]  mx-auto"
      />
      <div className="w-full flex flex-col items-center">
        <div className="w-full flex flex-col items-start relative max-w-[480px]">
          <Lottie
            speed={0.5}
            height={240}
            width={240}
            options={animationOptions}
          />
          <span className="mt-3 text-gray-600 dark:text-gray-300 text-sm md:text-[15px] text-center">
            O seu certificado de conclusão já está disponível para download.
            Acesse seus certificados para visualizar o novo certificado
            disponível.
          </span>
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
