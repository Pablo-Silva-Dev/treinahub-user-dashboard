import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/infocard_placeholder.svg";
import GreetUser from "@/components/miscellaneous/GreetUser";
import { ImageCardButton } from "@/components/miscellaneous/ImageCardButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ITrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { IVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { WatchedClassesRepository } from "@/repositories/watchedClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { secondsToFullTimeString } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [hasNoWatchedClasses, setHasNoWatchedClasses] = useState(false);
  const [userHasCertificateForTraining, setUserHasCertificateForTraining] =
    useState(false);
  const [watchedClasses, setWatchedClasses] = useState<IWatchedClassDTO[]>([]);

  const { user } = useAuthenticationStore();
  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const watchedClassesRepository = useMemo(() => {
    return new WatchedClassesRepository();
  }, []);

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

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

  const getCompleteInfo = useCallback(async () => {
    try {
      const watchedClasses =
        await watchedClassesRepository.listWatchedClassesByUser(user.id);
      setWatchedClasses(watchedClasses);
      const lastWatchedClass = watchedClasses.slice(-1)[0];

      if (!watchedClasses || watchedClasses.length === 0) {
        setHasNoWatchedClasses(true);
        return null;
      }

      const lastWatchedClassInfo =
        await videoClassesRepository.getVideoClassById(
          lastWatchedClass.videoclass_id
        );

      if (!lastWatchedClassInfo) return null;

      const trainingMetrics =
        await trainingMetricsRepository.getTrainingMetricsByUserAndTraining({
          user_id: user.id,
          training_id: lastWatchedClassInfo.training_id,
        });

      const userHasCertificate = await checkIfUserHasCertificate(
        trainingMetrics.training.id
      );
      if (userHasCertificate) {
        setUserHasCertificateForTraining(true);
      }

      if (!trainingMetrics) return null;

      return { lastWatchedClassInfo, trainingMetrics };
    } catch (error) {
      console.log(error);
    }
  }, [
    checkIfUserHasCertificate,
    trainingMetricsRepository,
    user.id,
    videoClassesRepository,
    watchedClassesRepository,
  ]);

  useEffect(() => {
    getCompleteInfo();
  }, [getCompleteInfo]);

  const {
    data,
    error: hasError,
    isLoading: loading,
  } = useQuery({
    queryKey: ["complete-info"],
    queryFn: getCompleteInfo,
    staleTime: 1000 * 60, // 1 minute,
  });

  const lastWatchedClassInfo: IVideoClassDTO | undefined =
    data?.lastWatchedClassInfo;
  const trainingMetrics: ITrainingMetricsDTO | undefined =
    data?.trainingMetrics;

  const handleContinueCurrentClass = (trainingId: string, classId: string) => {
    navigate(
      `/dashboard/assistir-treinamento?trainingId=${trainingId}&classId=${classId}`
    );
  };

  return (
    <main className="w-full flex flex-1  flex-col p-4 mt-4">
      <div className=" w-full flex flex-col md:ml-4 ">
        <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[80px] w-[80%]">
          <GreetUser userName="John Doe" />
          {hasNoWatchedClasses ? (
            <div className="w-full">
              <Subtitle
                content="Acesse seus treinamentos"
                className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
              />
              <ImageCardButton />
            </div>
          ) : isLoading ||
            loading ||
            !lastWatchedClassInfo ||
            !trainingMetrics ? (
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
              <Subtitle
                content="Acesse seus treinamentos"
                className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
              />
              <ImageCardButton />
              <div className="w-full flex flex-col items-center my-[24px]">
                <Text content="ou" />
              </div>
              <Subtitle
                content="Continue de onde parou"
                className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%]"
              />
              <TrainingInfoCard
                showSeeCertificateButton={userHasCertificateForTraining}
                watchedClasses={watchedClasses}
                cover_url={
                  lastWatchedClassInfo.thumbnail_url
                    ? lastWatchedClassInfo.thumbnail_url
                    : infocard_placeholder
                }
                training={trainingMetrics.training.name}
                description={lastWatchedClassInfo.description}
                lastClassName={lastWatchedClassInfo.name}
                lastClassDuration={secondsToFullTimeString(
                  lastWatchedClassInfo.duration
                )}
                totalCourseClasses={trainingMetrics.total_training_classes}
                totalWatchedClasses={trainingMetrics.total_watched_classes}
                onSeeTraining={() => {
                  handleContinueCurrentClass(
                    trainingMetrics.training_id,
                    lastWatchedClassInfo.id
                  );
                }}
                userStartedTraining={lastWatchedClassInfo ? true : false}
              />
            </div>
          )}
        </div>
        <div className="flex flex-row  w-full justify-center flex-wrap"></div>
      </div>
    </main>
  );
}
