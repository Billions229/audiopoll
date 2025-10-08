'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Gauge, SkipBack, SkipForward } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Course } from '@/lib/courses';

const FEEDBACK_THRESHOLD_SECONDS = 30; // Déclencher après 30 secondes

type AudioPlayerProps = {
  course: Course;
  onThresholdReached: () => void;
  isCompact?: boolean; // Pour le mode compact après déclenchement
  onTimeUpdate?: (currentTime: number, duration: number) => void; // Callback pour mettre à jour le temps
};

export default function AudioPlayer({ course, onThresholdReached, isCompact = false, onTimeUpdate }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [hasEnded, setHasEnded] = useState(false);
  const thresholdReachedRef = useRef(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      if (audio.readyState >= 1) { // HAVE_METADATA
         setIsPlaying(!audio.paused);
         // Auto-play seulement si l'audio n'a pas encore commencé
         if (audio.currentTime === 0) {
           audio.play().catch(console.error);
           setIsPlaying(true);
         }
      }
    };
    
    const setAudioTime = () => {
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(newProgress);
      setCurrentTime(audio.currentTime);

      // Mettre à jour le temps dans le composant parent
      onTimeUpdate?.(audio.currentTime, audio.duration);

      // Déclencher après 30 secondes de lecture
      if (audio.currentTime >= FEEDBACK_THRESHOLD_SECONDS && !thresholdReachedRef.current) {
        onThresholdReached();
        thresholdReachedRef.current = true;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
    }

    audio.addEventListener('loadedmetadata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onThresholdReached]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
        setHasEnded(false);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handlePlaybackRateChange = (rate: string) => {
    const newRate = parseFloat(rate);
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setProgress(0);
      setCurrentTime(0);
      setHasEnded(false);
      thresholdReachedRef.current = false;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const skipTime = (seconds: number) => {
    if (audioRef.current) {
      const newTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, audioRef.current.duration));
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress((newTime / audioRef.current.duration) * 100);
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = event.currentTarget.getBoundingClientRect();
      const clickX = event.clientX - rect.left;
      const percentage = clickX / rect.width;
      const newTime = percentage * duration;

      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percentage * 100);
    }
  };

  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getRequiredListeningTime = () => {
    const requiredSeconds = FEEDBACK_THRESHOLD_SECONDS; // 30 secondes fixes
    const requiredMinutes = Math.floor(requiredSeconds / 60);
    const totalMinutes = Math.floor(duration / 60);

    return {
      required: requiredMinutes,
      total: totalMinutes,
      requiredFormatted: formatTime(requiredSeconds),
      totalFormatted: formatTime(duration)
    };
  };

  return (
    <div className={`space-y-4 ${isCompact ? 'space-y-2' : ''}`} onContextMenu={(e) => e.preventDefault()}>
      {!isCompact && (
        <div className="text-center">
          <h3 className="font-headline text-xl font-semibold">{course.title}</h3>
          {duration > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Écoutez <strong>30 secondes</strong> pour donner votre avis
              <br />
              <span className="text-xs">Durée totale : <strong>{getRequiredListeningTime().totalFormatted}</strong></span>
            </p>
          )}
        </div>
      )}
      {isCompact && (
        <div className="text-center">
          <h4 className="font-semibold text-lg">{course.title}</h4>
          <p className="text-sm text-muted-foreground">En cours de lecture...</p>
        </div>
      )}
      <audio ref={audioRef} src={course.audioUrl} controls={false} controlsList="nodownload" preload="metadata" />

      {/* Contrôles de vitesse */}
      <div className="flex items-center justify-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Gauge className="h-4 w-4 text-muted-foreground" />
          <Select value={playbackRate.toString()} onValueChange={handlePlaybackRateChange}>
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
        {hasEnded && (
          <Button
            onClick={restartAudio}
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
        <Button onClick={togglePlayPause} variant="outline" size="icon" className="flex-shrink-0 bg-primary/10 hover:bg-primary/20">
          {isPlaying ? <Pause className="h-5 w-5 text-primary" /> : <Play className="h-5 w-5 text-primary" />}
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
