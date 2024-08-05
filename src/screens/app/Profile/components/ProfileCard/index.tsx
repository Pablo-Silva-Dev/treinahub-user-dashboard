import { IUser } from "@/interfaces/dtos/User";
import { Avatar, Tooltip } from "@material-tailwind/react";
import { MdEdit, MdOutlinePhotoCamera } from "react-icons/md";

interface ProfileCardProps {
  user: IUser;
  avatar_url: string;
  onUpdateProfile: () => void;
  onUpdateAvatar: () => void;
}

export function ProfileCard({
  user,
  avatar_url,
  onUpdateProfile,
  onUpdateAvatar,
}: ProfileCardProps) {
  return (
    <div className="w-full lg:w-[90%] bg-white dark:bg-slate-700 flex flex-col lg:flex-row p-5 rounded-md">
      <div className="w-full flex flex-col justify-evenly">
        <div className="w-full flex flex-col mb-4">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            Nome
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {user.name}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            Email
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {user.email}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4 md:mb-0">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            Telefone
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {user.phone}
          </span>
        </div>
      </div>

      <div className="w-full flex flex-col justify-evenly">
        <div className="w-full flex flex-col mb-4">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            CPF
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {user.cpf}
          </span>
        </div>
        <div className="w-full flex flex-col mb-4">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            Data de nascimento
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            {user.birthDate}
          </span>
        </div>
        <div className="w-full flex flex-col">
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary font-bold">
            Senha
          </span>
          <span className="text-gray-800 dark:text-gray-50 text-[11px] lg:text-sm font-primary text-pretty">
            *******
          </span>
        </div>
      </div>

      <div className="flex flex-col">
        <div className="w-full flex flex-1 flex-col justify-around items-center mr-3">
          <div className="flex flex-row">
            <Avatar src={avatar_url} size="xl" />
            <Tooltip content="Atualizar foto de perfil">
              <button
                className="flex justify-center items-center bg-primary-light h-6 w-6 lg:h-7 lg:w-7 rounded-full mt-[40px] ml-[-12px] z-10"
                onClick={onUpdateAvatar}
              >
                <MdOutlinePhotoCamera className="text-gray-50 h-4 w-4" />
              </button>
            </Tooltip>
          </div>
          <button
            className=" flex flex-row justify-center  items-center border-2 border-gray-800 p-2 rounded-md w-[240px] text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 mt-4"
            onClick={onUpdateProfile}
          >
            <MdEdit className="text-gray-800 dark:text-gray-50 h-4 w-4 mr-2 " />
            Atualizar dados
          </button>
        </div>
      </div>
    </div>
  );
}