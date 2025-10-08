'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserInfoForm from '@/components/user-info-form';
import CourseSelection from '@/components/course-selection';
import AudioPlayer from '@/components/audio-player';
import FeedbackForm from '@/components/feedback-form';

import AudioLayout from '@/components/audio-layout';
import { Card, CardContent } from '@/components/ui/card';

export type UserInfo = {
  nom: string;
  prenom: string;
  email: string;
};

import { COURSES, type Course } from '@/lib/courses';

// États du flux utilisateur
type FlowState =
  | 'user-info'           // Collecte des informations utilisateur
  | 'course-selection'    // Sélection du premier cours
  | 'audio-playing'       // Lecture audio (avant 30s)
  | 'feedback-active';    // Formulaire de feedback actif (après 30s)

export default function Home() {
  const [flowState, setFlowState] = useState<FlowState>('user-info');
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);

  const [showFeedback, setShowFeedback] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const handleUserInfoSubmit = (data: UserInfo) => {
    setUserInfo(data);
    setFlowState('course-selection');
  };

  const handleCourseSelect = (course: Course) => {
    setCurrentCourse(course);
    setShowFeedback(false);
    setCurrentTime(0);
    setTotalDuration(course.duration);
    setFlowState('audio-playing');
  };

  const handleThresholdReached = () => {
    setShowFeedback(true);
    setFlowState('feedback-active');
  };





  const handleTimeUpdate = (currentTime: number, duration: number) => {
    setCurrentTime(currentTime);
    setTotalDuration(duration);
  };

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img
              src="/icon.png"
              alt="AudioPoll Icon"
              className="w-12 h-12 md:w-16 md:h-16 object-contain"
            />
            <h1 className="font-headline text-4xl font-bold text-foreground md:text-5xl">AudioPoll</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Découvrez une nouvelle façon de réviser vos cours à l'approche des devoirs : testez et donnez-nous vos retours
          </p>
        </header>
        <Card className="w-full overflow-hidden shadow-2xl ring-1 ring-black/5">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {/* Étape 1: Collecte des informations utilisateur */}
              {flowState === 'user-info' && (
                <motion.div
                  key="user-info"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <UserInfoForm onSubmit={handleUserInfoSubmit} />
                </motion.div>
              )}

              {/* Étape 2: Sélection du premier cours */}
              {flowState === 'course-selection' && (
                <motion.div
                  key="course-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <CourseSelection onCourseSelect={handleCourseSelect} />
                </motion.div>
              )}

              {/* Étapes 3 & 4: Lecture audio et feedback */}
              {(flowState === 'audio-playing' || flowState === 'feedback-active') && currentCourse && userInfo && (
                <motion.div
                  key="audio-feedback"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                >
                  <AudioLayout
                    audioPlayer={
                      <AudioPlayer
                        course={currentCourse}
                        onThresholdReached={handleThresholdReached}
                        isCompact={showFeedback}
                        onTimeUpdate={handleTimeUpdate}
                      />
                    }
                    feedbackForm={
                      <FeedbackForm
                        userInfo={userInfo}
                        selectedCourse={currentCourse}
                        currentTime={currentTime}
                        totalDuration={totalDuration}
                      />
                    }
                    showFeedback={showFeedback}
                    currentTime={currentTime}
                    totalDuration={totalDuration}
                  />
                </motion.div>
              )}


            </AnimatePresence>
          </CardContent>
        </Card>
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AudioPoll. Tous droits réservés.</p>
        </footer>
      </div>
    </main>
  );
}
