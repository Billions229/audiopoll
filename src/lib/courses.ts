export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  audioUrl: string;
  duration: number; // en secondes
  category: string; // Catégorie du cours
};

export const COURSES: Record<string, Course> = {
  TC2: {
    id: 'TC2',
    title: 'Cours: Thermodynamique et de l\'anthropie',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1760100565/Entropie_et_Fl%C3%A8che_du_Temps__D%C3%A9cryptage_du_Second_Principe_de_l_uteurh.mp4',
    duration: 14 * 60 + 53, // 14 minutes 53 secondes
    category: 'Génie Civil'
  },
  TC3: {
    id: 'TC3',
    title: 'Cours: EUROCODE',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759517392/Eurocodes_0___1__Les_Fondamentaux_de_la_Construction_S%C3%BBre___De__onvqyy.mp4',
    duration: 30 * 60, // 30 minutes
    category: 'Génie Civil'
  },
  TC4: {
    id: 'TC4',
    title: 'Cours: Poteaux en Béton Armé',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759435118/Poteaux_en_B%C3%A9ton_Arm%C3%A9___D%C3%A9cryptage_Ultime_de_l_Eurocode_2_et_du_jcfgcs.mp4',
    duration: 15 * 60 + 32, // 15 minutes 32 secondes
    category: 'Génie Civil'
  },
  DROIT: {
    id: 'DROIT',
    title: 'Droit des Affaires L2 Semestre 2 - Campus 1',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759662777/Entreprise_en_France_Qui_Fait_Quoi_Statuts_Juridiques_et_Protec_svvqiz.mp4',
    duration: 25 * 60, // Estimation de 25 minutes, à ajuster si nécessaire
    category: 'Droit'
  }
};
