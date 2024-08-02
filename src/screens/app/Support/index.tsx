import { SUPPORT_STARTING_MESSAGE } from "@/appConstants/index";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { FaWhatsapp } from "react-icons/fa";

export function SupportPage() {
  const whatsappSupportContactNumber = import.meta.env
    .VITE_WHATSAPP_SUPPORT_CONTACT_NUMBER;

  const handleContactSupport = () => {
    const url = `https://api.whatsapp.com/send?phone=${whatsappSupportContactNumber}&text=${encodeURIComponent(
      SUPPORT_STARTING_MESSAGE
    )}`;
    window.open(url, "_blank");
  };

  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon screenTitle="Suporte" iconName="message-square" />
      <Subtitle
        content={`Entre em contato com o suporte através do canal do Whastapp: ${whatsappSupportContactNumber}`}
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
      />
      <button
        className="text-sm md:text-md text-gray-50 bg-green-600 w-[240px] flex justify-center items-center rounded-md p-4 font-secondary"
        onClick={handleContactSupport}
      >
        <FaWhatsapp className="mr-2 w-5 h-5 md:w-6 lg:h-6" />
        Entrar em contato
      </button>
    </div>
  );
}
