import {
  BIRTH_DATE_INVALID_MESSAGE,
  CPF_INVALID_MESSAGE,
  EMAIL_INVALID_MESSAGE,
  MIN_PASSWORD_LENGTH,
  PASSWORD_MIN_LENGTH_MESSAGE,
  PHONE_INVALID_MESSAGE,
  REQUIRED_FIELD_MESSAGE,
} from "@/appConstants/index";
import { Button } from "@/components/buttons/Button";
import { ErrorMessage } from "@/components/inputs/ErrorMessage";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { SelectInput } from "@/components/inputs/SelectInput";
import { TextInput } from "@/components/inputs/TextInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { ICompanyDTO } from "@/repositories/dtos/CompanyDTO";
import { birthDateMask, cpfMask } from "@/utils/masks";
import {
  birthDateValidationRegex,
  cpfValidationRegex,
  phoneWithoutCountryCodeValidationRegex,
} from "@/utils/regex";
import { yupResolver } from "@hookform/resolvers/yup";
import { Checkbox } from "@material-tailwind/react/";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import * as yup from "yup";

export interface SignUpFormInputs {
  name: string;
  email: string;
  cpf: string;
  birth_date: string;
  phone: string;
  password: string;
  company_id: string;
}

interface SignUpFormProps {
  onSubmit: (data: SignUpFormInputs) => void;
  onOpenUseTermsModal: () => void;
  onOpenPrivacyPolicyModal: () => void;
  passwordConfirmation: string;
  setPasswordConfirmation: Dispatch<SetStateAction<string>>;
  isLoading: boolean;
  companiesList: ICompanyDTO[];
}

