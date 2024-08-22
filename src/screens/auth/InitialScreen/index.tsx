import { Title } from "@/components/typography/Title";
import { UsersRepository } from "@/repositories/usersRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useCallback } from "react";
import { SignInForm, SignInFormInputs } from "./components/SignInForm";

export function InitialScreen() {
  const { signIn } = useAuthenticationStore();

  const handleSignIn = useCallback(async (data: SignInFormInputs) => {
    const usersRepository = new UsersRepository();
    try {
      const response = await usersRepository.authenticateUser(data);
      console.log(response)
      // signIn()
    } catch (error) {
      console.log(error);
    }
  }, []);

  return (
    <div className="flex flex-col lg:mt-[16vh] items-center lg:mb-2 mb-8">
      <Title
        content="Entrar na plataforma"
        className="text-black dark:text-white mb-6 text-xl font-bold md:text-3xl font-secondary"
      />
      <SignInForm onSubmit={handleSignIn} />
    </div>
  );
}
