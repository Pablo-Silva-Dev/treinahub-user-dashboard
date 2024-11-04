import { Title } from "@/components/typography/Title";
import { UsersRepository } from "@/repositories/usersRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { showAlertError } from "@/utils/alerts";
import { useCallback, useMemo } from "react";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";

export default function InitialScreen() {
  const { signIn } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();

  const usersRepository = useMemo(() => {
    return new UsersRepository();
  }, []);
  const handleSignIn = useCallback(async (data: SignInFormInputs) => {
    try {
      setIsLoading(true);
      const user = await usersRepository.authenticateUser(data);
      signIn(user);
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        const typedError = error as { STATUS: number };
        if (typedError.STATUS === 409) {
          showAlertError("Credenciais incorretas!");
        } else {
          showAlertError(
            "Houve um erro ao tentar realizar login. Por favor, tente novamente mais tarde."
          );
        }
      }
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, signIn, usersRepository]);

  return (
    <div className="flex flex-col lg:mt-[16vh] items-center lg:mb-2 mb-8">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} isLoading={isLoading} />
    </div>
  );
}
