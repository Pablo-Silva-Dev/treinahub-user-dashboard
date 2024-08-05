import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { trainingClasses } from "@/data/mocked";
import Player from "react-player";
import { NextClassCard } from "./components/NextClassCard";
import { PlayerListCard } from "./components/PlayerListCard";
import { PreviousClassCard } from "./components/PreviousClassCard";

// TODO-Pablo: Get screen title according to the training
export function WatchTraining() {
  const vimeoVideo = "https://vimeo.com/993530822?share=copy";
  return (
    <div className="w-full flex flex-col p-8 ">
      <ScreenTitleIcon
        screenTitle="Treinamento de Software de Laço"
        iconName="play-circle"
      />
      <Subtitle
        // TODO-Pablo: Show current playing class name
        content="Registrando novo usuário"
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
      />
      <div className="w-full lg:w-[95%] flex flex-col xl:flex-row">
        <div className="w-[80%] flex flex-col">
          <div className="flex flex-col bg-black lg:mr-8">
            <Player
              url={vimeoVideo}
              controls
              width="100%"
              style={{ aspectRatio: 16 / 9 }}
              volume={1}
            />
          </div>
          <div className="w-full flex flex-col sm:flex-row justify-between lg:pr-8 p-2 mt-2">
            <PreviousClassCard
              classDuration="13:22"
              classTitle="Como registrar novos usuários"
              onSeeClass={() => {}}
            />
            <NextClassCard
              classDuration="13:22"
              classTitle="Como registrar novos usuários de maneira inteligente"
              onSeeClass={() => {}}
            />
          </div>
          <div className="w-full flex flex-col p-4 mb-4">
            <Subtitle
              content="Descrição da aula"
              className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
            />
            <Text
              content="Nesta video-aula vamos aprender a como cadastrar um novo usuário. Vamos entender porque é importante armazenar informações pessoais do usuário."
              className="text-gray-800 dark:text-gray-50 text-[12px] md:text-[13px] text-pretty"
            />
          </div>
        </div>
        <div className="w-full xl:w-[50%] max-w-[480px]">
          <PlayerListCard classes={trainingClasses} />
        </div>
      </div>
    </div>
  );
}
