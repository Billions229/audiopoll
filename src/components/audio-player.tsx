'use client';

import { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';

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
      }
      setIsPlaying(!isPlaying);
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
