import infocard_placeholder from "@/assets/info_card_placeholder.png";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { useNavigate } from "react-router-dom";

export function Trainings() {
  const navigate = useNavigate();

  //TODO-Pablo: Add training id to navigation to navigate to the corresponding training
  const handleSeeTraining = () => {
    navigate("/dashboard/assistir-treinamento");
  };

  const handleSeeCertificate = () => {
    navigate("/dashboard/acessar-meus-certificados");
  };

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8">
      <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[80px] w-[80%]">
        <div className="flex flex-col w-full">
          <ScreenTitleIcon
            iconName="play-circle"
            screenTitle="Meus treinamentos"
          />
          <Subtitle
            content="Aqui estão todos os seus treinamentos"
            className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
          />
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <TrainingInfoCard
              cover_url={infocard_placeholder}
              training="Treinamento de laço"
              description="Aprenda a fazer o treinamento de laço."
              lastClassName="Como fazer laços"
              lastClassDuration="14:32"
              totalCourseClasses={12}
              totalWatchedClasses={12}
              onSeeTraining={handleSeeTraining}
              onSeeCertificate={handleSeeCertificate}
            />
            <TrainingInfoCard
              cover_url={infocard_placeholder}
              training="Treinamento de laço"
              description="Aprenda a fazer o treinamento de laço."
              lastClassName="Como fazer laços"
              lastClassDuration="14:32"
              totalCourseClasses={12}
              totalWatchedClasses={6}
              onSeeTraining={handleSeeTraining}
            />
            <TrainingInfoCard
              cover_url={infocard_placeholder}
              training="Treinamento de laço"
              description="Aprenda a fazer o treinamento de laço."
              lastClassName="Como fazer laços"
              lastClassDuration="14:32"
              totalCourseClasses={12}
              totalWatchedClasses={0}
              onSeeTraining={handleSeeTraining}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-row  w-full justify-center flex-wrap"></div>
    </div>
  );
}