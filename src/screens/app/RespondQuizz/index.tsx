import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { ICompleteQuizQuestionDTO } from "@/repositories/dtos/QuizDTO";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { Carousel } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { QuizResponseCard } from "./components/QuizResponseCard";

export function RespondQuiz() {
  const [quiz, setQuiz] = useState<ICompleteQuizQuestionDTO | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: string]: string;
  }>({});

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trainingIdQueryParam = queryParams.get("trainingId");

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const getQuizByTraining = useCallback(async () => {
    try {
      setIsLoading(true);
      if (trainingIdQueryParam) {
        const quiz =
          await quizzesRepository.getQuizByTraining(trainingIdQueryParam);
        setQuiz(quiz);
        console.log(quiz);
        return quiz;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [quizzesRepository, setIsLoading, trainingIdQueryParam]);

  useEffect(() => {
    getQuizByTraining();
  }, [getQuizByTraining]);

  const { error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizByTraining,
  });

  const handleSelectOption = (questionId: string, optionId: string) => {
    setSelectedOptions((prevSelected) => ({
      ...prevSelected,
      [questionId]: optionId,
    }));
  };

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8 md:pl-[80px]">
      <div className="mr-3 mb-4">
        <ScreenTitleIcon screenTitle="Questionários" iconName="edit" />
        <Subtitle
          content={`Você está realizando o questionário do treinamento  "${quiz?.training.name}"`}
          className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
        />
      </div>

      {isLoading ? (
        <div className="w-full mt-[10vh]">
          <Loading color={PRIMARY_COLOR} />
        </div>
      ) : error ? (
        <div className="w-full flex flex-row justify-center">
          <img
            src={theme === "light" ? error_warning : error_warning_dark}
            alt="ps_trainings"
          />
        </div>
      ) : (
        quiz && (
          <Carousel
            className="bg-white dark:bg-slate-700 rounded-md min-h-[480px] sm:min-h-[320px]"
            prevArrow={({ handlePrev, firstIndex }) => (
              <button
                className="!absolute bottom-[16px] left-[16px] text-gray-800 dark:text-gray-200 text-[11px] md:text-[14px] p-1 px-2 md:px-4 border-2 border-gray-800 dark:border-gray-200 rounded-md disabled:opacity-[0.5]"
                onClick={handlePrev}
                disabled={firstIndex}
              >
                Anterior
              </button>
            )}
            nextArrow={({ handleNext, lastIndex }) => (
              <button
                className="!absolute bottom-[16px] right-[16px] text-gray-800 dark:text-gray-200 text-[11px] md:text-[14px] p-1 px-2 md:px-4 border-2 border-gray-800 dark:border-gray-200 rounded-md disabled:opacity-[0.5]"
                onClick={handleNext}
                disabled={lastIndex}
              >
                Próximo
              </button>
            )}
            navigation={({ activeIndex, length }) => (
              <div className="absolute bottom-[80px] md:bottom-4 left-2/4 z-50 flex -translate-x-2/4 gap-2 w-full ml-4 md:w-[240px] md:ml-0">
                <span className="text-gray-800 dark:text-gray-200 text-[10px] md:text-[12px]">
                  Exibindo {activeIndex + 1} de {length} perguntas
                </span>
              </div>
            )}
          >
            {quiz.questions.map((question) => (
              <QuizResponseCard
                key={question.id}
                questionId={question.id}
                options={question.options!}
                question={question.content}
                selectedOptionId={selectedOptions[question.id]}
                onSelectOption={(optionId) =>
                  handleSelectOption(question.id, optionId)
                }
              />
            ))}
          </Carousel>
        )
      )}
      <div className="w-full mt-4">
        <Button title="Finalizar questionário" />
      </div>
    </div>
  );
}
