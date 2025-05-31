import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { faqQuestions } from "@/data/faq";
import { FaqCollapsibleCard } from "./components/FaqCollapsibleCard";

export default function FAQPage() {
  return (
    <div className="w-full flex flex-col p-8 md:pl-[80px]">
      <ScreenTitleIcon
        screenTitle="Perguntas frequentes"
        iconName="help-circle"
      />
      <Subtitle
        content="Veja abaixo as dúvidas mais comuns. Por favor, certifique-se de que sua dúvida não esteja esclarecida antes de acessar o suporte."
        className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
      />
      <FaqCollapsibleCard questions={faqQuestions} />
    </div>
  );
}
