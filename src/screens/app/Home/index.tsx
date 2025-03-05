import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/infocard_placeholder.svg";
import GreetUser from "@/components/miscellaneous/GreetUser";
import { Loading } from "@/components/miscellaneous/Loading";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { Title } from "@/components/typography/Title";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { QuizResultsRepository } from "@/repositories/quizResultsRepository";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { TrainingsRepository } from "@/repositories/trainingsRepository";
import { WatchedClassesRepository } from "@/repositories/watchedClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { useQueries } from "@tanstack/react-query";
import Feather from "feather-icons-react";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MetricsCard from "./components/MetricsCard";
import { ReturnLastClassCard } from "./components/ReturnLastClassCard";

export default function Home() {
  const [hasNoWatchedClasses, setHasNoWatchedClasses] = useState(false);

  const [watchedClassTrainingName, setWatchedClassTrainingName] = useState("");
  const [lastWatchedClassInfo, setLastWatchedClassInfo] =
    useState<IWatchedClassDTO | null>(null);

  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const watchedClassesRepository = useMemo(() => {
    return new WatchedClassesRepository();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepository();
  }, []);

  const quizzesResultsRepository = useMemo(() => {
    return new QuizResultsRepository();
  }, []);

  const getLastClassInfo = useCallback(async () => {
    try {
      const watchedClasses =
        await watchedClassesRepository.listWatchedClassesByUser(user.id);

      if (!watchedClasses || watchedClasses.length === 0) {
        setHasNoWatchedClasses(true);
        return [];
      }

      const lastWatchedClassInfo = watchedClasses
        .filter((w) => !w.completely_watched)
        .sort((a, b) => {
          // Convert watchedAt to Date objects for comparison
          const dateA = new Date(a.watchedAt);
          const dateB = new Date(b.watchedAt);
          return dateB.getTime() - dateA.getTime(); // Sort in descending order
        })[0];

      if (lastWatchedClassInfo) {
        const trainingName = await trainingsRepository.getTrainingById(
          lastWatchedClassInfo.training_id
        );
        setWatchedClassTrainingName(trainingName.name);
        setLastWatchedClassInfo(lastWatchedClassInfo);
        return watchedClasses;
      }

      return watchedClasses;
    } catch (error) {
      console.log(error);
      console.log("Error at trying to list watched classes: ', error");
    }
  }, [trainingsRepository, user.id, watchedClassesRepository]);

  const getAllTrainingMetrics = useCallback(async () => {
    try {
      const allTrainingMetrics =
        await trainingMetricsRepository.listTrainingMetricsByUser(user.id);
      return allTrainingMetrics;
    } catch (error) {
      console.log("Error at trying to list training metrics: ', error");
    }
  }, [trainingMetricsRepository, user.id]);

  const getTrainings = useCallback(async () => {
    try {
      const trainings = await trainingsRepository.listTrainings(user.companyId);
      return trainings;
    } catch (error) {
      console.log("Error at trying to list trainings: ", error);
    }
  }, [trainingsRepository, user.companyId]);

  const getCertificatesByUser = useCallback(async () => {
    try {
      const certificates = await certificatesRepository.listCertificatesByUser(
        user.id
      );
      return certificates;
    } catch (error) {
      console.log("Error at trying to list certificates by user: ", error);
    }
  }, [certificatesRepository, user.id]);

  const getQuizzesResults = useCallback(async () => {
    try {
      const quizzes = await quizzesResultsRepository.listQuizzesResultsByUser(
        user.id
      );
      return quizzes;
    } catch (error) {
      console.log("Error at trying to list quizzes results by user: ", error);
    }
  }, [quizzesResultsRepository, user.id]);

  const queries = useQueries({
    queries: [
      { queryKey: ["trainings"], queryFn: getTrainings },
      { queryKey: ["certificates"], queryFn: getCertificatesByUser },
      { queryKey: ["quizzes-results"], queryFn: getQuizzesResults },
      { queryKey: ["last-class-info"], queryFn: getLastClassInfo },
      {
        queryKey: ["get-all-training-metrics"],
        queryFn: getAllTrainingMetrics,
      },
    ],
  });

  const [
    trainingsQuery,
    certificatesByUserQuery,
    getQuizzesResultsQuery,
    lastClassInfoQuery,
    getAllTrainingMetricsQuery,
  ] = queries;

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  const totalTrainings = trainingsQuery.data?.length || 0;

  const totalCertificates = certificatesByUserQuery.data?.length || 0;

  const totalRepliedQuizzes = getQuizzesResultsQuery.data?.length || 0;

  const allTrainingMetrics = getAllTrainingMetricsQuery.data || [];

  const watchedClasses = useMemo(() => {
    return lastClassInfoQuery.data || [];
  }, [lastClassInfoQuery.data]);

  const allCompletedTrainings = allTrainingMetrics.filter(
    (t) => t.total_watched_classes_percentage === 100
  );

  const dashboardMetrics = [
    {
      title: "Treinamentos disponíveis",
      iconName: "book-open",
      metric: totalTrainings,
      link: "/dashboard/acessar-meus-treinamentos",
    },
    {
      title: "Questionários respondidos",
      iconName: "edit",
      metric: totalRepliedQuizzes,
      link: "/dashboard/acessar-meus-questionarios",
    },
    {
      title: "Certificados emitidos",
      iconName: "star",
      metric: totalCertificates,
      link: "/dashboard/acessar-meus-certificados",
    },
  ];

  const handleContinueLastClass = (trainingId: string, classId: string) => {
    navigate(
      `/dashboard/assistir-treinamento?trainingId=${trainingId}&classId=${classId}`
    );
  };

  const handleSeeCertificate = () => {
    navigate("/dashboard/acessar-meus-certificados");
  };

  const handleSeeTraining = async (
    trainingId: string,
    lastWatchedClassId?: string
  ) => {
    const training = await trainingsRepository.getTrainingById(trainingId);
    const firstTrainingVideoClass = training.video_classes?.slice(0, 1)[0];
    if (lastWatchedClassId) {
      navigate(
        `/dashboard/assistir-treinamento?trainingId=${trainingId}&classId=${lastWatchedClassId}`
      );
    } else {
      navigate(
        `/dashboard/assistir-treinamento?trainingId=${trainingId}&classId=${firstTrainingVideoClass!.id}`
      );
    }
  };

  return (
    <main className="w-full flex flex-1  flex-col p-4 mt-4">
      <div className=" w-full flex flex-col md:ml-4 ">
        <div className="flex flex-col mb-4 mx-auto md:mx-[80px] w-[80%]">
          <GreetUser userName="John Doe" />
          {isLoading ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <Loading color={PRIMARY_COLOR} />
            </div>
          ) : hasError ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <img
                src={theme === "light" ? error_warning : error_warning_dark}
                alt="treinahub"
                width={240}
              />
            </div>
          ) : (
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-full">
                <div className="flex w-full">
                  <Feather
                    icon="bar-chart-2"
                    className="w-10 h-10 mr-2 text-black dark:text-white"
                  />
                  <Title
                    content="Resumo do seu progresso"
                    className="m-2 mb-4 text-black dark:text-white text-lg md:text-xl font-bold font-secondary"
                  />
                </div>
              </div>
              <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {dashboardMetrics.map((metric) => (
                  <MetricsCard
                    key={metric.title}
                    title={metric.title}
                    iconName={metric.iconName}
                    metric={metric.metric}
                    link={metric.link}
                  />
                ))}
              </div>
              {watchedClasses && lastWatchedClassInfo && (
                <div className="flex flex-col w-full mb-6">
                  <span className="text-gray-800 dark:text-gray-50 text-sm md:text-[15px] mb-2">
                    Continue de onde parou
                  </span>
                  <ReturnLastClassCard
                    handleContinueLastClass={handleContinueLastClass}
                    lastWatchedClassInfo={lastWatchedClassInfo}
                    trainingName={watchedClassTrainingName}
                  />
                </div>
              )}
              <div className="flex flex-col w-full pl-1">
                {!hasNoWatchedClasses &&
                  allCompletedTrainings &&
                  allCompletedTrainings.length > 0 && (
                    <div className="flex flex-col w-full">
                      <Subtitle
                        content="Treinamentos realizados"
                        className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
                      />
                      <div className="w-full flex flex-col md:flex-row items-center">
                        {allCompletedTrainings.map((t) => (
                          <TrainingInfoCard
                            trainingId={t.training.id}
                            lastClassDuration={""}
                            key={t.training.id}
                            showSeeCertificateButton={true}
                            watchedClasses={watchedClasses}
                            cover_url={
                              t.training.cover_url
                                ? t.training.cover_url
                                : infocard_placeholder
                            }
                            training={t.training.name}
                            description={t.training.description}
                            lastClassName={
                              t.training.last_watched_class_name ||
                              "Nenhuma aula foi assistida"
                            }
                            totalCourseClasses={t.total_training_classes}
                            totalWatchedClasses={t.total_watched_classes || 0}
                            userStartedTraining={
                              !!t.training.training_metrics?.find(
                                (t) => t.user_id === user.id
                              )
                            }
                            onSeeTraining={() =>
                              handleSeeTraining(
                                t.training.id,
                                t.training.last_watched_class_id
                              )
                            }
                            onSeeCertificate={handleSeeCertificate}
                          />
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
