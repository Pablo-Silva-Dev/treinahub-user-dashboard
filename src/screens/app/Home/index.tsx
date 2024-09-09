import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/info_card_placeholder.png";
import GreetUser from "@/components/miscellaneous/GreetUser";
import { ImageCardButton } from "@/components/miscellaneous/ImageCardButton";
import { Loading } from "@/components/miscellaneous/Loading";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { ITrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { IVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { WatchedClassesRepository } from "@/repositories/watchedClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { secondsToFullTimeString } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Home() {
  const [hasNoWatchedClasses, setHasNoWatchedClasses] = useState(false);

  const { user } = useAuthenticationStore();
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

  const getCompleteInfo = useCallback(async () => {
    try {
      const watchedClasses =
        await watchedClassesRepository.listWatchedClassesByUser(user.id);
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

      if (!trainingMetrics) return null;

      return { lastWatchedClassInfo, trainingMetrics };
    } catch (error) {
      console.log(error);
    }
  }, [
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
    isLoading,
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
          ) : isLoading || !lastWatchedClassInfo || !trainingMetrics ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <Loading color={PRIMARY_COLOR} />
            </div>
          ) : hasError ? (
            <div className="w-full flex flex-col items-center mt-[10vh]">
              <img
                src={theme === "light" ? error_warning : error_warning_dark}
                alt="ps-trainings"
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
