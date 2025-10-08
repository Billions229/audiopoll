"use client";

import {
  Play,
  Pause,
  RotateCcw,
  Gauge,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Course } from "@/lib/courses";
import { useAudio } from "@/context/AudioContext";
import { useEffect } from "react";

type AudioPlayerProps = {
  course: Course;
  isCompact?: boolean; // Pour le mode compact après déclenchement
  onThresholdReachedAction?: () => void; // Renommé pour indiquer qu'il s'agit d'une action côté serveur
};

export default function AudioPlayer({
  course,
  isCompact = false,
  onThresholdReachedAction,
}: AudioPlayerProps) {
  const {
    isPlaying,
    currentTime,
    duration,
    progress,
    playbackRate,
    currentCourse,
    isThresholdReached,
    requiredListeningTime,
    cumulativeListeningTime,

    setCurrentCourse,
    togglePlayPause,
    seekTo,
    skipTime,
    restart,
    setPlaybackRate,
    formatTime,
  } = useAudio();

  // Mettre à jour le cours si nécessaire
  useEffect(() => {
    if (!currentCourse || currentCourse.id !== course.id) {
      setCurrentCourse(course);
    }
  }, [course, currentCourse, setCurrentCourse]);

  // Surveiller si le seuil est atteint pour afficher le formulaire
  useEffect(() => {
    if (isThresholdReached && !isCompact && onThresholdReachedAction) {
      console.log("AudioPlayer: Seuil atteint, déclenchement du formulaire");
      onThresholdReachedAction();
    }
  }, [isThresholdReached, isCompact, onThresholdReachedAction]);

  // Gestion du clic sur la barre de progression
  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (duration > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;
      seekTo(newTime);
    }
  };

  // Gestion du changement de vitesse
  const handlePlaybackRateChange = (rate: string) => {
    setPlaybackRate(parseFloat(rate));
  };

  return (
    <div
      className={`space-y-4 ${isCompact ? "space-y-2" : ""}`}
      onContextMenu={(e) => e.preventDefault()}
    >
      {!isCompact && (
        <div className="text-center">
          <h3 className="font-headline text-xl font-semibold">
            {course.title}
          </h3>
          {duration > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Le formulaire d'avis apparaîtra après <strong>30 secondes</strong>{" "}
              d'écoute
              <br />
              <span className="text-xs">
                Durée totale : <strong>{formatTime(duration)}</strong>
              </span>
            </p>
          )}
        </div>
      )}

      {isCompact && (
        <div className="text-center">
          <h4 className="font-semibold text-lg">{course.title}</h4>
          <p className="text-sm text-muted-foreground">
            En cours de lecture...
          </p>
        </div>
      )}

      {/* Contrôles de vitesse */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <Select
            value={playbackRate.toString()}
            onValueChange={handlePlaybackRateChange}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0.5">0.5x</SelectItem>
              <SelectItem value="1">1x</SelectItem>
              <SelectItem value="1.25">1.25x</SelectItem>
              <SelectItem value="1.5">1.5x</SelectItem>
              <SelectItem value="2">2x</SelectItem>
              <SelectItem value="5">5x</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {!isPlaying && currentTime > 0 && (
          <Button
            onClick={restart}
            variant="outline"
            size="sm"
            className="flex items-center gap-2 bg-secondary/50 hover:bg-secondary/70"
          >
            <RotateCcw className="h-4 w-4" />
            Réécouter
          </Button>
        )}
      </div>

      {/* Contrôles de navigation temporelle */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <Button
          onClick={() => skipTime(-10)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
        >
          <SkipBack className="h-3 w-3" />
          -10s
        </Button>
        <Button
          onClick={() => skipTime(10)}
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
        >
          +10s
          <SkipForward className="h-3 w-3" />
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <Button
          onClick={togglePlayPause}
          variant="outline"
          size="icon"
          className="flex-shrink-0 bg-primary/10 hover:bg-primary/20"
        >
          {isPlaying ? (
            <Pause className="h-5 w-5 text-primary" />
          ) : (
            <Play className="h-5 w-5 text-primary" />
          )}
        </Button>
        <div className="w-full">
          {/* Barre de progression interactive */}
          <div
            className="relative w-full h-2 bg-secondary rounded-full cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-150"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 cursor-grab active:cursor-grabbing"
              style={{ left: `calc(${progress}% - 8px)` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
