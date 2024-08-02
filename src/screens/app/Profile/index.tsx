import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { users } from "@/data/mocked";
import { ProfileCard } from "./components/ProfileCard";

export function Profile() {
  const handleUpdateProfile = () => {
    console.log("User updated");
  };

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon screenTitle="Meu perfil" iconName="user" />
      <Subtitle
        content="Informações do seu perfil"
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
      />
      <ProfileCard
        avatar_url="https://docs.material-tailwind.com/img/face-2.jpg"
        onUpdateProfile={handleUpdateProfile}
        user={users[0]}
      />
    </div>
  );
}