export default function SignUpForm({
  onSubmit,
  onOpenPrivacyPolicyModal,
  onOpenUseTermsModal,
  passwordConfirmation,
  setPasswordConfirmation,
  isLoading,
  companiesList,
}: SignUpFormProps) {
  const validationSchema = yup.object({
    name: yup.string().required(REQUIRED_FIELD_MESSAGE),
    email: yup
      .string()
      .required(REQUIRED_FIELD_MESSAGE)
      .email(EMAIL_INVALID_MESSAGE),
    birth_date: yup
      .string()
      .matches(birthDateValidationRegex, BIRTH_DATE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    cpf: yup
      .string()
      .matches(cpfValidationRegex, CPF_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    phone: yup
      .string()
      .matches(phoneWithoutCountryCodeValidationRegex, PHONE_INVALID_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    password: yup
      .string()
      .min(MIN_PASSWORD_LENGTH, PASSWORD_MIN_LENGTH_MESSAGE)
      .required(REQUIRED_FIELD_MESSAGE),
    company_id: yup.string().required(REQUIRED_FIELD_MESSAGE),
  });
  const passwordValidated = useRef(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
  } = useForm<SignUpFormInputs>({
    resolver: yupResolver(validationSchema),
    mode: "onBlur",
  });

  const handleSubmitForm: SubmitHandler<SignUpFormInputs> = (data) => {
    onSubmit(data);
  };

  const passwordValue = watch("password") || "";
  const phoneValue = watch("phone");
  const nameValue = watch("name");
  const emailValue = watch("email");
  const cpfValue = watch("cpf");
  const birthDateValue = watch("birth_date");
  const companyId = watch("company_id");

  const [wasTermsAccepted, setWasTermsAccepted] = useState(false);

  type IOption = {
    label: string;
    value: string;
  };

  const companiesSelectInputs: IOption[] = companiesList.map((company) => ({
    value: company.id,
    label: company.fantasy_name,
  }));

  return (
    <form
      className="max-w-lg bg-gray-50 dark:bg-slate-800 p-6 shadow-xl rounded-lg mx-auto w-[100%]  max-h-[560px] overflow-x-auto  mb-[40px]"
      onSubmit={handleSubmit(handleSubmitForm)}
    >
      <div className="flex flex-col w-full">
        {
          <>
            <div className="w-full my-2">
              <TextInput
                inputLabel="Nome"
                placeholder="Seu nome"
                autoComplete="name"
                {...register("name")}
              />
              {errors.name && (
                <ErrorMessage errorMessage={errors.name.message} />
              )}
            </div>
            <div className="w-full mr-2">
              <TextInput
                inputLabel="Email"
                placeholder="Seu email"
                autoComplete="email"
                style={{ width: "99%" }}
                {...register("email")}
              />
              {errors.email && (
                <ErrorMessage errorMessage={errors.email.message} />
              )}
            </div>
            <div className="w-full flex flex-row mb-4">
              <div className="w-full">
                <MaskedTextInput
                  mask={birthDateMask}
                  inputLabel="Data de nascimento"
                  placeholder="Ex: 12/12/1973"
                  autoComplete="bday"
                  style={{ width: "99%" }}
                  inputMode="numeric"
                  {...register("birth_date")}
                />
                {errors.birth_date && (
                  <ErrorMessage errorMessage={errors.birth_date.message} />
                )}
              </div>
              <div className="w-full ml-0.5">
                <MaskedTextInput
                  mask={cpfMask}
                  inputLabel="CPF"
                  placeholder="Seu CPF"
                  autoComplete="off"
                  style={{ width: "99%" }}
                  inputMode="numeric"
                  {...register("cpf")}
                />
                {errors.cpf && (
                  <ErrorMessage errorMessage={errors.cpf.message} />
                )}
              </div>
            </div>
            <div className="w-full ml-0.5">
              <TextInput
                inputLabel="Telefone"
                placeholder="DDD + telefone, sem espaços"
                autoComplete="tel"
                style={{ width: "99%" }}
                inputMode="numeric"
                {...register("phone")}
              />
              {errors.phone && (
                <ErrorMessage errorMessage={errors.phone.message} />
              )}
            </div>
            <div className="w-full ml-0.5">
              <SelectInput
                options={companiesSelectInputs}
                label="Empresa"
                placeholder="Selecione sua empresa"
                onSelectOption={(value) => {
                  setValue("company_id", value.value as string, {
                    shouldValidate: true,
                  });
                }}
              />
              {errors.company_id && (
                <ErrorMessage errorMessage={errors.company_id.message} />
              )}
            </div>
          </>
        }
        {nameValue &&
          emailValue &&
          cpfValue &&
          birthDateMask &&
          phoneValue &&
          birthDateValue &&
          companyId && (
            <>
              <div className="w-full mt-2">
                <PasswordRequirements
                  password={passwordValue}
                  passwordValidated={passwordValidated}
                />
              </div>
              <div className="w-full mb-4">
                <PasswordTextInput
                  inputLabel="Senha"
                  autoComplete="new-password"
                  placeholder="Mínimo de 8 dígitos"
                  {...register("password")}
                />
                {errors.password && (
                  <ErrorMessage errorMessage={errors.password.message} />
                )}
              </div>
              <div className="w-full mb-4">
                <PasswordTextInput
                  inputLabel="Confirmação da senha"
                  placeholder="Confirme a senha"
                  autoComplete="new-password"
                  value={passwordConfirmation}
                  onChange={(val) => setPasswordConfirmation(val.target.value)}
                />
                {passwordValue.length >= MIN_PASSWORD_LENGTH &&
                  passwordConfirmation.length >= MIN_PASSWORD_LENGTH &&
                  passwordValue !== passwordConfirmation && (
                    <ErrorMessage errorMessage="As senhas não correspondem" />
                  )}
              </div>
            </>
          )}
        <div className="w-full flex flex-col my-2">
          <div className="flex flex-row items-center">
            <Checkbox
              defaultChecked={wasTermsAccepted}
              onClick={() => setWasTermsAccepted(!wasTermsAccepted)}
              className=" text-red-200 m-0"
              color="blue"
            />
            <span className="text-gray-700 dark:text-gray-100 text-[11px] md:text-[13px]">
              Li e concordo com os
            </span>
          </div>
          <div className="flex flex-row items-center ml-3">
            <span
              className="text-primary-dark dark:text-primary-light text-[11px] md:text-[13px] mr-2 cursor-pointer"
              onClick={onOpenUseTermsModal}
            >
              Termos de Uso{" "}
            </span>
            <span className="text-gray-700 dark:text-gray-100 text-[11px] md:text-[13px] mr-2">
              e{" "}
            </span>
            <span
              className="text-primary-dark dark:text-primary-light text-[11px] md:text-[13px] cursor-pointer"
              onClick={onOpenPrivacyPolicyModal}
            >
              Política de Privacidade
            </span>
          </div>
        </div>
        <div className="w-full mt-2">
          <Button
            type="submit"
            title="Fazer Cadastro"
            disabled={
              !isValid ||
              !passwordValidated.current ||
              passwordValue !== passwordConfirmation ||
              !wasTermsAccepted ||
              isLoading
            }
          />
        </div>
      </div>
    </form>
  );
}
