import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { IQuizResponseDTO } from "@/repositories/dtos/QuizResponseDTO";
import { IQuizResultDTO } from "@/repositories/dtos/QuizResultDTO";
import { QuizResponsesRepository } from "@/repositories/quizResponsesRepository";
import { QuizResultsRepository } from "@/repositories/quizResultsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError } from "@/utils/alerts";
import { Carousel } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizResultCard } from "./components/QuizResultCard";

export default function CheckQuizResponse() {
  const [quizResponses, setQuizResponses] = useState<IQuizResponseDTO[]>([]);
  const [quizResult, setQuizResult] = useState<IQuizResultDTO | null>(null);

  const MIN_QUIZ_APPROVAL_PERCENTAGE = 50;

  const quizResponsesRepository = useMemo(() => {
    return new QuizResponsesRepository();
  }, []);

  const quizResultsRepository = useMemo(() => {
    return new QuizResultsRepository();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizAttemptIdQueryParam = queryParams.get("quizAttemptId");

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

  const navigate = useNavigate();

  const getQuizResult = useCallback(async () => {
    try {
      setIsLoading(true);
      if (quizAttemptIdQueryParam) {
        const quizResult =
          await quizResultsRepository.getQuizResultByUserAndQuizAttempt({
            quiz_attempt_id: quizAttemptIdQueryParam,
            user_id: user.id,
          });
        setQuizResult(quizResult);
      }
    } catch (error) {
      console.log(error);
      showAlertError(
        "Houve um erro ao consultar resultado. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoading(false);
    }
  }, [quizAttemptIdQueryParam, quizResultsRepository, setIsLoading, user.id]);

  useEffect(() => {
    getQuizResult();
  }, [getQuizResult]);

  const getQuizResponses = useCallback(async () => {
    try {
      setIsLoading(true);
      if (quizAttemptIdQueryParam) {
        const quizResponses =
          await quizResponsesRepository.listQuizResponsesByAttempt(
            quizAttemptIdQueryParam
          );
        setQuizResponses(quizResponses);
        console.log(quizResponses);
        return quizResponses;
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [quizResponsesRepository, setIsLoading, quizAttemptIdQueryParam]);

  useEffect(() => {
    getQuizResponses();
  }, [getQuizResponses]);

  const { error } = useQuery({
    queryKey: ["quizzes"],
    queryFn: getQuizResponses,
  });

  const handleRetryQuiz = useCallback(async () => {
    try {
      if (
        quizResult &&
        quizResponses &&
        quizResponses[0] &&
        quizResponses[0].quiz_attempt
      ) {
        await quizResultsRepository.deleteQuizResult(quizResult.id);
        await quizResponsesRepository.deleteManyQuizzesResponsesByQuizAttempt(
          quizResponses[0].quiz_attempt.id
        );
        if (quizResponses[0].quiz_attempt.quiz) {
          navigate(
            `/dashboard/responder-questionario?trainingId=${quizResponses[0].quiz_attempt.quiz.training_id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
      showAlertError(
        "Houve um erro ao tentar refazer questionário. Por favor, tente novamente mais tarde."
      );
    }
  }, [
    navigate,
    quizResponses,
    quizResponsesRepository,
    quizResult,
    quizResultsRepository,
  ]);

  const handleSeeCertificates = () =>
    navigate("/dashboard/acessar-meus-certificados");

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8 md:pl-[80px]">
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
        quizResponses &&
        quizResponses[0] &&
        quizResponses[0].quiz_attempt &&
        quizResponses[0].quiz_attempt.quiz &&
        quizResponses[0].quiz_attempt.quiz.training &&
        quizResponses[0].quiz_attempt.quiz.training.name && (
          <>
            <div className="mr-3 mb-4">
              <ScreenTitleIcon screenTitle="Questionários" iconName="edit" />
              {
                <Subtitle
                  content={`Você está conferindo o questionário do treinamento  "${quizResponses[0].quiz_attempt.quiz.training.name}"`}
                  className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
                />
              }
            </div>
            <Carousel
              className="bg-white dark:bg-slate-700 rounded-md min-h-[280px] sm:min-h-[240px]"
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
              {quizResponses.map((quizResult) => (
                <QuizResultCard
                  key={quizResult.id}
                  questionId={quizResult.id}
                  question={quizResult.question.content}
                  selectedOptionContent={quizResult.selected_option.content}
                  correctOptionContent={quizResult.correct_option.content}
                />
              ))}
            </Carousel>
            <div className="w-full mt-4">
              {quizResult &&
              quizResult.total_correct_questions_percentage <
                MIN_QUIZ_APPROVAL_PERCENTAGE ? (
                <Button
                  title="Refazer questionário"
                  onClick={handleRetryQuiz}
                />
              ) : (
                <Button
                  title="Acessar meus certificados"
                  onClick={handleSeeCertificates}
                />
              )}
            </div>
          </>
        )
      )}
    </div>
  );
}
