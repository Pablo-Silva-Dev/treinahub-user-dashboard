import infocard_placeholder from "@/assets/info_card_placeholder.png";
import GreetUser from "@/components/miscellaneous/GreetUser";
import { ImageCardButton } from "@/components/miscellaneous/ImageCardButton";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";

export function Home() {
  return (
    <main className="w-full flex flex-1  flex-col p-4 mt-4">
      <div className=" w-full flex flex-col md:ml-4 ">
        <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[80px] w-[80%]">
          <GreetUser userName="John Doe" />
          <div className="flex flex-col w-full">
            <Subtitle
              content="Acesse seus treinamentos"
              className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
            />
            <ImageCardButton />
            <div className="w-full flex flex-col items-center my-[24px]">
              <Text content="ou" />
            </div>
            <Subtitle
              content="Continue de onde parou"
              className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
            />
            <TrainingInfoCard
              cover_url={infocard_placeholder}
              training="Treinamento de laço"
              description="Aprenda a fazer o treinamento de laço."
              lastClassName="Como fazer laços"
              lastClassDuration="14:32"
              totalCourseClasses={12}
              totalWatchedClasses={4}
              onSeeTraining={() => {console.log('pending')}}
            />
          </div>
        </div>
        <div className="flex flex-row  w-full justify-center flex-wrap"></div>
      </div>
    </main>
  );
}
