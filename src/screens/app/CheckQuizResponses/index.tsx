import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CompaniesRepository } from "@/repositories/companiesRepository";
import { TPlan } from "@/repositories/dtos/CompanyDTO";
import { IExplainQuestionDTO } from "@/repositories/dtos/QuizQuiestionDTO";
import { IQuizResponseDTO } from "@/repositories/dtos/QuizResponseDTO";
import { IQuizResultDTO } from "@/repositories/dtos/QuizResultDTO";
import { QuizResponsesRepository } from "@/repositories/quizResponsesRepository";
import { QuizResultsRepository } from "@/repositories/quizResultsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertError } from "@/utils/alerts";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { QuizResultCard } from "./components/QuizResultCard";

export default function CheckQuizResponse() {
  const [quizResponses, setQuizResponses] = useState<IQuizResponseDTO[]>([]);
  const [quizResult, setQuizResult] = useState<IQuizResultDTO | null>(null);
  const [companyPlan, setCompanyPlan] = useState<TPlan | null>(null);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
  const [requestedAIQuestions, setRequestedAIQuestions] = useState<string[]>(
    []
  );
  const [isLoadingAiResponse, setIsLoadingAiResponse] = useState(false);

  const MIN_QUIZ_APPROVAL_PERCENTAGE = 50;

  const quizResponsesRepository = useMemo(() => {
    return new QuizResponsesRepository();
  }, []);

  const quizResultsRepository = useMemo(() => {
    return new QuizResultsRepository();
  }, []);

  const companiesRepository = useMemo(() => {
    return new CompaniesRepository();
  }, []);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const quizAttemptIdQueryParam = queryParams.get("quizAttemptId");

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const { user } = useAuthenticationStore();

  const navigate = useNavigate();

  const getCompany = useCallback(async () => {
    try {
      setIsLoading(true);
      const company = await companiesRepository.getCompany(user.companyId);
      if (company && company.current_plan) {
        setCompanyPlan(company.current_plan);
      }
    } catch (error) {
      console.log("Error getting company plan: ", error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, companiesRepository, user.companyId]);

  useEffect(() => {
    getCompany();
  }, [getCompany]);

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

  const requestAIExplanation = async (data: IExplainQuestionDTO) => {
    try {
      setSelectedQuestionId(data.questionId!);
      setIsLoadingAiResponse(true);
      if (data.questionId) {
        setRequestedAIQuestions([...requestedAIQuestions, data.questionId]);
      }
      const response = await quizResultsRepository.explainQuestion(data);
      const explanation = response.choices[0].message.content;
      const quizWithExplanation = quizResponses.find(
        (obj) => obj.id === data.questionId
      );
      if (quizWithExplanation) {
        setQuizResponses(
          quizResponses.map((response) =>
            response.id === data.questionId
              ? { ...response, ai_response: explanation }
              : response
          )
        );
      }
    } catch (error) {
      console.log("Error requesting AI explanation: ", error);
      showAlertError(
        "Houve um erro ao solicitar explicação da IA. Por favor, tente novamente mais tarde."
      );
    } finally {
      setIsLoadingAiResponse(false);
    }
  };

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
            <div className="flex flex-col w-full ">
              <div className="mr-3 mb-4 flex flex-col md:flex-row md:items-center md:justify-between 0">
                <ScreenTitleIcon screenTitle="Questionários" iconName="edit" />
                <div className="w-60 mt-4 md:mt-0">
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
              </div>
              {
                <Subtitle
                  content={`Você está conferindo o questionário do treinamento  "${quizResponses[0].quiz_attempt.quiz.training.name}". Este questionário contém ${quizResponses.length} perguntas.`}
                  className="mt-2 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty"
                />
              }
            </div>

            <div className="w-full max-h-[60vh] overflow-y-auto">
              {companyPlan &&
                quizResponses.map((quizResult) => (
                  <div key={quizResult.id}>
                    <QuizResultCard
                      questionId={quizResult.id}
                      requestedAiQuestions={requestedAIQuestions}
                      question={quizResult.question.content}
                      selectedOptionContent={quizResult.selected_option.content}
                      correctOptionContent={quizResult.correct_option.content}
                      onRequestAiExplanation={() =>
                        requestAIExplanation({
                          question: quizResult.question.content,
                          selectedOptionContent:
                            quizResult.selected_option.content,
                          correctOptionContent:
                            quizResult.correct_option.content,
                          questionId: quizResult.id,
                        })
                      }
                      aiExplanation={quizResult.ai_response}
                      companyPlan={companyPlan}
                      isLoading={
                        isLoadingAiResponse &&
                        selectedQuestionId === quizResult.id
                      }
                    />
                  </div>
                ))}
            </div>
          </>
        )
      )}
    </div>
  );
}
