import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ICompleteQuizQuestionDTO } from "@/repositories/dtos/QuizDTO";
import { ICreateQuizResponseDTO } from "@/repositories/dtos/QuizResponseDTO";
import {
  ICreateQuizResultDTO,
  IQuizResultDTO,
} from "@/repositories/dtos/QuizResultDTO";
import { QuizResponsesRepository } from "@/repositories/quizResponsesRepository";
import { QuizResultsRepository } from "@/repositories/quizResultsRepository";
import { QuizzesRepository } from "@/repositories/quizzesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError, showAlertSuccess } from "@/utils/alerts";
import { Carousel } from "@material-tailwind/react";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { NegativeQuizResultModal } from "./components/NegativeQuizResultModal";
import { PositiveQuizResultModal } from "./components/PositiveQuizResultModal";
import { QuizResponseCard } from "./components/QuizResponseCard";

export function RespondQuiz() {
  const [quiz, setQuiz] = useState<ICompleteQuizQuestionDTO | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<{
    [questionId: string]: string;
  }>({});
  const [quizResult, setQuizResult] = useState<IQuizResultDTO | null>(null);
  const [positiveQuizResultModal, setPositiveQuizResultModal] = useState(false);
  const [negativeQuizResultModal, setNegativeQuizResultModal] = useState(false);

  const MIN_QUIZ_APPROVAL_PERCENTAGE = 50;

  const quizzesRepository = useMemo(() => {
    return new QuizzesRepository();
  }, []);

  const quizResponsesRepository = useMemo(() => {
    return new QuizResponsesRepository();
  }, []);

  const quizResultsRepository = useMemo(() => {
    return new QuizResultsRepository();
  }, []);

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const trainingIdQueryParam = queryParams.get("trainingId");

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

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

  const handleTogglePositiveQuizResultModal = useCallback(() => {
    setPositiveQuizResultModal(!positiveQuizResultModal);
  }, [positiveQuizResultModal]);

  const handleToggleNegativeQuizResultModal = useCallback(() => {
    setNegativeQuizResultModal(!negativeQuizResultModal);
  }, [negativeQuizResultModal]);

  const quizzesLength = quiz ? quiz.questions.length : 0;
  const selectedOptionsLength = Object.keys(selectedOptions).length;

  const handleRespondQuestion = useCallback(
    async (data: ICreateQuizResponseDTO) => {
      try {
        await quizResponsesRepository.createQuizResponse(data);
      } catch (error) {
        showAlertError(
          "Houve um erro ao computar resposta. Por favor, tente novamente mais tarde."
        );
        console.log(error);
      }
    },
    [quizResponsesRepository]
  );

  const generateCertificate = useCallback(async () => {
    try {
      if (quiz) {
        const userHasCertificate =
          await certificatesRepository.getCertificateByUserAndTraining({
            user_id: user.id,
            training_id: quiz.training.id,
          });

        if (!userHasCertificate) {
          await certificatesRepository.generateCertificate({
            user_id: user.id,
            training_id: quiz.training.id,
          });
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [certificatesRepository, quiz, user.id]);

  const handleFinishQuiz = useCallback(
    async (data: ICreateQuizResultDTO) => {
      try {
        setIsLoading(true);
        const quizResult = await quizResultsRepository.createQuizResult(data);
        setQuizResult(quizResult);
        showAlertSuccess("Questionário finalizado com sucesso!");
        if (quizResult) {
          if (
            quizResult.total_correct_questions_percentage >=
            MIN_QUIZ_APPROVAL_PERCENTAGE
          ) {
            await generateCertificate();
            handleTogglePositiveQuizResultModal();
          } else {
            handleToggleNegativeQuizResultModal();
          }
        }
        setSelectedOptions({});
      } catch (error) {
        console.log(error);
        showAlertError(
          "Houve um erro ao finalizar questionário. Por favor, tente novamente mais tarde."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      generateCertificate,
      handleToggleNegativeQuizResultModal,
      handleTogglePositiveQuizResultModal,
      quizResultsRepository,
      setIsLoading,
    ]
  );

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
            prevArrow={({ handlePrev, firstIndex, activeIndex }) => (
              <button
                className="!absolute bottom-[16px] left-[16px] text-gray-800 dark:text-gray-200 text-[11px] md:text-[14px] p-1 px-2 md:px-4 border-2 border-gray-800 dark:border-gray-200 rounded-md disabled:opacity-[0.5]"
                onClick={() => {
                  const data: ICreateQuizResponseDTO = {
                    question_id: quiz.questions[activeIndex].id,
                    quiz_attempt_id: quiz.quiz_attempts!.slice(-1)[0].id,
                    selected_option_id:
                      selectedOptions[quiz.questions[activeIndex].id],
                  };
                  handleRespondQuestion(data);
                  handlePrev();
                }}
                disabled={firstIndex}
              >
                Anterior
              </button>
            )}
            nextArrow={({ handleNext, activeIndex, lastIndex }) =>
              selectedOptionsLength < quizzesLength ? (
                <button
                  className="!absolute bottom-[16px] right-[16px] text-gray-800 dark:text-gray-200 text-[11px] md:text-[14px] p-1 px-2 md:px-4 border-2 border-gray-800 dark:border-gray-200 rounded-md disabled:opacity-[0.5]"
                  onClick={() => {
                    const data: ICreateQuizResponseDTO = {
                      question_id: quiz.questions[activeIndex].id,
                      quiz_attempt_id: quiz.quiz_attempts!.slice(-1)[0].id,
                      selected_option_id:
                        selectedOptions[quiz.questions[activeIndex].id],
                    };
                    handleRespondQuestion(data);
                    handleNext();
                  }}
                  disabled={lastIndex}
                >
                  Próximo
                </button>
              ) : (
                <button
                  className="!absolute bottom-[16px] right-[16px] text-gray-800 dark:text-gray-200 text-[11px] md:text-[14px] p-1 px-2 md:px-4 border-2 border-gray-800 dark:border-gray-200 rounded-md disabled:opacity-[0.5]"
                  onClick={async () => {
                    const dataCreteQuizResponse: ICreateQuizResponseDTO = {
                      question_id: quiz.questions[activeIndex].id,
                      quiz_attempt_id: quiz.quiz_attempts!.slice(-1)[0].id,
                      selected_option_id:
                        selectedOptions[quiz.questions[activeIndex].id],
                    };
                    const dataCreateQuizResult: ICreateQuizResultDTO = {
                      user_id: user.id,
                      quiz_id: quiz.id,
                      quiz_attempt_id: quiz.quiz_attempts!.slice(-1)[0].id,
                    };
                    await handleRespondQuestion(dataCreteQuizResponse);
                    await handleFinishQuiz(dataCreateQuizResult);
                  }}
                  disabled={isLoading}
                >
                  Finalizar e enviar
                </button>
              )
            }
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
      <PositiveQuizResultModal
        isOpen={positiveQuizResultModal}
        onCheckQuizResponses={() => console.log("Check quiz responses")}
        onRequestClose={handleTogglePositiveQuizResultModal}
        totalCorrectQuestions={
          quizResult ? quizResult.total_correct_questions : 0
        }
        totalQuestions={quizzesLength}
        trainingName={quiz?.training ? quiz.training.name : ""}
      />
      <NegativeQuizResultModal
        isOpen={negativeQuizResultModal}
        onCheckQuizResponses={() => console.log("Check quiz responses")}
        onRequestClose={handleToggleNegativeQuizResultModal}
        onRetryQuiz={() => console.log("Retry quiz")}
        totalCorrectQuestions={
          quizResult ? quizResult.total_correct_questions : 0
        }
        totalQuestions={quizzesLength}
        trainingName={quiz?.training ? quiz.training.name : ""}
      />
    </div>
  );
}
