'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COURSES, type Course } from '@/lib/courses';
import { Play, Clock, CheckCircle } from 'lucide-react';

type NextCourseSelectionProps = {
  onCourseSelect: (course: Course) => void;
  completedCourseId: string;
  onFinish: () => void;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function NextCourseSelection({ 
  onCourseSelect, 
  completedCourseId,
  onFinish
}: NextCourseSelectionProps) {
  const courseList = Object.values(COURSES);
  const availableCourses = courseList.filter(course => course.id !== completedCourseId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <CheckCircle className="h-6 w-6 text-green-500" />
          <h2 className="font-headline text-2xl font-semibold">Merci pour votre retour !</h2>
        </div>
        <p className="text-muted-foreground">
          Souhaitez-vous écouter un autre cours et nous donner votre avis ?
        </p>
      </div>

      {availableCourses.length > 0 ? (
        <>
          <div className="grid gap-4 md:gap-6">
            {availableCourses.map((course) => (
              <motion.div
                key={course.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center justify-between">
                      <span className="text-left">{course.title}</span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{formatDuration(course.duration)}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">
                        {course.category} - Format audio optimisé
                      </p>
                      <Button
                        onClick={() => onCourseSelect(course)}
                        className="bg-primary hover:bg-primary/90 text-white"
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Écouter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={onFinish}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Terminer et voir mes résultats
            </Button>
          </div>
        </>
      ) : (
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Félicitations ! Vous avez écouté tous nos cours disponibles.
          </p>
          <Button
            onClick={onFinish}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Voir mes résultats
          </Button>
        </div>
      )}

      <div className="text-center text-sm text-muted-foreground">
        <p>🎯 Votre avis nous aide à créer de meilleurs contenus éducatifs</p>
      </div>
    </motion.div>
  );
}
