"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { useAudio } from "@/context/AudioContext";

type AudioLayoutProps = {
  audioPlayer: ReactNode;
  feedbackForm: ReactNode;
  showFeedback: boolean;
};

export default function AudioLayout({
  audioPlayer,
  feedbackForm,
  showFeedback,
}: AudioLayoutProps) {
  // Récupérer les informations d'état audio depuis le contexte
  const { currentTime, duration, cumulativeListeningTime, formatTime } =
    useAudio();

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!showFeedback ? (
          // Mode normal : lecteur audio en haut
          <motion.div
            key="audio-top"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            {audioPlayer}
          </motion.div>
        ) : (
          // Mode feedback : formulaire en haut, lecteur en bas
          <motion.div
            key="feedback-layout"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="space-y-6"
          >
            {/* Formulaire de feedback en haut */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-full"
            >
              {feedbackForm}
            </motion.div>

            {/* Lecteur audio en bas (mode compact) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="w-full bg-gray-50 rounded-lg p-4 border-t-2 border-primary/20"
            >
              <div className="text-center mb-3">
                <p className="text-sm text-muted-foreground">
                  🎵 Audio en cours de lecture
                </p>
              </div>
              {audioPlayer}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
