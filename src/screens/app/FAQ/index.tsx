import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { IFaqQuestionDTO } from "@/repositories/dtos/FaqQuestionDTO";
import { FaqQuestionsRepository } from "@/repositories/faqQuestionsRepository";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FaqCollapsibleCard } from "./components/FaqCollapsibleCard";

export function FAQPage() {
  const [faqQuestions, setFaqQuestions] = useState<IFaqQuestionDTO[]>([]);

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const faqQuestionsRepository = useMemo(() => {
    return new FaqQuestionsRepository();
  }, []);

  const getFaqQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      const faqQuestions = await faqQuestionsRepository.listFaqQuestions();
      setFaqQuestions(faqQuestions);
      return faqQuestions;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [faqQuestionsRepository, setIsLoading]);

  useEffect(() => {
    getFaqQuestions();
  }, [getFaqQuestions]);

  const { isLoading: loading, error } = useQuery({
    queryKey: ["faq-questions"],
    queryFn: getFaqQuestions,
  });

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
      {isLoading || loading || !faqQuestions ? (
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
        <FaqCollapsibleCard questions={faqQuestions} />
      )}
    </div>
  );
}
