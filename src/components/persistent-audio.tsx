"use client";

import { useRef, useEffect, useState } from "react";
import { useAudio } from "@/context/AudioContext";

/**
 * Composant qui gère un élément audio persistant à travers l'application
 * Ce composant invisible est responsable de la lecture audio continue
 * même lors des transitions et animations dans l'interface
 */
export function PersistentAudio() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const {
    currentCourse,
    registerAudioElement,
    isPlaying,
    playbackRate,
    togglePlayPause,
  } = useAudio();
  const [audioReady, setAudioReady] = useState(false);

  // Enregistrer l'élément audio immédiatement au montage
  useEffect(() => {
    if (audioRef.current && !audioReady) {
      registerAudioElement(audioRef.current);
      setAudioReady(true);
    }
  }, [registerAudioElement, audioReady]);

  // Charger le cours audio quand il change
  useEffect(() => {
    if (!audioRef.current || !currentCourse) return;

    const audio = audioRef.current;

    // Charger la nouvelle source
    if (audio.src !== currentCourse.audioUrl) {
      audio.src = currentCourse.audioUrl;
      audio.load();

      // Démarrer automatiquement la lecture après chargement
      audio.play().catch((error) => {
        console.error("Erreur de lecture audio initiale:", error);
      });
    }
  }, [currentCourse]);

  // Gérer l'état de lecture
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch((error) => {
        console.error("Erreur de lecture audio:", error);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Gérer la vitesse de lecture
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  return (
    <audio ref={audioRef} preload="metadata" style={{ display: "none" }} />
  );
}

export default PersistentAudio;
