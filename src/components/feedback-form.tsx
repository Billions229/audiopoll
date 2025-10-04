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
  comments: z.string().optional(),
  willingToPay: z.enum(['oui', 'non', 'peut-etre'], {
    required_error: 'Veuillez sélectionner une option.',
  }),
  amount: z.string().optional(),
});

type FeedbackFormProps = {
  userInfo: UserInfo;
  selectedCourse: Course;
};

export default function FeedbackForm({ userInfo, selectedCourse }: FeedbackFormProps) {
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRedirectUrl(`${window.location.origin}/merci`);
    }
  }, []);

  return (
    <div className="space-y-6 pt-6">
      <Separator />
      <div className="text-center">
        <h3 className="font-headline text-2xl font-semibold">Votre avis nous intéresse !</h3>
        <p className="text-muted-foreground">Aidez-nous à améliorer nos prochains cours.</p>
      </div>
      <Form {...form}>
        <form action="https://formsubmit.co/contact@buildlab.fr" method="POST" className="space-y-8">
          {/* FormSubmit and User Info Hidden Fields */}
          <input type="hidden" name="_next" value={redirectUrl} />
          <input type="hidden" name="_subject" value={`Nouveau feedback de ${userInfo.prenom} ${userInfo.nom} - ${selectedCourse.title}`} />
          <input type="hidden" name="_captcha" value="false" />
          <input type="hidden" name="prénom" value={userInfo.prenom} />
          <input type="hidden" name="nom" value={userInfo.nom} />
          <input type="hidden" name="email" value={userInfo.email} />
          <input type="hidden" name="timestamp" value={new Date().toISOString()} />
          <input type="hidden" name="cours_selectionne" value={selectedCourse.id} />
          <input type="hidden" name="titre_cours" value={selectedCourse.title} />
          <input type="hidden" name="note_satisfaction" value={form.watch('rating') || 0} />

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
                  <Textarea placeholder="Votre avis ici..." {...field} name="commentaires" />
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
                    name="disposition_a_payer"
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
                    <Input type="number" placeholder="ex: 5" {...field} name="montant_acceptable" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button type="submit" className="w-full bg-accent hover:bg-accent/90" disabled={isSubmitting}>
            {isSubmitting ? 'Envoi en cours...' : 'Envoyer mon avis'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
