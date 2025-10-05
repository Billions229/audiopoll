# AudioPoll

Une plateforme web minimaliste de sondage pour tester l'intérêt des étudiants  pour des cours audio résumés.

## 🎯 Objectif

AudioPoll permet de valider l'intérêt pour des cours de génie civil en format audio, constituer une liste d'emails de prospects intéressés, et tester la volonté de payer avant de développer une plateforme payante complète.

## ✨ Fonctionnalités

### 🏠 Page d'accueil
- Formulaire d'entrée avec validation (Nom, Prénom, Email)
- Design responsive et moderne avec icône
- Bouton CTA optimisé pour mobile

### 🎵 Lecteur audio avancé
- Lecteur audio personnalisé avec protection anti-téléchargement
- **Contrôles de vitesse** : 0.5x, 1x, 1.25x, 1.5x, 2x, 5x
- **Fonction de réécoute** : bouton pour recommencer l'audio
- Barre de progression et affichage du temps
- Déclenchement automatique du feedback à 95% d'écoute

### 📝 Système de feedback
- Notation par étoiles (1-5)
- Zone de commentaires libres
- Question sur la disposition à payer
- Envoi automatique par email via FormSubmit

### 📧 Envoi des données
- Aucune base de données requise
- Utilisation de FormSubmit.co pour l'envoi par email
- Redirection vers page de remerciement

## 🛠️ Technologies utilisées

- **Framework** : Next.js 15.3.3 avec TypeScript
- **Styling** : Tailwind CSS + Radix UI
- **Formulaires** : React Hook Form + Zod validation
- **Animations** : Framer Motion
- **Icônes** : Lucide React
- **Déploiement** : Compatible Vercel/Netlify

## 🚀 Installation et développement

### Prérequis
- Node.js 18+
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/Billions229/audiopoll.git
cd audiopoll

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev
```

Le site sera accessible sur `http://localhost:9002`

### Scripts disponibles
```bash
npm run dev          # Serveur de développement (port 9002)
npm run build        # Build de production
npm run start        # Serveur de production
npm run lint         # Linting du code
npm run typecheck    # Vérification TypeScript
```

## 📁 Structure du projet

```
src/
├── app/
│   ├── page.tsx           # Page principale
│   ├── layout.tsx         # Layout global
│   ├── globals.css        # Styles globaux
│   └── merci/
│       └── page.tsx       # Page de remerciement
├── components/
│   ├── audio-player.tsx   # Lecteur audio avec contrôles avancés
│   ├── feedback-form.tsx  # Formulaire de feedback
│   ├── user-info-form.tsx # Formulaire d'informations utilisateur
│   ├── star-rating.tsx    # Composant de notation
│   └── ui/               # Composants UI (Radix)
└── lib/
    └── utils.ts          # Utilitaires
```

## 🎨 Fonctionnalités avancées

### Lecteur audio
- **Vitesses multiples** : Permet d'accélérer l'écoute jusqu'à 5x
- **Réécoute** : Bouton pour recommencer l'audio après la fin
- **Protection** : Désactivation du clic droit et des contrôles de téléchargement
- **Responsive** : Interface adaptée mobile et desktop

### Formulaires
- **Validation en temps réel** avec Zod
- **Responsive design** avec breakpoints optimisés
- **Animations fluides** avec Framer Motion
- **Accessibilité** respectée (ARIA labels, focus management)

## 📧 Configuration email

Les données sont envoyées automatiquement à `techares0@gmail.com` via FormSubmit.co avec les informations suivantes :
- Informations utilisateur (nom, prénom, email)
- Note de satisfaction (1-5 étoiles)
- Commentaires textuels
- Disposition à payer et montant acceptable
- Timestamp de soumission

## 🚀 Déploiement

### Vercel (recommandé)
```bash
# Connecter le repository GitHub à Vercel
# Le déploiement se fait automatiquement
```

### Netlify
```bash
# Build command: npm run build
# Publish directory: .next
```

## 🔒 Sécurité

- Protection anti-téléchargement de l'audio
- Validation côté client et serveur
- Pas de stockage de données sensibles
- HTTPS obligatoire en production

## 📱 Responsive Design

- **Mobile-first** : Optimisé pour les petits écrans
- **Breakpoints** : 320px, 768px, 1024px
- **Touch-friendly** : Boutons et contrôles adaptés tactile
- **Performance** : Chargement optimisé sur mobile

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Ares Billion** - [@Billions229](https://github.com/Billions229)

---

*AudioPoll - Testez l'avenir de l'apprentissage audio en génie civil* 🎓
