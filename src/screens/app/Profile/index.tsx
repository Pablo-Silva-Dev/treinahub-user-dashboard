import { PRIMARY_COLOR } from "@/appConstants/index";
import avatar_placeholder from "@/assets/avatar_placeholder.svg";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { AvatarsRepository } from "@/repositories/avatarsRepository";
import { IAvatarDTO, IUpdateAvatarDTO } from "@/repositories/dtos/AvatarDTO";
import { IUpdateUserDTO, IUserDTO } from "@/repositories/dtos/UserDTO";
import { UsersRepository } from "@/repositories/usersRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { formatPhoneNumber } from "@/utils/formats";
import { phoneInputValidationRegex } from "@/utils/regex";
import { useQuery } from "@tanstack/react-query";
import cep from "cep-promise";
import { useCallback, useEffect, useMemo, useState } from "react";
import { EditProfileModal } from "./components/EditProfileModal";
import { ProfileCard } from "./components/ProfileCard";
import { UpdateAvatarModal } from "./components/UpdateAvatarModal";

export function Profile() {
  const [user, setUser] = useState<IUserDTO | null>(null);
  const [avatar, setAvatar] = useState<IAvatarDTO | null>(null);
  const [isEditProfileModalOpen, setIsEditModalProfileOpen] = useState(false);
  const [isUpdateAvatarModalOpen, setIsUpdateAvatarProfileModalOpen] =
    useState(false);

  const { user: authenticatedUser } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const [cepAddress, setCepAddress] = useState("");
  const [street, setStreet] = useState("");
  const [district, setDistrict] = useState("");
  const [city, setCity] = useState("");
  const [uf, setUf] = useState("");
  const [phone, setPhone] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [residenceNumber, setResidenceNumber] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const getCep = useCallback(async () => {
    try {
      const cepInfo = await cep(cepAddress);
      const { city, neighborhood, state, street } = cepInfo;
      setStreet(street);
      setDistrict(neighborhood);
      setCity(city);
      setUf(state);
    } catch (error) {
      console.log("[ERROR] - Error at trying to fetch cep: ", error);
    }
  }, [cepAddress]);

  const DEFAULT_CEP_LENGTH = 8;

  useEffect(() => {
    if (cepAddress.length === DEFAULT_CEP_LENGTH) {
      getCep();
    }
  }, [cepAddress, cepAddress.length, getCep]);

  useEffect(() => {
    if (phone) {
      const phoneValidation = new RegExp(phoneInputValidationRegex);
      if (phoneValidation.test(phone)) {
        setIsPhoneValid(true);
      } else {
        setIsPhoneValid(false);
      }
    }
  }, [phone]);

  const handleToggleUpdateAvatarModal = useCallback(() => {
    setIsUpdateAvatarProfileModalOpen(!isUpdateAvatarModalOpen);
  }, [isUpdateAvatarModalOpen]);

  const handleToggleEditProfileModal = useCallback(() => {
    setIsEditModalProfileOpen(!isEditProfileModalOpen);
  }, [isEditProfileModalOpen]);

  const usersRepository = useMemo(() => {
    return new UsersRepository();
  }, []);

  const avatarsRepository = useMemo(() => {
    return new AvatarsRepository();
  }, []);

  const getUserInfo = useCallback(async () => {
    try {
      setIsLoading(true);
      const userDetails = await usersRepository.getUserById(
        authenticatedUser.id
      );
      setUser(userDetails);
      return userDetails;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [authenticatedUser.id, setIsLoading, usersRepository]);

  const getAvatar = useCallback(async () => {
    try {
      setIsLoading(true);
      const avatarDetails = await avatarsRepository.getAvatarByUserId(
        authenticatedUser.id
      );
      if (avatarDetails) {
        setAvatar(avatarDetails);
        console.log(avatarDetails);
        return avatar;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authenticatedUser.id, avatarsRepository, setIsLoading]);

  useEffect(() => {
    getUserInfo();
    getAvatar();
  }, [getAvatar, getUserInfo]);

  const handleUpdateAvatar = useCallback(
    async (data: IUpdateAvatarDTO) => {
      try {
        setIsLoading(true);
        await avatarsRepository.updateAvatar({ ...data, id: avatar!.id });
        handleToggleUpdateAvatarModal();
        showAlertSuccess("Foto de perfil atualizada com sucesso!");
        getUserInfo();
      } catch (error) {
        showAlertError("Houve um erro ao atualizar avatar.");
        console.log(error);
      }
    },
    [
      avatar,
      avatarsRepository,
      getUserInfo,
      handleToggleUpdateAvatarModal,
      setIsLoading,
    ]
  );

  useEffect(() => {
    getAvatar();
  }, [getAvatar, handleToggleUpdateAvatarModal]);

  const { error } = useQuery({ queryKey: ["user"], queryFn: getUserInfo });

  const handleUpdateProfile = useCallback(
    async (data: IUpdateUserDTO) => {
      if (!user) return;

      const {
        cep: cep_user,
        city: city_user,
        district: district_user,
        street: street_user,
        residence_number: residence_number_user,
        uf: uf_user,
      } = user;

      const finalCep = cepAddress || cep_user || "";
      const finalCity = city || city_user || "";
      const finalStreet = street || street_user || "";
      const finalDistrict = district || district_user || "";
      const finalResidenceNumber =
        residenceNumber || residence_number_user || "";
      const finalUf = uf || uf_user || "";

      try {
        setIsLoading(true);
        await usersRepository.updateUser({
          ...data,
          cep: finalCep,
          city: finalCity,
          district: finalDistrict,
          residence_number: finalResidenceNumber,
          street: finalStreet,
          uf: finalUf,
          phone: formatPhoneNumber(phone),
        });
        showAlertSuccess("Dados atualizados com sucesso!");
        handleToggleEditProfileModal();
        getUserInfo();
      } catch (error) {
        console.log("error");
        showAlertError(
          "Houve um erro ao tentar atualizar dados. Por favor, tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      cepAddress,
      city,
      district,
      getUserInfo,
      handleToggleEditProfileModal,
      phone,
      residenceNumber,
      setIsLoading,
      street,
      uf,
      user,
      usersRepository,
    ]
  );

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon screenTitle="Meu perfil" iconName="user" />
      <Subtitle
        content="Informações do seu perfil"
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
      />
      {isLoading || !user ? (
        <div className="w-full flex flex-col items-center mt-[10vh]">
          <Loading color={PRIMARY_COLOR} />
        </div>
      ) : error ? (
        <div className="w-full flex flex-col items-center mt-[10vh]">
          <img
            src={theme === "light" ? error_warning : error_warning_dark}
            alt="ps-trainings"
            width={240}
          />
        </div>
      ) : (
        <ProfileCard
          avatar_url={avatar && avatar.url ? avatar.url : avatar_placeholder}
          onUpdateProfile={handleToggleEditProfileModal}
          onUpdateAvatar={handleToggleUpdateAvatarModal}
          user={user}
        />
      )}
      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={handleToggleEditProfileModal}
        onRequestClose={handleToggleEditProfileModal}
        onConfirmAction={handleUpdateProfile}
        cepAddress={cepAddress}
        setCepAddress={setCepAddress}
        street={street}
        setStreet={setStreet}
        district={district}
        setDistrict={setDistrict}
        city={city}
        setCity={setCity}
        uf={uf}
        setUf={setUf}
        phone={phone}
        setPhone={setPhone}
        residenceNumber={residenceNumber}
        setResidenceNumber={setResidenceNumber}
        password={password}
        setPassword={setPassword}
        passwordConfirmation={passwordConfirmation}
        setPasswordConfirmation={setPasswordConfirmation}
        isPhoneValid={isPhoneValid}
        userId={authenticatedUser.id}
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
