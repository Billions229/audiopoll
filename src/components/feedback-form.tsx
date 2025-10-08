'use client';

import type { UserInfo } from '@/app/page';
import type { Course } from '@/lib/courses';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import StarRating from './star-rating';
import { Separator } from './ui/separator';

const formSchema = z.object({
  rating: z.number().min(1, 'Veuillez attribuer une note.'),
  comments: z.string().min(1, 'Veuillez laisser un commentaire.'),
  willingToPay: z.enum(['oui', 'non', 'peut-etre'], {
    required_error: 'Veuillez sélectionner une option.',
  }),
  amount: z.string().optional(),
});

type FeedbackFormProps = {
  userInfo: UserInfo;
  selectedCourse: Course;
  currentTime?: number; // Temps actuel de lecture en secondes
  totalDuration?: number; // Durée totale en secondes
};

export default function FeedbackForm({ userInfo, selectedCourse, currentTime = 0, totalDuration = 0 }: FeedbackFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comments: '',
    },
  });

  const { isSubmitting } = form.formState;
  const watchWillingToPay = form.watch('willingToPay');
  const [redirectUrl, setRedirectUrl] = useState('');

  // Fonction pour formater le temps en MM:SS
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Calculer le temps requis (30 secondes)
  const requiredTime = 30; // 30 secondes
  const hasListenedEnough = currentTime >= requiredTime;

  // Calculer la durée requise en format MM:SS
  const requiredTimeFormatted = formatTime(requiredTime);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.origin}/merci`);
    }
  }, []);

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Préparer les données pour FormSubmit
      const formData = new FormData();
      formData.append('_next', redirectUrl);
      formData.append('_subject', `Nouveau feedback de ${userInfo.prenom} ${userInfo.nom} - ${selectedCourse.title}`);
      formData.append('_captcha', 'false');
      formData.append('prénom', userInfo.prenom);
      formData.append('nom', userInfo.nom);
      formData.append('email', userInfo.email);
      formData.append('timestamp', new Date().toISOString());
      formData.append('cours_selectionne', selectedCourse.id);
      formData.append('titre_cours', selectedCourse.title);
      formData.append('note_satisfaction', data.rating.toString());
      formData.append('commentaires', data.comments || '');
      formData.append('disposition_a_payer', data.willingToPay);
      formData.append('montant_acceptable', data.amount || '');

      // Envoyer à FormSubmit
      await fetch('https://formsubmit.co/contact@buildlab.fr', {
        method: 'POST',
        body: formData,
      });

      // Rediriger vers la page de remerciement
      window.location.href = '/merci';
    } catch (error) {
      console.error('Erreur lors de l\'envoi du feedback:', error);
    }
  };

  return (
    <div className="space-y-6 pt-6">
      <Separator />
      <div className="text-center space-y-3">
        <h3 className="font-headline text-2xl font-semibold">Votre avis nous intéresse !</h3>
        <p className="text-muted-foreground">Aidez-nous à améliorer nos prochains cours.</p>

        {/* Message requis avec horodatage */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-800 font-medium mb-2">
            Pour que vos commentaires soient utiles, nous vous demandons d'écouter au moins {requiredTimeFormatted}
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <span>Temps écouté :</span>
            <span className="font-mono font-semibold">
              {formatTime(currentTime)} / {formatTime(totalDuration)}
            </span>
            {hasListenedEnough && (
              <span className="text-green-600 ml-2">✓ Objectif atteint</span>
            )}
          </div>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-8">

          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="mb-2">Quelle est votre appréciation de ce cours audio ?</FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commentaires, suggestions, points à améliorer</FormLabel>
                <FormControl>
                  <Textarea placeholder="Votre avis ici..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="willingToPay"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Seriez-vous prêt(e) à payer pour accéder à d'autres cours similaires ?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="oui" />
                      </FormControl>
                      <FormLabel className="font-normal">Oui</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="non" />
                      </FormControl>
                      <FormLabel className="font-normal">Non</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="peut-etre" />
                      </FormControl>
                      <FormLabel className="font-normal">Peut-être</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {(watchWillingToPay === 'oui' || watchWillingToPay === 'peut-etre') && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Si oui ou peut-être, quel montant (en €) vous semblerait acceptable par cours ?</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="ex: 4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours....' : 'Envoyer mon avis'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
