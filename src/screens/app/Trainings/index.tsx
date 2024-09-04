import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import infocard_placeholder from "@/assets/info_card_placeholder.png";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { TrainingInfoCard } from "@/components/miscellaneous/TrainingInfoCard";
import { Subtitle } from "@/components/typography/Subtitle";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { ICreateTrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { TrainingsRepository } from "@/repositories/trainingsRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { formatTimeString } from "@/utils/formats";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Trainings() {
  const navigate = useNavigate();
  const [trainings, setTrainings] = useState<ITrainingDTO[]>([]);
  const { isLoading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();

  const handleSeeTraining = (trainingId: string) => {
    navigate(`/dashboard/assistir-treinamento?trainingId=${trainingId}`);
  };

  const handleSeeCertificate = () => {
    navigate("/dashboard/acessar-meus-certificados");
  };

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepository();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const getTrainings = useCallback(async () => {
    try {
      setIsLoading(true);
      const trainings = await trainingsRepository.listTrainings();
      const filteredTrainings = trainings.filter(
        (training) =>
          training.video_classes && training.video_classes?.length > 0
      );
      setTrainings(filteredTrainings);
      return trainings;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, trainingsRepository]);

  useEffect(() => {
    getTrainings();
  }, [getTrainings]);

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
                alt="ps-trainings"
                width={240}
              />
            </div>
          ) : (
            <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {trainings.map((training) => (
                <TrainingInfoCard
                  key={training.id}
                  totalTrainingDuration={formatTimeString(
                    training.formatted_duration!
                  )}
                  cover_url={
                    training.cover_url
                      ? training.cover_url
                      : infocard_placeholder
                  }
                  training={training.name}
                  description={training.description}
                  lastClassName={
                    training.video_classes && training.video_classes.length > 0
                      ? training.video_classes.slice(-1)[0].name
                      : "Nenhuma aula foi assistida"
                  }
                  lastClassDuration={
                    training.video_classes &&
                    training.video_classes.length > 0 &&
                    training.video_classes.slice(-1)[0].formatted_duration
                      ? formatTimeString(
                          training.video_classes.slice(-1)[0]
                            .formatted_duration!
                        )
                      : "00:00"
                  }
                  totalCourseClasses={
                    training.video_classes && training.video_classes.length > 0
                      ? training.video_classes.length
                      : 0
                  }
                  totalWatchedClasses={
                    training.training_metrics?.find(
                      (t) => t.user_id === user.id
                    )?.total_watched_classes ?? 0
                  }
                  userStartedTraining={
                    training.training_metrics &&
                    training.training_metrics.find((t) => t.user_id === user.id)
                      ? true
                      : false
                  }
                  onSeeTraining={() => handleSeeTraining(training.id)}
                  onSeeCertificate={handleSeeCertificate}
                  onStartTraining={() =>
                    handleCreateTrainingMetrics({
                      training_id: training.id,
                      user_id: user.id,
                    })
                  }
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
