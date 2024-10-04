import { PRIMARY_COLOR } from "@/appConstants/index";
import empty_box_animation from "@/assets/empty_box_animation.json";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { IQuizResultDTO } from "@/repositories/dtos/QuizResultDTO";
import { QuizResultsRepository } from "@/repositories/quizResultsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";

import { Button } from "@/components/buttons/Button";
import { QuizResponsesRepository } from "@/repositories/quizResponsesRepository";
import { showAlertError } from "@/utils/alerts";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";
import { QuizBriefResultCard } from "./components/QuizBriefResultCard";

export function Quizzes() {
  const [quizzesResults, setQuizzesResults] = useState<IQuizResultDTO[]>([]);
  const [selectedQuizResult, setSelectedQuizResult] =
    useState<IQuizResultDTO | null>(null);

  const navigate = useNavigate();

  const { user } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const quizResultsRepository = useMemo(() => {
    return new QuizResultsRepository();
  }, []);

  const quizResponsesRepository = useMemo(() => {
    return new QuizResponsesRepository();
  }, []);

  const getUserQuizResults = useCallback(async () => {
    try {
      setIsLoading(true);
      const quizzesResults =
        await quizResultsRepository.listQuizzesResultsByUser(user.id);
      setQuizzesResults(quizzesResults);
      return quizzesResults;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [quizResultsRepository, setIsLoading, user.id]);

  useEffect(() => {
    getUserQuizResults();
  }, [getUserQuizResults]);

  const { error } = useQuery({
    queryKey: ["quizzes-results"],
    queryFn: getUserQuizResults,
  });

  const handleSelectQuiz = useCallback((quizResult: IQuizResultDTO) => {
    setSelectedQuizResult(quizResult);
  }, []);

  const handleSeeTrainings = () => {
    navigate("/dashboard/acessar-meus-treinamentos");
  };
  const handleCheckQuizResponse = () => {
    if (selectedQuizResult) {
      navigate(
        `/dashboard/revisar-questionario?quizAttemptId=${selectedQuizResult.quiz_attempt_id}`
      );
    }
    return;
  };

  const handleRetryQuiz = useCallback(async () => {
    try {
      if (
        selectedQuizResult &&
        selectedQuizResult.quiz &&
        selectedQuizResult.quiz.training_id
      ) {
        await quizResultsRepository.deleteQuizResult(selectedQuizResult.id);
        await quizResponsesRepository.deleteManyQuizzesResponsesByQuizAttempt(
          selectedQuizResult.quiz_attempt_id
        );
        navigate(
          `/dashboard/responder-questionario?trainingId=${selectedQuizResult.quiz.training_id}`
        );
      }
    } catch (error) {
      console.log(error);
      showAlertError(
        "Houve um erro ao tentar refazer questionário. Por favor, tente novamente mais tarde."
      );
    }
  }, [
    navigate,
    quizResponsesRepository,
    quizResultsRepository,
    selectedQuizResult,
  ]);

  const animationOptions = {
    animationData: empty_box_animation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8 md:pl-[80px]">
      <div className="mr-3 mb-4">
        <ScreenTitleIcon screenTitle="Questionários" iconName="edit" />
        <Subtitle
          content="Consulte aqui seus questionários disponíveis. Refaça questionários se necessário."
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
      ) : quizzesResults.length === 0 ? (
        <div className="w-full flex flex-col items-center">
          <div className="w-full flex flex-col items-start relative max-w-[480px]">
            <Lottie
              speed={0.25}
              height={200}
              width={200}
              options={animationOptions}
            />
            <Subtitle
              content="Seus questionário estarão disponíveis a medida que você concluir seus treinamentos."
              className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
            />
            <Subtitle
              content="Você não possui nenhum questionário disponível no momento."
              className="mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
            />
            <div className="w-full mt-5">
              <Button
                title="Acessar meus treinamentos"
                onClick={handleSeeTrainings}
              />
            </div>
          </div>
        </div>
      ) : (
        quizzesResults.map((quiz) => (
          <QuizBriefResultCard
            key={quiz.id}
            totalCorrectQuestions={quiz.total_correct_questions}
            totalQuestions={quiz.total_quiz_questions}
            trainingName={
              quiz.quiz && quiz.quiz.training ? quiz.quiz.training.name : ""
            }
            onRetryQuiz={handleRetryQuiz}
            onSeeQuizResult={handleCheckQuizResponse}
            onSelectQuiz={() => handleSelectQuiz(quiz)}
          />
        ))
      )}
    </div>
  );
}
