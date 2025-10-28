import { LinkButton } from "@/components/buttons/LinkButton";
import { Title } from "@/components/typography/Title";
import { UsersRepository } from "@/repositories/usersRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { useCallback, useMemo, useState } from "react";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";
import { UnAuthenticateUserModal } from "./components/UnauthenticateUserModal";

export default function InitialScreen() {
  const { signIn } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();
  const [email, setEmail] = useState("");
  const [isUnAuthenticateUserModalOpen, setIsUnAuthenticateUserModalOpen] =
    useState(false);

  const handleToggleUnAuthenticateUserModal = useCallback(() => {
    setIsUnAuthenticateUserModalOpen(!isUnAuthenticateUserModalOpen);
  }, [isUnAuthenticateUserModalOpen]);

  const usersRepository = useMemo(() => {
    return new UsersRepository();
  }, []);

  const handleSignIn = useCallback(
    async (data: SignInFormInputs) => {
      try {
        setIsLoading(true);
        const user = await usersRepository.authenticateUser(data);
        signIn(user);
      } catch (error: any) {
        const status =
          error?.STATUS ??
          error?.status ??
          error?.response?.status ??
          error?.response?.data?.STATUS;

        if (status === 409) {
          showAlertError("Credenciais incorretas ou usuário não encontrado.");
        }
        if (status === 406) {
          showAlertError(
            "Usuário já autenticado em outro dispositivo. Por favor, deslogue-se do outro dispositivo e tente novamente."
          );
        }
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, signIn, usersRepository]
  );

  const handleUnAuthenticateUser = useCallback(async () => {
    try {
      if (email) {
        await usersRepository.unAuthenticateUser({
          email,
        });
        showAlertSuccess(
          "Usuário desautenticado de todos dispositivos. Você já pode se autenticar novamente."
        );
        handleToggleUnAuthenticateUserModal();
      }
    } catch (error) {
      console.log(
        "Error at trying to unauthenticate user from all devices",
        error
      );
    }
  }, [email, handleToggleUnAuthenticateUserModal, usersRepository]);

  return (
    <div className="flex flex-col lg:mt-[16vh] items-center lg:mb-2 mb-8">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
      <div className="w-full flex justify-center mt-6">
        <LinkButton
          title="Desautenticar usuário de todos dispositivos"
          onClick={handleToggleUnAuthenticateUserModal}
        />
      </div>
      <UnAuthenticateUserModal
        isOpen={isUnAuthenticateUserModalOpen}
        onClose={handleToggleUnAuthenticateUserModal}
        email={email}
        setEmail={setEmail}
        onUnAuthenticateUser={handleUnAuthenticateUser}
      />
    </div>
  );
}
