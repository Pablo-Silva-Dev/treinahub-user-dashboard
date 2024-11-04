import { AVATAR_PLACEHOLDER_URL, NAVIGATION_TIMER } from "@/appConstants/index";
import { HeaderNavigation } from "@/components/miscellaneous/HeaderNavigation";
import { AvatarsRepository } from "@/repositories/avatarsRepository";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { UsersRepository } from "@/repositories/usersRepository";
import { useLoading } from "@/store/loading";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PrivacyPolicyModal } from "./components/PrivacyPolicyModal";
import SignUpForm from "./components/SignUpForm";
import { UseTermsModal } from "./components/UseTermsModal";

export default function SignUp() {
  const [useTermsModal, setUseTermsModal] = useState(false);
  const [privacyPolicyModal, setPrivacyPolicyModal] = useState(false);
  const navigate = useNavigate();
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [companiesList, setCompaniesList] = useState<ICompanyDTO[]>([]);

  const { isLoading, setIsLoading } = useLoading();

  const handleToggleUseTermsModal = () => {
    setUseTermsModal(!useTermsModal);
  };

  const handleTogglePrivacyPolicyModal = () => {
    setPrivacyPolicyModal(!privacyPolicyModal);
  };

  const usersRepository = useMemo(() => {
    return new UsersRepository();
  }, []);

  const avatarsRepository = useMemo(() => {
    return new AvatarsRepository();
  }, []);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const getCompanies = useCallback(async () => {
    try {
      setIsLoading(true);
      const companies = await companiesRepository.listCompanies();
      setCompaniesList(companies);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [companiesRepository, setIsLoading]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  const handleRegisterUser = async (data: any) => {
    try {
      const { phone } = data;
      const brazilianPhoneCode = "+55";
      const completePhone = brazilianPhoneCode + phone;
      const user = await usersRepository.registerUser({
        ...data,
        is_admin: true,
        phone: completePhone,
      });

      await avatarsRepository.createAvatar({
        url: AVATAR_PLACEHOLDER_URL,
        user_id: user.id,
      });
      showAlertSuccess("Cadastro realizado com sucesso!");
      setTimeout(() => {
        navigate("/");
      }, NAVIGATION_TIMER);
    } catch (error) {
      if (typeof error === "object" && error !== null && "STATUS" in error) {
        const typedError = error as { STATUS: number };
        if (typedError.STATUS === 409)
          showAlertError(
            "Já existe um usuário cadastrado com os dados informados."
          );
        console.log(error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="flex flex-row mb-2 w-full sm:w-[400px] ml-8 sm:mx-auto">
        <HeaderNavigation screenTitle="Cadastro" />
      </div>
      {!isLoading && (
        <SignUpForm
          onSubmit={handleRegisterUser}
          onOpenUseTermsModal={handleToggleUseTermsModal}
          onOpenPrivacyPolicyModal={handleTogglePrivacyPolicyModal}
          isLoading={isLoading}
          passwordConfirmation={passwordConfirmation}
          setPasswordConfirmation={setPasswordConfirmation}
          companiesList={companiesList}
        />
      )}
      <UseTermsModal
        onClose={handleToggleUseTermsModal}
        isOpen={useTermsModal}
      />
      <PrivacyPolicyModal
        onClose={handleTogglePrivacyPolicyModal}
        isOpen={privacyPolicyModal}
      />
    </div>
  );
}
