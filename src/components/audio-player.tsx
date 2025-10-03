'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Gauge } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AUDIO_URL = 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759435118/Poteaux_en_B%C3%A9ton_Arm%C3%A9___D%C3%A9cryptage_Ultime_de_l_Eurocode_2_et_du_jcfgcs.mp4';
const FEEDBACK_THRESHOLD = 0.95;

type AudioPlayerProps = {
  onThresholdReached: () => void;
};

export default function AudioPlayer({ onThresholdReached }: AudioPlayerProps) {
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
      }
    };
    
    const setAudioTime = () => {
      const newProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(newProgress);
      setCurrentTime(audio.currentTime);

      if (newProgress >= FEEDBACK_THRESHOLD * 100 && !thresholdReachedRef.current) {
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
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4" onContextMenu={(e) => e.preventDefault()}>
      <div className="text-center">
        <h3 className="font-headline text-xl font-semibold">Cours: Poteaux en Béton Armé</h3>
        <p className="text-sm text-muted-foreground">Eurocode 2 et Applications</p>
      </div>
      <audio ref={audioRef} src={AUDIO_URL} controls={false} controlsList="nodownload" preload="metadata" />

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

      <div className="flex items-center gap-4">
        <Button onClick={togglePlayPause} variant="outline" size="icon" className="flex-shrink-0 bg-primary/10 hover:bg-primary/20">
          {isPlaying ? <Pause className="h-5 w-5 text-primary" /> : <Play className="h-5 w-5 text-primary" />}
        </Button>
        <div className="w-full">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
            </div>
        </div>
      </div>
    </div>
  );
}
