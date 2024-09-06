import { PRIMARY_COLOR } from "@/appConstants/index";
import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { Text } from "@/components/typography/Text";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ITrainingDTO } from "@/repositories/dtos/TrainingDTO";
import { ITrainingMetricsDTO } from "@/repositories/dtos/TrainingMetricDTO";
import { IVideoClassDTO } from "@/repositories/dtos/VideoClassDTO";
import { IWatchedClassDTO } from "@/repositories/dtos/WatchedClassDTO";
import { TrainingMetricsRepository } from "@/repositories/trainingMetricsRepository";
import { TrainingsRepository } from "@/repositories/trainingsRepository";
import { VideoClassesRepository } from "@/repositories/videoClassesRepository";
import { WatchedClassesRepository } from "@/repositories/watchedClassesRepository";
import { useAuthenticationStore } from "@/store/auth";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { showAlertSuccess } from "@/utils/alerts";
import { secondsToFullTimeString } from "@/utils/formats";
import { useQueries } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import Player from "react-player";
import { useLocation } from "react-router-dom";
import useStateRef from "react-usestateref";
import { TrainingCompleteModal } from "./components/GeneratedCertificateModal";
import { NextClassCard } from "./components/NextClassCard";
import { PlayerListCard } from "./components/PlayerListCard";
import { PreviousClassCard } from "./components/PreviousClassCard";

