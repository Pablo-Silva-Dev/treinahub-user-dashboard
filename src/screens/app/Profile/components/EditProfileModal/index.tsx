import { Button } from "@/components/buttons/Button";
import { MaskedTextInput } from "@/components/inputs/MaskedTextInput";
import { PasswordTextInput } from "@/components/inputs/PasswordInput";
import { TextInput } from "@/components/inputs/TextInput";
import { PasswordRequirements } from "@/components/miscellaneous/PasswordRequirements";
import { Title } from "@/components/typography/Title";
import { IUpdateUserDTO } from "@/repositories/dtos/UserDTO";
import { useThemeStore } from "@/store/theme";
import {
  reactModalCustomStyles,
  reactModalCustomStylesDark,
} from "@/styles/react-modal";
import { cepMask, phoneMask } from "@/utils/masks";
import {
  Dispatch,
  KeyboardEvent,
  MouseEvent,
  SetStateAction,
  useRef,
} from "react";
import Modal from "react-modal";

interface EditProfileModalProps {
  isOpen: boolean;
  onRequestClose: (
    event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>
  ) => void;
  onConfirmAction: (data: IUpdateUserDTO) => void;
  onClose: () => void;
  cepAddress: string;
  setCepAddress: Dispatch<SetStateAction<string>>;
  userId: string;
  street: string;
  setStreet: Dispatch<SetStateAction<string>>;
  district: string;
  setDistrict: Dispatch<SetStateAction<string>>;
  city: string;
  setCity: Dispatch<SetStateAction<string>>;
  uf: string;
  setUf: Dispatch<SetStateAction<string>>;
  phone: string;
  setPhone: Dispatch<SetStateAction<string>>;
  residenceNumber: string;
  setResidenceNumber: Dispatch<SetStateAction<string>>;
  password: string;
  setPassword: Dispatch<SetStateAction<string>>;
  passwordConfirmation: string;
  setPasswordConfirmation: Dispatch<SetStateAction<string>>;
  isPhoneValid: boolean;
}

export function EditProfileModal({
  isOpen,
  onRequestClose,
  onConfirmAction,
  onClose,
  cepAddress,
  setCepAddress,
  street,
  setStreet,
  district,
  setDistrict,
  city,
  setCity,
  uf,
  setUf,
  phone,
  setPhone,
  residenceNumber,
  setResidenceNumber,
  password,
  setPassword,
  passwordConfirmation,
  setPasswordConfirmation,
  isPhoneValid,
  userId,
}: EditProfileModalProps) {
  const { theme } = useThemeStore();

  const passwordConfirmationRef = useRef(false);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose as never}
      style={
        theme === "light" ? reactModalCustomStyles : reactModalCustomStylesDark
      }
    >
      <Title
        content="Atualização de dados"
        className="text-center text-black dark:text-white mb-4 font-bold text-[14px] md:text-lg"
      />

      <div className="flex flex-col">
        <div className="w-full flex flex-col md:flex-row">
          <div className="my-4 w-full">
            <MaskedTextInput
              inputLabel="Cep"
              placeholder="Informe o CEP"
              mask={cepMask}
              value={cepAddress}
              onChange={(val) => {
                const unmaskedCep = val.target.value.replace(/\D/g, ""); // Remove non-numeric characters
                setCepAddress(unmaskedCep);
              }}
            />
          </div>
          <div className="my-4 md:ml-2 w-full">
            <TextInput
              inputLabel="Rua"
              placeholder="Informe a rua"
              value={street}
              onChange={(val) => setStreet(val.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row">
          <div className="my-4">
            <TextInput
              inputLabel="Número"
              placeholder="Número"
              onChange={(val) => setResidenceNumber(val.target.value)}
            />
          </div>
          <div className="my-4 md:ml-2 w-full">
            <TextInput
              inputLabel="Bairro"
              placeholder="Informe o bairro"
              value={district}
              onChange={(val) => setDistrict(val.target.value)}
            />
          </div>
        </div>
        <div className="w-full flex flex-col md:flex-row">
          <div className="my-4 w-full">
            <TextInput
              inputLabel="Cidade"
              placeholder="Informe a cidade"
              value={city}
              onChange={(val) => setCity(val.target.value)}
            />
          </div>
          <div className="my-4 md:ml-2 w-full">
            <TextInput
              inputLabel="Estado"
              placeholder="Informe o estado"
              value={uf}
              onChange={(val) => setUf(val.target.value)}
            />
          </div>
        </div>
        <div className="my-4 w-full md:w-[50%]">
          <MaskedTextInput
            inputLabel="Telefone"
            mask={phoneMask}
            value={phone}
            onChange={(val) => setPhone(val.target.value)}
          />
        </div>
      </div>
      <PasswordRequirements
        password={password}
        passwordValidated={passwordConfirmationRef}
      />
      <div className="w-full flex flex-col md:flex-row">
        <div className="my-4 w-full">
          <PasswordTextInput
            inputLabel="Senha"
            placeholder="Informe a nova senha"
            value={password}
            onChange={(val) => setPassword(val.target.value)}
          />
        </div>
        <div className="my-4 w-full md:ml-2">
          <PasswordTextInput
            inputLabel="Confirmação de senha"
            placeholder="Confirme a nova senha"
            value={passwordConfirmation}
            onChange={(val) => setPasswordConfirmation(val.target.value)}
          />
        </div>
      </div>

      <Button
        title="Salvar dados"
        onClick={() =>
          onConfirmAction({
            id: userId,
            password,
            cep: cepAddress === "" ? null : cepAddress,
            street: street === "" ? null : street,
            district: district === "" ? null : district,
            city: city === "" ? null : city,
            uf: uf === "" ? null : uf,
            residence_number: residenceNumber === "" ? null : residenceNumber,
            phone: phone === "" ? null : phone,
          })
        }
        disabled={
          (cepAddress && !street) ||
          (cepAddress && !residenceNumber) ||
          (cepAddress && !district) ||
          (cepAddress && !city) ||
          (cepAddress && !uf) ||
          password !== passwordConfirmation ||
          !phone ||
          !isPhoneValid
        }
      />
      <button
        onClick={onClose}
        className="text-black dark:text-white bg-gray-200 dark:bg-slate-700 p-4 rounded-lg text-[13px] md:text-[14px] w-full my-2"
      >
        Cancelar
      </button>
    </Modal>
  );
}
