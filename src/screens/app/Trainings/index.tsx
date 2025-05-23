import { PRIMARY_COLOR } from "@/appConstants/index";
import empty_box_animation from "@/assets/empty_box_animation.json";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/infocard_placeholder.svg";
import { Button } from "@/components/buttons/Button";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { ICreateTrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { TrainingsRepository } from "@/repositories/trainingsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { WatchedClassesRepository } from "@/repositories/watchedClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { secondsToFullTimeString } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Lottie from "react-lottie";
import { useNavigate } from "react-router-dom";

export default function Trainings() {
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const [watchedClasses, setWatchedClasses] = useState<IWatchedClassDTO[]>([]);
  const [certificatesStatus, setCertificatesStatus] = useState<{
    [key: string]: boolean;
  }>({});

  const navigate = useNavigate();

  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();

  const handleSeeCertificate = () => {
    navigate("/dashboard/acessar-meus-certificados");
  };

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepository();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const watchedClassesRepository = useMemo(() => {
    return new WatchedClassesRepository();
  }, []);

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const getTrainings = useCallback(async () => {
    try {
      setIsLoading(true);
      const trainings = await trainingsRepository.listTrainings(user.companyId);
      const filteredTrainings = trainings.filter(
        (training) =>
          training.video_classes &&
          training.video_classes?.length > 0 &&
          training.quizes &&
          training.quizes.some(
            (quiz) =>
              quiz.questions &&
              quiz.questions.some(
                (question) =>
                  question.options &&
                  question.options?.length > 0 &&
                  question.options.some((option) => option.is_correct)
              )
          )
      );
      setTrainings(filteredTrainings);
      return filteredTrainings;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, trainingsRepository, user.companyId]);

  const getLastWatchedClassesByTraining = useCallback(
    async (trainingId: string) => {
      try {
        setIsLoading(true);
        const watchedClasses =
          await watchedClassesRepository.listWatchedClassesByUserAndTraining({
            user_id: user.id,
            training_id: trainingId,
          });

        setWatchedClasses(watchedClasses);

        const lastWatchedClass = watchedClasses
          .filter((wc) => wc.training_id === trainingId)
          .slice(-1)[0];

        const trainingVideoClasses =
          await videoClassesRepository.listVideoClassesByTraining(trainingId);

        const lastWatchedClassIndex = trainingVideoClasses.findIndex(
          (wc) => wc.id === lastWatchedClass?.videoclass_id
        );

        const nextClassToWatch =
          trainingVideoClasses[lastWatchedClassIndex + 1];

        return nextClassToWatch;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, user.id, videoClassesRepository, watchedClassesRepository]
  );

  const checkIfUserHasCertificate = useCallback(
    async (trainingId: string) => {
      try {
        setIsLoading(true);
        const hasCertificate =
          await certificatesRepository.getCertificateByUserAndTraining({
            user_id: user.id,
            training_id: trainingId,
          });
        if (hasCertificate) {
          return true;
        }
        return false;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [certificatesRepository, setIsLoading, user.id]
  );

  useEffect(() => {
    const fetchTrainingsWithLastWatchedClass = async () => {
      const trainings = await getTrainings();

      if (trainings) {
        const trainingsWithLastWatchedClass = await Promise.all(
          trainings.map(async (training) => {
            const lastWatchedClass = await getLastWatchedClassesByTraining(
              training.id
            );
            const hasCertificate = await checkIfUserHasCertificate(training.id);
            setCertificatesStatus(
              (prevStatus) =>
                ({
                  ...prevStatus,
                  [training.id]: hasCertificate,
                }) as never
            );
            return {
              ...training,
              last_watched_class_duration: lastWatchedClass?.duration ?? null,
              last_watched_class_name: lastWatchedClass?.name ?? null,
              last_watched_class_id: lastWatchedClass?.id ?? null,
            };
          })
        );
        trainingsWithLastWatchedClass.filter((training) => {
          training.video_classes &&
            training.video_classes?.length > 0 &&
            training.quizes &&
            training.quizes.length > 0 &&
            training.quizes.some(
              (quiz) =>
                quiz.questions &&
                quiz.questions.some(
                  (question) =>
                    question.options &&
                    question.options?.length > 0 &&
                    question.options.some((option) => option.is_correct)
                )
            );
        });
        setTrainings(trainingsWithLastWatchedClass as never);
      }
    };

    fetchTrainingsWithLastWatchedClass();
  }, [
    checkIfUserHasCertificate,
    getLastWatchedClassesByTraining,
    getTrainings,
  ]);

  const { error, isLoading: loading } = useQuery({
    queryKey: ["training-metrics"],
    queryFn: getTrainings,
  });

  const handleCreateTrainingMetrics = useCallback(
    async (data: ICreateTrainingMetricsDTO) => {
      try {
        await trainingMetricsRepository.createTrainingMetrics(data);
        await getTrainings();
      } catch (error) {
        console.log(error);
      }
    },
    [getTrainings, trainingMetricsRepository]
  );

  const animationOptions = {
    animationData: empty_box_animation,
    loop: true,
    autoplay: true,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  const handleContactSupport = () => {
    navigate("/dashboard/acessar-suporte");
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
    <div className="w-full lg:w-[95%] flex flex-col p-8">
      <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[80px] w-[80%]">
        <div className="flex flex-col w-full">
          <ScreenTitleIcon
            iconName="play-circle"
            screenTitle="Meus treinamentos"
          />
          <Subtitle
            content="Aqui estão todos os seus treinamentos disponíveis"
            className="mt-6 mb-4 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
          />
          {loading || isLoading ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <Loading color={PRIMARY_COLOR} />
            </div>
          ) : error ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <img
                src={theme === "light" ? error_warning : error_warning_dark}
                alt="treinahub"
                width={240}
              />
            </div>
          ) : trainings.length === 0 ? (
            <div className="w-full flex flex-col items-center">
              <div className="w-full flex flex-col items-start relative max-w-[480px]">
                <Lottie
                  speed={0.25}
                  height={200}
                  width={200}
                  options={animationOptions}
                />
                <span className="mt-3 text-gray-600 dark:text-gray-300 text-sm md:text-[15px] text-center">
                  Ainda não há treinamentos disponíveis. Contate seu
                  administrador para se informar sobre a disponibilidade dos
                  treinamentos.
                </span>
                <div className="w-full mt-5">
                  <Button
                    title="Acessar suporte"
                    onClick={handleContactSupport}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {trainings.map((training) =>
                certificatesStatus[training.id] ? (
                  <TrainingInfoCard
                    key={training.id}
                    trainingId={training.id}
                    showSeeCertificateButton
                    watchedClasses={watchedClasses}
                    cover_url={training.cover_url || infocard_placeholder}
                    training={training.name}
                    description={training.description}
                    lastClassName={
                      training.last_watched_class_name ||
                      "Nenhuma aula foi assistida"
                    }
                    lastClassDuration={secondsToFullTimeString(
                      training.last_watched_class_duration || 0
                    )}
                    totalCourseClasses={training.video_classes?.length || 0}
                    totalWatchedClasses={
                      training.training_metrics &&
                      training.training_metrics.find(
                        (t) => t.user_id === user.id
                      ) &&
                      training.training_metrics.find(
                        (t) => t.user_id === user.id
                      )?.total_watched_classes
                        ? training.training_metrics[0].total_watched_classes
                        : 0
                    }
                    userStartedTraining={
                      !!training.training_metrics?.find(
                        (t) => t.user_id === user.id
                      )
                    }
                    onSeeTraining={() =>
                      handleSeeTraining(
                        training.id,
                        training.last_watched_class_id
                      )
                    }
                    onSeeCertificate={handleSeeCertificate}
                    onStartTraining={() =>
                      handleCreateTrainingMetrics({
                        training_id: training.id,
                        user_id: user.id,
                      })
                    }
                  />
                ) : (
                  <TrainingInfoCard
                    key={training.id}
                    trainingId={training.id}
                    showSeeCertificateButton={false}
                    watchedClasses={watchedClasses}
                    cover_url={training.cover_url || infocard_placeholder}
                    training={training.name}
                    description={training.description}
                    lastClassName={
                      training.last_watched_class_name ||
                      "Nenhuma aula foi assistida"
                    }
                    lastClassDuration={secondsToFullTimeString(
                      training.last_watched_class_duration || 0
                    )}
                    totalCourseClasses={training.video_classes?.length || 0}
                    totalWatchedClasses={
                      training.training_metrics &&
                      training.training_metrics.find(
                        (t) => t.user_id === user.id
                      ) &&
                      training.training_metrics.find(
                        (t) => t.user_id === user.id
                      )?.total_watched_classes
                        ? training.training_metrics[0].total_watched_classes
                        : 0
                    }
                    userStartedTraining={
                      !!training.training_metrics?.find(
                        (t) => t.user_id === user.id
                      )
                    }
                    onSeeTraining={() =>
                      handleSeeTraining(
                        training.id,
                        training.last_watched_class_id
                      )
                    }
                    onSeeCertificate={handleSeeCertificate}
                    onStartTraining={() =>
                      handleCreateTrainingMetrics({
                        training_id: training.id,
                        user_id: user.id,
                      })
                    }
                  />
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row  w-full justify-center flex-wrap"></div>
    </div>
  );
}
