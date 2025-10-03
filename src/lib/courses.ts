export type Course = {
  id: string;
  title: string;
  subtitle?: string;
  audioUrl: string;
  duration: number; // en secondes
};

export const COURSES: Record<string, Course> = {
  TC3: {
    id: 'TC3',
    title: 'Cours: EUROCODE',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759517392/Eurocodes_0___1__Les_Fondamentaux_de_la_Construction_S%C3%BBre___De__onvqyy.mp4',
    duration: 30 * 60 // 30 minutes
  },
  TC4: {
    id: 'TC4',
    title: 'Cours: Poteaux en Béton Armé',
    audioUrl: 'https://res.cloudinary.com/dysfocdyw/video/upload/v1759435118/Poteaux_en_B%C3%A9ton_Arm%C3%A9___D%C3%A9cryptage_Ultime_de_l_Eurocode_2_et_du_jcfgcs.mp4',
    duration: 15 * 60 + 32 // 15 minutes 32 secondes
  }
};
