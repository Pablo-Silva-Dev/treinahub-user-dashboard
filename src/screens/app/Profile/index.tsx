import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { users } from "@/data/mocked";
import { showAlertSuccess } from "@/utils/alerts";
import { useState } from "react";
import { EditProfileModal } from "./components/EditProfileModal";
import { ProfileCard } from "./components/ProfileCard";
import { UpdateAvatarModal } from "./components/UpdateAvatarModal";

export function Profile() {
  const [isEditProfileModalOpen, setIsEditModalProfileOpen] = useState(false);
  const [isUpdateAvatarModalOpen, setIsUpdateAvatarProfileModalOpen] =
    useState(false);

  const handleToggleUpdateAvatarModal = () => {
    setIsUpdateAvatarProfileModalOpen(!isUpdateAvatarModalOpen);
  };
  const handleToggleEditProfileModal = () => {
    setIsEditModalProfileOpen(!isEditProfileModalOpen);
  };

  const handleUpdateProfile = () => {
    console.log("Profile updated");
  };
  const handleUpdateAvatar = () => {
    console.log("Avatar updated");
    handleToggleUpdateAvatarModal();
    showAlertSuccess("Foto de perfil atualizada com sucesso!");
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
        onUpdateProfile={handleToggleEditProfileModal}
        onUpdateAvatar={handleToggleUpdateAvatarModal}
        user={users[0]}
      />
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleToggleEditProfileModal}
        onRequestClose={handleToggleEditProfileModal}
        onConfirmAction={handleUpdateProfile}
      />
      <UpdateAvatarModal
        isOpen={isUpdateAvatarModalOpen}
        onClose={handleToggleUpdateAvatarModal}
        onRequestClose={handleToggleUpdateAvatarModal}
        onConfirmAction={handleUpdateAvatar}
      />
    </div>
  );
}
