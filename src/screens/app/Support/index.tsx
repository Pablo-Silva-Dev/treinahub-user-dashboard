import { PRIMARY_COLOR, SUPPORT_STARTING_MESSAGE } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { ContactsSupportRepository } from "@/repositories/contactsSupportRepository";
import { IContactSupportDTO } from "@/repositories/dtos/ContactSupportDTO";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { formatPhoneNumberWithoutCountryCode } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ContactSupportCard } from "./SupportContactCard";

export function SupportPage() {
  const [contactSupports, setContactSupports] = useState<IContactSupportDTO[]>(
    []
  );

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const contactsSupportsRepository = useMemo(() => {
    return new ContactsSupportRepository();
  }, []);

  const getContactSupports = useCallback(async () => {
    try {
      setIsLoading(true);
      const contactSupports = await contactsSupportsRepository.listContacts();
      setContactSupports(contactSupports);
      return contactSupports;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [contactsSupportsRepository, setIsLoading]);

  useEffect(() => {
    getContactSupports();
  }, [getContactSupports]);

  const { isLoading: loading, error } = useQuery({
    queryKey: ["contacts-support"],
    queryFn: getContactSupports,
  });

  const handleContactSupport = (contactNumber: string) => {
    const url = `https://api.whatsapp.com/send?phone=${contactNumber}&text=${encodeURIComponent(
      SUPPORT_STARTING_MESSAGE
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon screenTitle="Suporte" iconName="message-square" />
      <Subtitle
        content="Consulte aqui os números de contato caso necessite de suporte. Pedimos que verifique se sua dúvida já não foi respondida no FAQ antes de acionar o suporte."
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[100%] md:w-[80%]"
      />
      {isLoading || loading || !contactSupports ? (
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
        <div className="w-full md:max-w-[70vw] lg:max-w-[60vw] xl:max-w-[40vw] flex flex-col mt-2">
          {contactSupports.map((cs) => (
            <ContactSupportCard
              key={cs.id}
              contactNumber={cs.contact_number}
              name={cs.name}
              onContact={() =>
                handleContactSupport(
                  formatPhoneNumberWithoutCountryCode(cs.contact_number)
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
