import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/info_card_placeholder.png";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { ITrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Trainings() {
  const navigate = useNavigate();
  const [trainingsMetrics, setTrainingsMetrics] = useState<
    ITrainingMetricsDTO[]
  >([]);
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();

  //TODO-Pablo: Add training id to navigation to navigate to the corresponding training
  const handleSeeTraining = () => {
    navigate("/dashboard/assistir-treinamento");
  };

  const handleSeeCertificate = () => {
    navigate("/dashboard/acessar-meus-certificados");
  };

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const getTrainingMetrics = useCallback(async () => {
    try {
      const trainingMetrics =
        await trainingMetricsRepository.listTrainingMetricsByUser(user.id);
      setTrainingsMetrics(trainingMetrics);
      setIsLoading(true);
      return trainingMetrics;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, trainingMetricsRepository, user.id]);

  useEffect(() => {
    getTrainingMetrics();
  }, [getTrainingMetrics]);

  const { error, isLoading: loading } = useQuery({
    queryKey: ["training-metrics"],
    queryFn: getTrainingMetrics,
  });

  return (
    <div className="w-full lg:w-[95%] flex flex-col p-8">
      <div className="flex flex-col justify-between mb-6 mx-auto md:mx-[80px] w-[80%]">
        <div className="flex flex-col w-full">
          <ScreenTitleIcon
            iconName="play-circle"
            screenTitle="Meus treinamentos"
          />
          <Subtitle
            content="Aqui estão todos os seus treinamentos em andamento"
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
                alt="ps-trainings"
                width={240}
              />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainingsMetrics.map((training) => (
                <TrainingInfoCard
                  cover_url={
                    training.training.cover_url
                      ? training.training.cover_url
                      : infocard_placeholder
                  }
                  training={training.training.name}
                  description={training.training.description}
                  lastClassName="Como fazer laços"
                  lastClassDuration="14:32"
                  totalCourseClasses={training.total_training_classes}
                  totalWatchedClasses={training.total_watched_classes}
                  onSeeTraining={handleSeeTraining}
                  onSeeCertificate={handleSeeCertificate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="flex flex-row  w-full justify-center flex-wrap"></div>
    </div>
  );
}