export function WatchTraining() {
  const [videoClasses, setVideoClasses] = useState<IVideoClassDTO[]>([]);
  const [firstVideoClass, setFirstVideoClass, firstVideoClassRef] =
    useStateRef<IVideoClassDTO | null>(null);
  const [selectedVideoClass, setSelectedVideoClass] =
    useState<IVideoClassDTO | null>(null);

  const [watchedVideoClasses, setWatchedVideoClasses] = useState<
    IWatchedClassDTO[]
  >([]);
  const [trainingMetrics, setTrainingMetrics] =
    useState<ITrainingMetricsDTO | null>(null);
  const [training, setTraining] = useState<ITrainingDTO | null>(null);
  const [showPreviousClassButton, setShowPreviousClassButton] = useState(true);
  const [showNextClassButton, setShowNextClassButton] = useState(true);
  const [previousVideoClass, setPreviousVideoClass] =
    useState<IVideoClassDTO | null>(null);
  const [nextVideoClass, setNextVideoClass] = useState<IVideoClassDTO | null>(
    null
  );
  const [trainingCompleteModal, setTrainingCompleteModal] = useState(false);

  const trainingsRepository = useMemo(() => {
    return new TrainingsRepository();
  }, []);

  const videoClassesRepository = useMemo(() => {
    return new VideoClassesRepository();
  }, []);

  const watchedClassesRepository = useMemo(() => {
    return new WatchedClassesRepository();
  }, []);

  const trainingMetricsRepository = useMemo(() => {
    return new TrainingMetricsRepository();
  }, []);

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const { isLoading: loading, setIsLoading } = useLoading();
  const { user } = useAuthenticationStore();
  const { theme } = useThemeStore();
  const location = useLocation();

  const sortVideoClasses = (videoClasses: IVideoClassDTO[]) => {
    if (videoClasses) {
      return videoClasses.sort((a, b) => {
        if (a.reference_number < b.reference_number) return -1;
        if (a.reference_number > b.reference_number) return 1;
        return 0;
      });
    }
  };

  const queryParams = new URLSearchParams(location.search);
  const trainingIdQueryParam = queryParams.get("trainingId");

  const getTrainingDetails = useCallback(
    async (trainingId: string) => {
      try {
        setIsLoading(true);
        const training = await trainingsRepository.getTrainingById(trainingId);
        setTraining(training);
        return training;
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [setIsLoading, trainingsRepository]
  );

  const getVideoClasses = useCallback(async () => {
    try {
      setIsLoading(true);
      const videoClasses =
        await videoClassesRepository.listVideoClassesByTraining(
          trainingIdQueryParam!
        );

      const sortedVideoClasses = sortVideoClasses(videoClasses);

      if (videoClasses.length > 0) {
        setFirstVideoClass(sortedVideoClasses![0]);
      }
      setVideoClasses(sortedVideoClasses!);
      return sortedVideoClasses;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    videoClassesRepository,
    trainingIdQueryParam,
    setFirstVideoClass,
  ]);

  const getWatchedVideoClasses = useCallback(async () => {
    try {
      setIsLoading(true);
      const watchedVideoClasses =
        await watchedClassesRepository.listWatchedClassesByUserAndTraining({
          user_id: user.id,
          training_id: trainingIdQueryParam!,
        });
      setWatchedVideoClasses(watchedVideoClasses);
      return watchedVideoClasses;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [setIsLoading, trainingIdQueryParam, user.id, watchedClassesRepository]);

  const getTrainingMetrics = useCallback(async () => {
    try {
      const trainingMetrics =
        await trainingMetricsRepository.getTrainingMetricsByUserAndTraining({
          training_id: trainingIdQueryParam!,
          user_id: user.id,
        });
      setTrainingMetrics(trainingMetrics);
      return trainingMetrics;
    } catch (error) {
      console.log(error);
    }
  }, [trainingIdQueryParam, trainingMetricsRepository, user.id]);

  useEffect(() => {
    getTrainingDetails(trainingIdQueryParam!);
    getVideoClasses();
    getWatchedVideoClasses();
    getTrainingMetrics();
  }, [
    getWatchedVideoClasses,
    getTrainingMetrics,
    getTrainingDetails,
    trainingIdQueryParam,
    getVideoClasses,
  ]);

  const autoUpdateTrainingMetrics = useCallback(async () => {
    try {
      const updatedTrainingMetrics =
        await trainingMetricsRepository.updateTrainingMetrics({
          id: trainingMetrics!.id,
          training_id: trainingIdQueryParam!,
          user_id: user.id,
        });
      setTrainingMetrics(updatedTrainingMetrics);
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainingIdQueryParam, trainingMetricsRepository, user.id]);

  useEffect(() => {
    autoUpdateTrainingMetrics();
  }, [autoUpdateTrainingMetrics]);

  const getVideoClass = useCallback(
    async (videoClassId: string) => {
      try {
        const videoClass =
          await videoClassesRepository.getVideoClassById(videoClassId);
        setSelectedVideoClass(videoClass);
        return videoClass;
      } catch (error) {
        console.log(error);
      }
    },
    [videoClassesRepository]
  );

  const queries = useQueries({
    queries: [
      {
        queryKey: ["training-details"],
        queryFn: () => getTrainingDetails(trainingIdQueryParam!),
      },
      { queryKey: ["video-classes"], queryFn: getVideoClasses },
      { queryKey: ["watched-video-classes"], queryFn: getWatchedVideoClasses },
      { queryKey: ["training-metrics"], queryFn: getTrainingMetrics },
    ],
  });

  const isLoading = queries.some((query) => query.isLoading);
  const hasError = queries.some((query) => query.error);

  const handleUnwatchClassAndUpdateMetrics = useCallback(
    async (classId: string) => {
      try {
        await watchedClassesRepository.removeWatchedClass({
          user_id: user.id,
          videoclass_id: classId,
        });
        await videoClassesRepository
          .listVideoClassesByTraining(trainingIdQueryParam!)
          .then((res) => setVideoClasses(sortVideoClasses(res) as never));
        await watchedClassesRepository
          .listWatchedClassesByUserAndTraining({
            user_id: user.id,
            training_id: trainingIdQueryParam!,
          })
          .then((res) => setWatchedVideoClasses(res));
        await trainingMetricsRepository
          .updateTrainingMetrics({
            id: trainingMetrics!.id,
            training_id: trainingIdQueryParam!,
            user_id: user.id,
          })
          .then((res) => setTrainingMetrics(res));
      } catch (error) {
        console.log(error);
      }
    },
    [
      trainingIdQueryParam,
      trainingMetrics,
      trainingMetricsRepository,
      user.id,
      videoClassesRepository,
      watchedClassesRepository,
    ]
  );

  const getNextVideoClass = useCallback(() => {
    const currentIndex = videoClasses.findIndex(
      (vc) => vc.reference_number === selectedVideoClass?.reference_number
    );
    const handleNextClass = () => {
      setSelectedVideoClass(videoClasses[currentIndex + 1]);
      setShowPreviousClassButton(true);
    };
    currentIndex !== -1 && currentIndex < videoClasses.length - 1
      ? handleNextClass()
      : setShowNextClassButton(false);
  }, [selectedVideoClass?.reference_number, videoClasses]);

  const getPreviousVideoClass = useCallback(() => {
    const currentIndex = videoClasses.findIndex(
      (vc) => vc.reference_number === selectedVideoClass?.reference_number
    );

    const handlePreviousClass = () => {
      setSelectedVideoClass(videoClasses[currentIndex - 1]);
      setShowNextClassButton(true);
    };

    currentIndex > 0
      ? handlePreviousClass()
      : setShowPreviousClassButton(false);
  }, [selectedVideoClass?.reference_number, videoClasses]);

  const handleMarkClassAsWatched = useCallback(async () => {
    try {
      await watchedClassesRepository.addWatchedClass({
        training_id: trainingIdQueryParam!,
        user_id: user.id,
        videoclass_id: selectedVideoClass!.id,
      });

      await videoClassesRepository
        .listVideoClassesByTraining(trainingIdQueryParam!)
        .then((res) => setVideoClasses(sortVideoClasses(res) as never));
      await watchedClassesRepository
        .listWatchedClassesByUserAndTraining({
          user_id: user.id,
          training_id: trainingIdQueryParam!,
        })
        .then((res) => setWatchedVideoClasses(res));
      await trainingMetricsRepository
        .updateTrainingMetrics({
          id: trainingMetrics!.id,
          training_id: trainingIdQueryParam!,
          user_id: user.id,
        })
        .then((res) => setTrainingMetrics(res));
      getNextVideoClass();
    } catch (error) {
      console.log(error);
    }
  }, [
    getNextVideoClass,
    selectedVideoClass,
    trainingIdQueryParam,
    trainingMetrics,
    trainingMetricsRepository,
    user.id,
    videoClassesRepository,
    watchedClassesRepository,
  ]);

  const refetchVideoClass = async () => {
    await getVideoClasses();
  };

  useEffect(() => {
    if (!selectedVideoClass) {
      setSelectedVideoClass(firstVideoClassRef.current);
    }
  }, [firstVideoClassRef, selectedVideoClass]);

  const updateNextPreviousClasses = useCallback(() => {
    if (!selectedVideoClass) return;
    const currentIndex = videoClasses.findIndex(
      (vc) => vc.reference_number === selectedVideoClass.reference_number
    );

    if (currentIndex > 0) {
      setPreviousVideoClass(videoClasses[currentIndex - 1]);
      setShowPreviousClassButton(true);
    } else {
      setPreviousVideoClass(null);
      setShowPreviousClassButton(false);
    }

    if (currentIndex < videoClasses.length - 1) {
      setNextVideoClass(videoClasses[currentIndex + 1]);
      setShowNextClassButton(true);
    } else {
      setNextVideoClass(null);
      setShowNextClassButton(false);
    }
  }, [selectedVideoClass, videoClasses]);

  useEffect(() => {
    updateNextPreviousClasses();
  }, [updateNextPreviousClasses, selectedVideoClass]);

  const handleToggleTrainingCompleteModal = useCallback(() => {
    setTrainingCompleteModal(!trainingCompleteModal);
  }, [trainingCompleteModal]);

  const handleGenerateCertificate = useCallback(async () => {
    try {
      const watchedTrainingClassesLength = watchedVideoClasses.filter(
        (vc) => vc.training_id === trainingIdQueryParam!
      ).length;
      const trainingsVideoClassesLength = videoClasses.length;
      if (
        watchedTrainingClassesLength > 0 &&
        trainingsVideoClassesLength > 0 &&
        watchedTrainingClassesLength === trainingsVideoClassesLength
      ) {
        await certificatesRepository.generateCertificate({
          user_id: user.id,
          training_id: trainingIdQueryParam!,
        });
        showAlertSuccess("Seu certificado foi gerado com sucesso!");
        handleToggleTrainingCompleteModal();
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    certificatesRepository,
    handleToggleTrainingCompleteModal,
    trainingIdQueryParam,
    user.id,
    videoClasses.length,
    watchedVideoClasses,
  ]);

  useEffect(() => {
    handleGenerateCertificate();
  }, [handleGenerateCertificate]);

  return (
    <div className="w-full flex flex-col p-8 md:pl-[40px] xl:pl-[8%]">
      <div className="mb-2">
        <ScreenTitleIcon
          screenTitle={training ? training.name : "treinamento"}
          iconName="play-circle"
        />
      </div>
      {isLoading || loading ? (
        <div className="w-full mt-[10vh]">
          <Loading color={PRIMARY_COLOR} />
        </div>
      ) : hasError ? (
        <div className="w-full flex flex-row justify-center">
          <img
            src={theme === "light" ? error_warning : error_warning_dark}
            alt="ps_trainings"
          />
        </div>
      ) : (
        <div className="w-full flex flex-col xl:flex-row">
          <div className="w-full  xl:w-[55%] flex flex-col">
            <div className="flex flex-col  w-full aspect-video min-h-[200px] ">
              <Player
                onError={refetchVideoClass}
                url={
                  selectedVideoClass && selectedVideoClass.hls_encoding_url
                    ? selectedVideoClass.hls_encoding_url
                    : firstVideoClass && firstVideoClass.hls_encoding_url
                      ? firstVideoClass.hls_encoding_url
                      : ""
                }
                controls
                width="100%"
                height="100%"
                volume={1}
                onEnded={handleMarkClassAsWatched}
              />
            </div>
            <Subtitle
              content={
                selectedVideoClass && selectedVideoClass.name
                  ? selectedVideoClass.name
                  : firstVideoClass && firstVideoClass.name
                    ? firstVideoClass.name
                    : ""
              }
              className="m-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
            />
            {/* TODO-Pablo: Navigate between classes through reference_number */}
            <div className="w-full flex flex-col lg:flex-row justify-between">
              <PreviousClassCard
                classDuration={
                  previousVideoClass
                    ? secondsToFullTimeString(previousVideoClass.duration)
                    : ""
                }
                classTitle={previousVideoClass ? previousVideoClass.name : ""}
                showsPreviousClassButton={
                  selectedVideoClass !== null &&
                  videoClasses &&
                  videoClasses.length > 1 &&
                  showPreviousClassButton
                }
                onSeeClass={getPreviousVideoClass}
              />
              <NextClassCard
                classDuration={
                  nextVideoClass
                    ? secondsToFullTimeString(nextVideoClass.duration)
                    : ""
                }
                classTitle={nextVideoClass ? nextVideoClass.name : ""}
                showsNextClassButton={
                  selectedVideoClass !== null &&
                  videoClasses &&
                  videoClasses.length > 1 &&
                  showNextClassButton
                }
                onSeeClass={getNextVideoClass}
              />
            </div>
            <div className="w-full flex flex-col p-4 mb-4">
              <Subtitle
                content="Descrição da aula"
                className="mb-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
              />
              <Text
                content={
                  selectedVideoClass && selectedVideoClass.description
                    ? selectedVideoClass.description
                    : firstVideoClass && firstVideoClass.description
                      ? firstVideoClass.description
                      : ""
                }
                className="text-gray-800 dark:text-gray-50 text-[12px] md:text-[13px] text-pretty"
              />
            </div>
          </div>
          <div className="w-full xl:w-[35%] xl:max-w-[480px] xl:ml-6">
            <PlayerListCard
              classes={videoClasses}
              watchedClasses={watchedVideoClasses}
              onUnwatchClass={() =>
                handleUnwatchClassAndUpdateMetrics(selectedVideoClass!.id)
              }
              onSelectClass={getVideoClass}
            />
          </div>
        </div>
      )}
      <TrainingCompleteModal
        onRequestClose={handleToggleTrainingCompleteModal}
        isOpen={trainingCompleteModal}
        training={training && training}
      />
    </div>
  );
}
