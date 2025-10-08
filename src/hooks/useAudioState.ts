"use client";

import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactElement,
} from "react";

type UseAudioStateProps = {
  audioUrl: string;
  onThresholdReached?: () => void;
  thresholdPercentage?: number;
};

type AudioState = {
  isPlaying: boolean;
  currentTime: number;
  totalDuration: number;
  progress: number;
  playbackRate: number;
  hasEnded: boolean;
  cumulativeListeningTime: number;
  thresholdReached: boolean;
  requiredListeningTime: number;
  formattedCurrentTime: string;
  formattedTotalDuration: string;
  formattedRequiredTime: string;
};

/**
 * Hook personnalisé pour gérer l'état audio persistant
 *
 * Ce hook maintient l'état de l'audio même pendant les re-renders et les animations
 * en utilisant une référence persistante vers l'élément audio.
 */
export function useAudioState({
  audioUrl,
  onThresholdReached,
  thresholdPercentage = 25, // Par défaut, seuil à 25% de la durée totale
}: UseAudioStateProps) {
  // Référence vers l'élément audio qui persiste à travers les re-renders
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // État local de l'audio
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    currentTime: 0,
    totalDuration: 0,
    progress: 0,
    playbackRate: 1,
    hasEnded: false,
    cumulativeListeningTime: 0,
    thresholdReached: false,
    requiredListeningTime: 0,
    formattedCurrentTime: "00:00",
    formattedTotalDuration: "00:00",
    formattedRequiredTime: "00:00",
  });

  // Référence pour suivre le dernier temps mis à jour
  const lastTimeUpdateRef = useRef<number>(0);

  // Référence pour suivre le temps cumulé d'écoute
  const cumulativeTimeRef = useRef<number>(0);

  // Formater le temps en format MM:SS
  const formatTime = useCallback((timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }, []);

  // Mettre à jour l'état audio complet
  const updateAudioState = useCallback((updates: Partial<AudioState>) => {
    setAudioState((prev) => ({
      ...prev,
      ...updates,
    }));
  }, []);

  // Créer l'élément audio ou récupérer l'existant
  const getAudioElement = useCallback(() => {
    if (!audioRef.current) {
      // Si l'audio n'existe pas encore, le créer
      const audio = new Audio(audioUrl);
      audio.preload = "metadata";
      audioRef.current = audio;
    }
    return audioRef.current;
  }, [audioUrl]);

  // Initialiser ou mettre à jour la source audio si nécessaire
  useEffect(() => {
    const audio = getAudioElement();

    if (audio.src !== audioUrl) {
      audio.src = audioUrl;
      audio.load();

      // Réinitialiser l'état
      updateAudioState({
        isPlaying: false,
        currentTime: 0,
        totalDuration: 0,
        progress: 0,
        cumulativeListeningTime: 0,
        thresholdReached: false,
      });

      // Réinitialiser les références
      lastTimeUpdateRef.current = 0;
      cumulativeTimeRef.current = 0;
    }

    return () => {
      // Nettoyer si le composant est démonté
      audio.pause();
    };
  }, [audioUrl, getAudioElement, updateAudioState]);

  // Configurer tous les écouteurs d'événements audio
  useEffect(() => {
    const audio = getAudioElement();

    const handleLoadedMetadata = () => {
      const duration = audio.duration;
      const requiredTime = Math.ceil((thresholdPercentage / 100) * duration);

      updateAudioState({
        totalDuration: duration,
        requiredListeningTime: requiredTime,
        formattedTotalDuration: formatTime(duration),
        formattedRequiredTime: formatTime(requiredTime),
      });
    };

    const handleTimeUpdate = () => {
      const currentTime = audio.currentTime;
      const duration = audio.duration || 0;
      const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

      // Calculer le temps écouté depuis la dernière mise à jour
      if (lastTimeUpdateRef.current > 0 && audio.paused === false) {
        const timeDiff = currentTime - lastTimeUpdateRef.current;
        // Seulement compter les différences positives (éviter les sauts en arrière)
        if (timeDiff > 0) {
          cumulativeTimeRef.current += timeDiff;
        }
      }

      // Mettre à jour la référence du dernier temps
      lastTimeUpdateRef.current = currentTime;

      // Vérifier si le seuil est atteint
      const requiredTime = (thresholdPercentage / 100) * duration;
      const thresholdJustReached =
        cumulativeTimeRef.current >= requiredTime &&
        !audioState.thresholdReached;

      // Si le seuil vient d'être atteint
      if (thresholdJustReached) {
        if (onThresholdReached) {
          onThresholdReached();

          // Mettre l'audio en pause automatiquement
          audio.pause();
        }
      }

      updateAudioState({
        currentTime,
        progress,
        cumulativeListeningTime: cumulativeTimeRef.current,
        thresholdReached: thresholdJustReached || audioState.thresholdReached,
        formattedCurrentTime: formatTime(currentTime),
      });
    };

    const handlePlay = () => {
      updateAudioState({ isPlaying: true });
    };

    const handlePause = () => {
      updateAudioState({ isPlaying: false });
    };

    const handleEnded = () => {
      updateAudioState({
        isPlaying: false,
        hasEnded: true,
      });
    };

    // Ajouter tous les écouteurs d'événements
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    // Nettoyage à la destruction du composant
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [
    audioState.thresholdReached,
    formatTime,
    getAudioElement,
    onThresholdReached,
    thresholdPercentage,
    updateAudioState,
  ]);

  // Actions de contrôle audio
  const togglePlayPause = useCallback(() => {
    const audio = getAudioElement();

    if (audioState.isPlaying) {
      audio.pause();
    } else {
      audio.play().catch((error) => {
        console.error("Erreur de lecture audio:", error);
      });
      updateAudioState({ hasEnded: false });
    }
  }, [audioState.isPlaying, getAudioElement, updateAudioState]);

  const setPlaybackRate = useCallback(
    (rate: number) => {
      const audio = getAudioElement();
      audio.playbackRate = rate;
      updateAudioState({ playbackRate: rate });
    },
    [getAudioElement, updateAudioState],
  );

  const seek = useCallback(
    (time: number) => {
      const audio = getAudioElement();
      const newTime = Math.max(0, Math.min(time, audio.duration));
      audio.currentTime = newTime;
      updateAudioState({
        currentTime: newTime,
        progress: (newTime / audio.duration) * 100,
      });
    },
    [getAudioElement, updateAudioState],
  );

  const skipTime = useCallback(
    (seconds: number) => {
      const audio = getAudioElement();
      const newTime = Math.max(
        0,
        Math.min(audio.currentTime + seconds, audio.duration),
      );
      audio.currentTime = newTime;
      updateAudioState({
        currentTime: newTime,
        progress: (newTime / audio.duration) * 100,
      });
    },
    [getAudioElement, updateAudioState],
  );

  const restart = useCallback(() => {
    const audio = getAudioElement();
    audio.currentTime = 0;
    audio.play().catch(console.error);

    updateAudioState({
      currentTime: 0,
      progress: 0,
      hasEnded: false,
    });
  }, [getAudioElement, updateAudioState]);

  return {
    // L'élément audio à rendre
    audioElement: React.createElement("audio", {
      ref: audioRef,
      src: audioUrl,
      style: { display: "none" },
    }) as ReactElement,

    // État audio actuel
    ...audioState,

    // Actions audio
    togglePlayPause,
    seek,
    skipTime,
    restart,
    setPlaybackRate,
  };
}
