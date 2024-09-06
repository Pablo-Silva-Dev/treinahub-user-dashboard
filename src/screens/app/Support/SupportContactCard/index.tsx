import { unformatPhoneNumber } from "@/utils/formats";
import { MdPerson, MdWhatsapp } from "react-icons/md";

interface ContactSupportCardProps {
  name: string;
  contactNumber: string;
  onContact: () => void;
}

export function ContactSupportCard({
  name,
  contactNumber,
  onContact,
}: ContactSupportCardProps) {
  return (
    <div className="flex flex-row p-4 rounded-md mb-4 bg-gray-50 dark:bg-slate-700 shadow-md items-center justify-between">
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <MdPerson className="h-4 w-4 md:h-6 md:w-6 sm:mr-2  text-gray-800 dark:text-gray-200 my-1" />
        <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 sm:mr-4">
          {name}
        </span>
        <MdWhatsapp className="h-4 w-4 md:h-6 md:w-6 sm:mr-2  text-green-500 my-1" />
        <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 sm:mr-10">
          {unformatPhoneNumber(contactNumber)}
        </span>
      </div>
      <button
        className="border-[1px] border-gray-400 dark:border-gray-50 text-[12px] lg:text-sm text-gray-800 dark:text-gray-50 p-2 rounded-md"
        onClick={onContact}
      >
        <span className="text-[12px] md:text-[15px] text-gray-900 dark:text-gray-100 text-center">
          Contatar surpote
        </span>
      </button>
    </div>
  );
}
