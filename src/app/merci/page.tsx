import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function ConfirmationPage() {
  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center bg-background p-4 sm:p-8">
      <Card className="w-full max-w-lg text-center shadow-2xl ring-1 ring-black/5">
        <CardHeader className="p-6 sm:p-8">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <CheckCircle className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="mt-4 font-headline text-3xl">Merci !</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-0 sm:p-8 sm:pt-0">
          <p className="text-muted-foreground">
            Votre avis a été enregistré avec succès. Nous vous recontacterons bientôt avec nos offres de cours premium.
          </p>
          <Button asChild className="mt-8 w-full sm:w-auto bg-accent hover:bg-accent/90">
            <Link href="/">Retour à l'accueil</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
