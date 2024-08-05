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

  return (
    <main className="w-full flex flex-1  flex-col p-4 mt-4">
      <div className=" w-full flex flex-col md:ml-4 ">
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
            <TrainingInfoCard
              cover_url={infocard_placeholder}
              training="Treinamento de laço"
              description="Aprenda a fazer o treinamento de laço."
              lastClassName="Como fazer laços"
              lastClassDuration="14:32"
              totalCourseClasses={12}
              totalWatchedClasses={4}
              onSeeTraining={handleSeeTraining}
            />
          </div>
        </div>
        <div className="flex flex-row  w-full justify-center flex-wrap"></div>
      </div>
    </main>
  );
}
