'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UserInfoForm from '@/components/user-info-form';
import AudioPlayer from '@/components/audio-player';
import FeedbackForm from '@/components/feedback-form';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export type UserInfo = {
  nom: string;
  prenom: string;
  email: string;
};

import { COURSES, type Course } from '@/lib/courses';

export default function Home() {
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string>('TC4'); // Par défaut TC4

  const handleUserInfoSubmit = (data: UserInfo) => {
    setUserInfo(data);
  };

  const handleThresholdReached = () => {
    setShowFeedback(true);
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourse(courseId);
    setShowFeedback(false); // Reset feedback when changing course
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
          <p className="mt-2 text-muted-foreground">Testez nos résumés de cours audio pour le génie civil</p>
        </header>
        <Card className="w-full overflow-hidden shadow-2xl ring-1 ring-black/5">
          <CardContent className="p-6 sm:p-8">
            <AnimatePresence mode="wait">
              {!userInfo ? (
                <motion.div
                  key="user-info-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <UserInfoForm onSubmit={handleUserInfoSubmit} />
                </motion.div>
              ) : (
                <motion.div
                  key="audio-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-8"
                >
                  {/* Onglets de sélection de cours */}
                  <Tabs value={selectedCourse} onValueChange={handleCourseChange} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="TC3" className="text-sm font-medium">
                        TC3 - EUROCODE
                      </TabsTrigger>
                      <TabsTrigger value="TC4" className="text-sm font-medium">
                        TC4 - Poteaux Béton
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="TC3" className="mt-6">
                      <AudioPlayer
                        course={COURSES.TC3}
                        onThresholdReached={handleThresholdReached}
                      />
                    </TabsContent>

                    <TabsContent value="TC4" className="mt-6">
                      <AudioPlayer
                        course={COURSES.TC4}
                        onThresholdReached={handleThresholdReached}
                      />
                    </TabsContent>
                  </Tabs>

                  <AnimatePresence>
                    {showFeedback && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                      >
                        <FeedbackForm userInfo={userInfo} selectedCourse={COURSES[selectedCourse]} />
                      </motion.div>
                    )}
                  </AnimatePresence>
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
