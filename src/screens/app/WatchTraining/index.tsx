import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { trainingClasses } from "@/data/mocked";
import { PlayerListCard } from "./components/PlayerListCard";

// TODO-Pablo: Get screen title according to the training
export function WatchTraining() {
  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon
        screenTitle="Treinamento de Software de Laço"
        iconName="play-circle"
      />
      <Subtitle
        // TODO-Pablo: Show current playing class name
        content="Registrando novo usuário"
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
      />
      <PlayerListCard classes={trainingClasses} />
    </div>
  );
}
