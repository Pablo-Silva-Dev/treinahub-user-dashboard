import { Button } from "@/components/buttons/Button";
import { TextInput } from "@/components/inputs/TextInput";
import { useThemeStore } from "@/store/theme";
import {
  reactTermsAndPolicyModalCustomStyles,
  reactTermsAndPolicyModalCustomStylesDark,
} from "@/styles/react-modal";
import { MdClose } from "react-icons/md";
import Modal from "react-modal";

interface UnAuthenticateModalProps {
  isOpen: boolean;
  onClose: () => void;
  email: string;
  setEmail: (email: string) => void;
  onUnAuthenticateUser: () => void;
}

export function UnAuthenticateUserModal({
  isOpen,
  onClose,
  email,
  setEmail,
  onUnAuthenticateUser,
}: UnAuthenticateModalProps) {
  const { theme } = useThemeStore();
  return (
    <Modal
      onRequestClose={onClose}
      isOpen={isOpen}
      style={
        theme === "light"
          ? (reactTermsAndPolicyModalCustomStyles as never)
          : (reactTermsAndPolicyModalCustomStylesDark as never)
      }
    >
      <div className="w-full flex flex-row justify-end mr-2">
        <button onClick={onClose} className="p-1 bg-transparent shadow-none">
          <MdClose className="h-6 w-6 text-red-200" />
        </button>
      </div>

      <h1 className="text-gray-900 dark:text-gray-100 mb-4 text-[16px] md:text-lg font-bold text-center">
        Desautenticar usuário
      </h1>
      <span className="text-gray-700 dark:text-gray-100 text-sm">
        Informe o email do usuário que deseja desautenticar de todos os
        dispositivos para que o usuário possa se autenticar novamente.
      </span>
      <div className="flex flex-col w-full mt-4">
        <TextInput
          inputLabel="Email do usuário"
          placeholder="Informe o email do usuário "
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full mt-2">
          <Button
            title="Desautenticar usuário"
            onClick={onUnAuthenticateUser}
          />
        </div>
      </div>
    </Modal>
  );
}
