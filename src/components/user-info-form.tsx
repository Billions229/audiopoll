'use client';

import type { UserInfo } from '@/app/page';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  prenom: z.string().min(1, 'Le prénom est requis.'),
  nom: z.string().min(1, 'Le nom est requis.'),
  email: z.string().email("L'adresse email est invalide."),
});

type UserInfoFormProps = {
  onSubmit: (data: UserInfo) => void;
};

export default function UserInfoForm({ onSubmit }: UserInfoFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      email: '',
    },
  });

  const { isSubmitting } = form.formState;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-semibold">Accès au cours</h2>
        <p className="text-muted-foreground">Entrez vos informations pour commencer.</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="prenom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prénom</FormLabel>
                  <FormControl>
                    <Input placeholder="Jean" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nom"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nom</FormLabel>
                  <FormControl>
                    <Input placeholder="Dupont" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="jean.dupont@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-sm sm:text-base py-3 sm:py-4 px-4 sm:px-6 min-h-[48px] sm:min-h-[52px]"
            disabled={isSubmitting}
          >
            <span className="text-center leading-tight">
              {isSubmitting ? 'Chargement...' : (
                <>
                  <span className="block sm:inline">Accéder au cours</span>
                  <span className="block sm:inline sm:ml-1">- Poteaux en Béton Armé</span>
                </>
              )}
            </span>
          </Button>
        </form>
      </Form>
    </div>
  );
}
