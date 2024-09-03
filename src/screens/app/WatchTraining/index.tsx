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
  const bitmovinStreamUrl =
    "https://pscodepscoursetrack.blob.core.windows.net/bitmovin-output/listando20usuc3a1rios203video.mov/hls/manifest/stream.m3u8";
  return (
    <div className="w-full flex flex-col p-8 md:pl-[40px] xl:pl-[8%]">
      <div className="mb-2">
        <ScreenTitleIcon
          screenTitle="Treinamento de Software de Laço"
          iconName="play-circle"
        />
      </div>
      <div className="w-full flex flex-col xl:flex-row">
        <div className="w-full  xl:w-[55%] flex flex-col">
          <div className="flex flex-col  w-full aspect-video min-h-[200px] ">
            <Player
              url={bitmovinStreamUrl}
              controls
              width="100%"
              height="100%"
              volume={1}
              //TODO-pablo: call end-point to add the watched video and update training metrics at once
              onEnded={() => console.log("Video ended")}
            />
          </div>
          <Subtitle
            // TODO-Pablo: Show current playing class name
            content="Registrando novo usuário"
            className="m-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
          />
          <div className="w-full flex flex-col lg:flex-row justify-between">
            <PreviousClassCard
              classDuration="13:22"
              classTitle="Como registrar novos usuários"
              onSeeClass={() => {console.log("pending")}}
            />
            <NextClassCard
              classDuration="13:22"
              classTitle="Como registrar novos usuários de maneira inteligente"
              onSeeClass={() => {console.log("pending")}}
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
        <div className="w-full xl:w-[35%] xl:max-w-[480px] xl:ml-6">
          <PlayerListCard classes={trainingClasses} />
        </div>
      </div>
    </div>
  );
}
