'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COURSES, type Course } from '@/lib/courses';
import { Play, Clock } from 'lucide-react';

type CourseSelectionProps = {
  onCourseSelect: (course: Course) => void;
  title?: string;
  subtitle?: string;
};

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export default function CourseSelection({ 
  onCourseSelect, 
  title = "Choisissez votre cours",
  subtitle = "Sélectionnez le cours audio que vous souhaitez écouter."
}: CourseSelectionProps) {
  const courseList = Object.values(COURSES);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>

      <div className="grid gap-4 md:gap-6">
        {courseList.map((course) => (
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

      <div className="text-center text-sm text-muted-foreground">
        <p>💡 Astuce : Vous pourrez donner votre avis après avoir écouté le cours</p>
      </div>
    </motion.div>
  );
}
