"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  useCallback,
} from "react";
import type { Course } from "@/lib/courses";

type AudioContextType = {
  // État
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  progress: number;
  playbackRate: number;
  currentCourse: Course | null;
  isThresholdReached: boolean;
  cumulativeListeningTime: number;
  requiredListeningTime: number;

  // Actions
  setCurrentCourse: (course: Course) => void;
  togglePlayPause: () => void;
  seekTo: (time: number) => void;
  skipTime: (seconds: number) => void;
  restart: () => void;
  setPlaybackRate: (rate: number) => void;
  registerAudioElement: (element: HTMLAudioElement) => void;

  // Formatage
  formatTime: (seconds: number) => string;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
  const context = useContext(AudioContext);
  if (context === undefined) {
    throw new Error(
      "useAudio doit être utilisé à l'intérieur d'un AudioProvider",
    );
  }
  return context;
}

type AudioProviderProps = {
  children: ReactNode;
};

export function AudioProvider({ children }: AudioProviderProps) {
  // Référence à l'élément audio externe (géré par PersistentAudio)
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // État de lecture
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRateState] = useState(1);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  // État de suivi
  const [isThresholdReached, setIsThresholdReached] = useState(false);
  const [cumulativeListeningTime, setCumulativeListeningTime] = useState(0);
  const [requiredListeningTime, setRequiredListeningTime] = useState(0);

  // Références pour le suivi du temps écouté
  const lastTimeRef = useRef<number>(0);
  const cumulativeTimeRef = useRef<number>(0);
  const listenersAttachedRef = useRef(false);

  // Fonction pour enregistrer l'élément audio externe
  const registerAudioElement = useCallback((element: HTMLAudioElement) => {
    audioRef.current = element;
  }, []);

  // Mettre à jour le cours et réinitialiser l'état
  const handleSetCurrentCourse = useCallback((course: Course) => {
    setCurrentCourse(course);
    setIsPlaying(false);
    setCurrentTime(0);
    setProgress(0);
    setCumulativeListeningTime(0);
    setIsThresholdReached(false);

    // Calculer le temps requis (25% de la durée totale)
    const quarterDuration = Math.ceil(course.duration * 0.25);
    setRequiredListeningTime(quarterDuration);

    // Réinitialiser les références
    lastTimeRef.current = 0;
    cumulativeTimeRef.current = 0;
    listenersAttachedRef.current = false; // Forcer le réattachement des événements
  }, []);

  // Configurer les écouteurs d'événements audio quand l'élément audio est enregistré
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || listenersAttachedRef.current) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);

      // Recalculer le temps requis avec la durée réelle
      if (audio.duration > 0) {
        const quarterDuration = Math.ceil(audio.duration * 0.25);
        setRequiredListeningTime(quarterDuration);
      }
    };

    const handleTimeUpdate = () => {
      const currentTimeValue = audio.currentTime;
      const durationValue = audio.duration || 0;

      setCurrentTime(currentTimeValue);

      if (durationValue > 0) {
        setProgress((currentTimeValue / durationValue) * 100);
      }

      // Calculer le temps écouté de manière cumulative
      if (!audio.paused && lastTimeRef.current > 0) {
        const timeDiff = currentTimeValue - lastTimeRef.current;
        // Seulement compter les progressions normales (max 1 seconde de différence)
        if (timeDiff > 0 && timeDiff <= 1) {
          cumulativeTimeRef.current += timeDiff;
          setCumulativeListeningTime(cumulativeTimeRef.current);
        }
      }

      // Toujours mettre à jour la dernière position
      if (!audio.paused) {
        lastTimeRef.current = currentTimeValue;
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
      // Reprendre le suivi du temps depuis la position actuelle
      lastTimeRef.current = audio.currentTime;
    };

    const handlePause = () => {
      setIsPlaying(false);
      // Réinitialiser la référence de temps lors de la pause
      lastTimeRef.current = 0;
    };

    const handleEnded = () => {
      setIsPlaying(false);
      lastTimeRef.current = 0;
    };

    // Ajouter les écouteurs
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    listenersAttachedRef.current = true;

    // Retourner la fonction de nettoyage
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      listenersAttachedRef.current = false;
    };
  }, [cumulativeListeningTime]); // Dépendance sur cumulativeListeningTime pour avoir la valeur à jour

  // Vérifier si le seuil de 30 secondes est atteint pour afficher le formulaire
  useEffect(() => {
    const THRESHOLD_SECONDS = 30;

    if (
      !isThresholdReached &&
      cumulativeListeningTime >= THRESHOLD_SECONDS &&
      currentCourse
    ) {
      setIsThresholdReached(true);
      // L'audio continue de jouer en arrière-plan - pas de pause
    }
  }, [cumulativeListeningTime, isThresholdReached, currentCourse]);

  // Action: Basculer entre lecture et pause
  const handleTogglePlayPause = useCallback(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture audio:", error);
      });
    }
  }, [isPlaying]);

  // Action: Chercher une position spécifique
  const handleSeekTo = useCallback((time: number) => {
    if (!audioRef.current) return;

    const newTime = Math.max(0, Math.min(time, audioRef.current.duration));
    audioRef.current.currentTime = newTime;
  }, []);

  // Action: Sauter en avant/arrière
  const handleSkipTime = useCallback((seconds: number) => {
    if (!audioRef.current) return;

    const newTime = Math.max(
      0,
      Math.min(
        audioRef.current.currentTime + seconds,
        audioRef.current.duration,
      ),
    );
    audioRef.current.currentTime = newTime;
  }, []);

  // Action: Redémarrer l'audio
  const handleRestart = useCallback(() => {
    if (!audioRef.current) return;

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(console.error);
  }, []);

  // Action: Changer la vitesse de lecture
  const handleSetPlaybackRate = useCallback((rate: number) => {
    if (!audioRef.current) return;

    audioRef.current.playbackRate = rate;
    setPlaybackRateState(rate);
  }, []);

  // Formater le temps en MM:SS
  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  }, []);

  const value = {
    // État
    isPlaying,
    currentTime,
    duration,
    progress,
    playbackRate,
    currentCourse,
    isThresholdReached,
    cumulativeListeningTime,
    requiredListeningTime,

    // Actions
    setCurrentCourse: handleSetCurrentCourse,
    togglePlayPause: handleTogglePlayPause,
    seekTo: handleSeekTo,
    skipTime: handleSkipTime,
    restart: handleRestart,
    setPlaybackRate: handleSetPlaybackRate,
    registerAudioElement,

    // Formatage
    formatTime,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}
