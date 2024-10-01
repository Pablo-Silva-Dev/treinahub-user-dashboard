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
import { secondsToFullTimeString } from "@/utils/formats";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Player from "react-player";
import { useLocation } from "react-router-dom";
import { NextClassCard } from "./components/NextClassCard";
import { PlayerListCard } from "./components/PlayerListCard";
import { PreviousClassCard } from "./components/PreviousClassCard";
import { RealizeQuizModal } from "./components/RealizeQuizModal";
import { RealizeQuizWarningCard } from "./components/RealizeQuizWariningCard";

export function WatchTraining() {
  const [videoClasses, setVideoClasses] = useState<IVideoClassDTO[]>([]);
  const [selectedVideoClass, setSelectedVideoClass] =
    useState<IVideoClassDTO | null>(null);
  const [selectedDeletableVideoClass, setSelectedDeletedVideoClass] =
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
  const [lastClassExecutionTime, setLastClassExecutionTime] = useState(0);
  const [hasError, setHasError] = useState(false);

  const [enableQuiz, setEnableQuiz] = useState(false);

  const playerRef = useRef<Player>(null);

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

  const { isLoading, setIsLoading } = useLoading();
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
  const videoClassIdQueryParam = queryParams.get("classId");

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);

    try {
      const trainingId = trainingIdQueryParam!;

      const videoClassesPromise =
        videoClassesRepository.listVideoClassesByTraining(trainingId);
      const trainingPromise = trainingsRepository.getTrainingById(trainingId);
      const watchedClassesPromise =
        watchedClassesRepository.listWatchedClassesByUserAndTraining({
          user_id: user.id,
          training_id: trainingId,
        });
      const trainingMetricsPromise =
        trainingMetricsRepository.getTrainingMetricsByUserAndTraining({
          training_id: trainingId,
          user_id: user.id,
        });

      const [videoClasses, training, watchedVideoClasses, trainingMetrics] =
        await Promise.all([
          videoClassesPromise,
          trainingPromise,
          watchedClassesPromise,
          trainingMetricsPromise,
        ]);

      setVideoClasses(videoClasses!);
      setTraining(training);
      setWatchedVideoClasses(watchedVideoClasses);
      setTrainingMetrics(trainingMetrics);
    } catch (err) {
      setHasError(true);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [
    setIsLoading,
    trainingIdQueryParam,
    trainingMetricsRepository,
    trainingsRepository,
    user.id,
    videoClassesRepository,
    watchedClassesRepository,
  ]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

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
        setSelectedDeletedVideoClass(videoClass);
        return videoClass;
      } catch (error) {
        console.log(error);
      }
    },
    [videoClassesRepository]
  );

  const selectVideoClass = useCallback(
    async (videoClassId: string) => {
      const videoClass =
        await videoClassesRepository.getVideoClassById(videoClassId);
      setSelectedVideoClass(videoClass);
    },
    [videoClassesRepository]
  );

  const selectDeletableVideoClass = useCallback(
    async (videoClassId: string) => {
      const videoClass =
        await videoClassesRepository.getVideoClassById(videoClassId);
      setSelectedDeletedVideoClass(videoClass);
    },
    [videoClassesRepository]
  );

  const handleUnwatchClassAndUpdateMetrics = useCallback(
    async (classId: string) => {
      try {
        await watchedClassesRepository.removeWatchedClass({
          user_id: user.id,
          videoclass_id: classId,
        });
        await trainingMetricsRepository
          .updateTrainingMetrics({
            id: trainingMetrics!.id,
            training_id: trainingIdQueryParam!,
            user_id: user.id,
          })
          .then((res) => setTrainingMetrics(res));
        await videoClassesRepository
          .listVideoClassesByTraining(trainingIdQueryParam!)
          .then((res) => setVideoClasses(sortVideoClasses(res) as never));
        await watchedClassesRepository
          .listWatchedClassesByUserAndTraining({
            user_id: user.id,
            training_id: trainingIdQueryParam!,
          })
          .then((res) => setWatchedVideoClasses(res));
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

  const handleMarkClassAsCompletelyWatched = useCallback(async () => {
    try {
      await watchedClassesRepository.updateVideoClassExecutionStatus({
        user_id: user.id,
        videoclass_id: selectedVideoClass!.id,
        completely_watched: true,
        execution_time: selectedVideoClass!.duration,
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
      getNextVideoClass();
    } catch (error) {
      console.log("Error at trying to updated video class at ending: ", error);
    }
  }, [
    getNextVideoClass,
    selectedVideoClass,
    trainingIdQueryParam,
    user.id,
    videoClassesRepository,
    watchedClassesRepository,
  ]);

  const addClassToWatchedAsIncomplete = useCallback(async () => {
    try {
      const watchedClassHaveBenAdded = watchedVideoClasses.some(
        (wc) => wc.videoclass_id === selectedVideoClass!.id
      );

      if (!watchedClassHaveBenAdded) {
        await watchedClassesRepository.addWatchedClass({
          training_id: trainingIdQueryParam!,
          user_id: user.id,
          videoclass_id: selectedVideoClass!.id,
          completely_watched: false,
          execution_time: 0,
        });
      }

      await trainingMetricsRepository
        .updateTrainingMetrics({
          id: trainingMetrics!.id,
          training_id: trainingIdQueryParam!,
          user_id: user.id,
        })
        .then((res) => setTrainingMetrics(res));
    } catch (error) {
      console.log("Error at trying to add class to watched list: ", error);
    }
  }, [
    selectedVideoClass,
    trainingIdQueryParam,
    trainingMetrics,
    trainingMetricsRepository,
    user.id,
    watchedClassesRepository,
    watchedVideoClasses,
  ]);

  const updateWatchedClassExecutionTime = useCallback(
    async (playedSeconds: number) => {
      const UPDATE_SECONDS_INTERVAL = 15;
      const mustUpdateExecutionTime =
        Math.floor(playedSeconds) % UPDATE_SECONDS_INTERVAL === 0;
      try {
        if (
          playedSeconds !== 0 &&
          playedSeconds >= UPDATE_SECONDS_INTERVAL &&
          mustUpdateExecutionTime
        ) {
          await watchedClassesRepository.updateVideoClassExecutionStatus({
            user_id: user.id,
            videoclass_id: selectedVideoClass!.id,
            completely_watched: false,
            execution_time: playedSeconds,
          });
        }
      } catch (error) {
        console.log(
          "Error at trying to update video class execution time",
          error
        );
      }
    },
    [selectedVideoClass, user.id, watchedClassesRepository]
  );

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

  const shouldEnableQuiz = useCallback(async () => {
    try {
      if (training) {
        const userHasCertificate =
          await certificatesRepository.getCertificateByUserAndTraining({
            user_id: user.id,
            training_id: training.id,
          });
        const watchedTrainingClassesLength = watchedVideoClasses.filter(
          (vc) => vc.training_id === trainingIdQueryParam!
        ).length;
        const trainingsVideoClassesLength = videoClasses.length;
        const allClassesWatched = watchedVideoClasses.every(
          (wc) => wc.completely_watched
        );
        if (
          watchedTrainingClassesLength > 0 &&
          trainingsVideoClassesLength > 0 &&
          watchedTrainingClassesLength === trainingsVideoClassesLength &&
          allClassesWatched &&
          !userHasCertificate
        ) {
          setEnableQuiz(true);
          setTrainingCompleteModal(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    certificatesRepository,
    training,
    trainingIdQueryParam,
    user.id,
    videoClasses.length,
    watchedVideoClasses,
  ]);

  useEffect(() => {
    shouldEnableQuiz();
  }, [shouldEnableQuiz]);

  // const handleGenerateCertificate = useCallback(async () => {
  //   try {
  //     const shouldEnable = await shouldEnableQuiz;
  //     if (enableQuiz) {
  //       await certificatesRepository.generateCertificate({
  //         user_id: user.id,
  //         training_id: trainingIdQueryParam!,
  //       });
  //       showAlertSuccess("Seu certificado foi gerado com sucesso!");
  //       handleToggleTrainingCompleteModal();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }, [
  //   certificatesRepository,
  //   handleToggleTrainingCompleteModal,
  //   shouldEnableQuiz,
  //   trainingIdQueryParam,
  //   user.id,
  // ]);

  // useEffect(() => {
  //   handleGenerateCertificate();
  // }, [handleGenerateCertificate]);

  useEffect(() => {
    if (trainingIdQueryParam && videoClassIdQueryParam) {
      getVideoClass(videoClassIdQueryParam);
    }
  }, [getVideoClass, trainingIdQueryParam, videoClassIdQueryParam]);

  const getNextOneClassToWatch = useCallback(async () => {
    if (videoClasses.length !== watchedVideoClasses.length) {
      try {
        if (!selectedVideoClass) return;

        const currentWatchedClass = watchedVideoClasses.find(
          (wc) => wc.videoclass_id === selectedVideoClass.id
        );

        if (currentWatchedClass?.completely_watched) {
          const currentWatchedClassIndex = videoClasses.findIndex(
            (vc) => vc.id === selectedVideoClass.id
          );

          const previousVideoClassToWatch =
            videoClasses[currentWatchedClassIndex - 1];

          const nexVideoClassToWatch =
            videoClasses[currentWatchedClassIndex + 1];

          if (
            currentWatchedClassIndex !== -1 &&
            currentWatchedClassIndex < videoClasses.length - 1
          ) {
            setSelectedVideoClass(nexVideoClassToWatch);
            setShowPreviousClassButton(true);
          } else {
            setSelectedVideoClass(previousVideoClassToWatch);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoClasses, watchedVideoClasses]);

  useEffect(() => {
    getNextOneClassToWatch();
  }, [getNextOneClassToWatch]);

  const getLastIncompletelyWatchedClass = useCallback(async () => {
    try {
      setIsLoading(true);
      if (selectedVideoClass) {
        const lastWatchedClass = await watchedClassesRepository.getWatchedClass(
          {
            user_id: user.id!,
            videoclass_id: selectedVideoClass.id,
          }
        );
        if (!lastWatchedClass) {
          return;
        }
        setLastClassExecutionTime(lastWatchedClass.execution_time!);
      }
    } catch (error) {
      console.log(error);
      return;
    } finally {
      setIsLoading(false);
    }
  }, [selectedVideoClass, setIsLoading, user.id, watchedClassesRepository]);

  useEffect(() => {
    getLastIncompletelyWatchedClass();
  }, [getLastIncompletelyWatchedClass]);

  const onReady = useCallback(() => {
    const timeToStart = lastClassExecutionTime;
    const watchedClassHaveBenAdded = watchedVideoClasses.some(
      (wc) => wc.videoclass_id === selectedVideoClass!.id
    );
    if (
      playerRef.current &&
      watchedClassHaveBenAdded &&
      lastClassExecutionTime > 0 &&
      lastClassExecutionTime !== selectedVideoClass?.duration
    ) {
      playerRef.current.seekTo(timeToStart, "seconds");
    }
  }, [lastClassExecutionTime, selectedVideoClass, watchedVideoClasses]);

  return (
    <div className="w-full flex flex-col p-8 md:pl-[40px] xl:pl-[8%]">
      <div className="mb-2">
        <ScreenTitleIcon
          screenTitle={training ? training.name : "treinamento"}
          iconName="play-circle"
        />
      </div>
      {isLoading || !selectedVideoClass ? (
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
            <div className="flex flex-col  w-full aspect-video min-h-[200px] mb-4">
              {
                <Player
                  ref={playerRef}
                  url={selectedVideoClass.hls_encoding_url}
                  controls
                  width="100%"
                  height="100%"
                  volume={1}
                  onReady={onReady}
                  onStart={addClassToWatchedAsIncomplete}
                  onProgress={(state) =>
                    updateWatchedClassExecutionTime(state.playedSeconds)
                  }
                  onEnded={handleMarkClassAsCompletelyWatched}
                />
              }
            </div>
            <Subtitle
              content={selectedVideoClass.name}
              className="m-2 text-gray-800 dark:text-gray-50 text-sm md:text-[15px] text-pretty w-[90%] font-bold"
            />
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
                content={selectedVideoClass.description}
                className="text-gray-800 dark:text-gray-50 text-[12px] md:text-[13px] text-pretty"
              />
            </div>
          </div>
          <div className="w-full xl:w-[35%] xl:max-w-[480px] xl:ml-6">
            <PlayerListCard
              classes={videoClasses}
              watchedClasses={watchedVideoClasses}
              onUnwatchClass={() =>
                handleUnwatchClassAndUpdateMetrics(
                  selectedDeletableVideoClass!.id
                )
              }
              onSelectClass={selectVideoClass}
              onSelectDeletableClass={selectDeletableVideoClass}
            />
            {enableQuiz && (
              <RealizeQuizWarningCard
                onStartQuiz={handleToggleTrainingCompleteModal}
              />
            )}
          </div>
        </div>
      )}
      <RealizeQuizModal
        onRequestClose={handleToggleTrainingCompleteModal}
        onClose={handleToggleTrainingCompleteModal}
        isOpen={trainingCompleteModal}
        totalQuestions={3}
        trainingName={training && training.name}
        onStartQuiz={() => {
          console.log("Quiz started");
        }}
      />
    </div>
  );
}
