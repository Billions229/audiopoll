"use client";

import type { UserInfo } from "@/app/page";
import type { Course } from "@/lib/courses";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "./star-rating";
import { Separator } from "./ui/separator";
import { useAudio } from "@/context/AudioContext";

const formSchema = z.object({
  rating: z.number().min(1, "Veuillez attribuer une note."),
  comments: z.string().min(1, "Veuillez laisser un commentaire."),
  willingToPay: z.enum(["oui", "non", "peut-etre"], {
    required_error: "Veuillez sélectionner une option.",
  }),
  amount: z.string().optional(),
});

type FeedbackFormProps = {
  userInfo: UserInfo;
  selectedCourse: Course;
};

export default function FeedbackForm({
  userInfo,
  selectedCourse,
}: FeedbackFormProps) {
  // Obtenir les informations audio à partir du contexte global
  const {
    currentTime,
    duration: totalDuration,
    cumulativeListeningTime: cumulativeTime,
    requiredListeningTime: requiredTime,
    formatTime,
  } = useAudio();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      rating: 0,
      comments: "",
      amount: "", // Initialiser avec une chaîne vide pour éviter l'erreur controlled/uncontrolled
    },
  });

  const { isSubmitting } = form.formState;
  const watchWillingToPay = form.watch("willingToPay");
  const [redirectUrl, setRedirectUrl] = useState("");

  // Vérifier si l'utilisateur a écouté suffisamment longtemps (1/4 de la durée)
  const hasListenedEnough = cumulativeTime >= requiredTime;

  // Obtenir la durée requise formatée
  const requiredTimeFormatted = formatTime(requiredTime);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRedirectUrl(`${window.location.origin}/merci`);
    }
  }, []);

  const handleFormSubmit = (data: z.infer<typeof formSchema>) => {
    // Créer un formulaire HTML et le soumettre de manière classique
    const form = document.createElement("form");
    form.action = "https://formsubmit.co/contact@buildlab.fr";
    form.method = "POST";
    form.style.display = "none";

    const fields = {
      _next: `${window.location.origin}/merci`,
      _subject: `Nouveau feedback de ${userInfo.prenom} ${userInfo.nom} - ${selectedCourse.title}`,
      _captcha: "false",
      prénom: userInfo.prenom,
      nom: userInfo.nom,
      email: userInfo.email,
      timestamp: new Date().toISOString(),
      cours_selectionne: selectedCourse.id,
      titre_cours: selectedCourse.title,
      note_satisfaction: data.rating.toString(),
      commentaires: data.comments || "",
      disposition_a_payer: data.willingToPay,
      montant_acceptable: data.amount || "",
      temps_ecoute: formatTime(cumulativeTime),
      duree_totale: formatTime(totalDuration),
    };

    // Ajouter tous les champs au formulaire
    Object.entries(fields).forEach(([key, value]) => {
      const input = document.createElement("input");
      input.type = "hidden";
      input.name = key;
      input.value = value;
      form.appendChild(input);
    });

    // Ajouter le formulaire au DOM et le soumettre
    document.body.appendChild(form);
    form.submit();
  };

  return (
    <div className="space-y-6 pt-6">
      <Separator />
      <div className="text-center space-y-3">
        <h3 className="font-headline text-2xl font-semibold">
          Votre avis nous intéresse !
        </h3>
        <p className="text-muted-foreground">
          Aidez-nous à améliorer nos prochains cours.
        </p>

        {/* Message requis avec horodatage */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm">
          <p className="text-blue-800 font-medium mb-2">
            Pour que vos commentaires soient utiles, nous vous demandons
            d'écouter au moins <strong>1/4 de la durée du cours</strong> (
            {requiredTimeFormatted})
          </p>
          <div className="flex items-center justify-center gap-2 text-blue-600">
            <span>Temps écouté :</span>
            <span className="font-mono font-semibold">
              {formatTime(cumulativeTime)} / {requiredTimeFormatted}
            </span>
            {hasListenedEnough && (
              <span className="text-green-600 ml-2">✓ Objectif atteint</span>
            )}
          </div>
        </div>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleFormSubmit)}
          className="space-y-8"
        >
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center">
                <FormLabel className="mb-2">
                  Quelle est votre appréciation de ce cours audio ?
                </FormLabel>
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
                <FormLabel>
                  Commentaires, suggestions, points à améliorer
                </FormLabel>
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
                <FormLabel>
                  Seriez-vous prêt(e) à payer pour accéder à d'autres cours
                  similaires ?
                </FormLabel>
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

          {(watchWillingToPay === "oui" ||
            watchWillingToPay === "peut-etre") && (
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Si oui ou peut-être, quel montant (en €) vous semblerait
                    acceptable par cours ?
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="ex: 4"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours...." : "Envoyer mon avis"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
