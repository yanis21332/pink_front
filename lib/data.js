export const SERVICES = {
  hammam: {
    label: 'Hammam',
    eyebrow: 'DÉTENTE & BIEN-ÊTRE',
    img: '/imports/pink1.jpeg',
    color: '#b3895b',
  },
  coloration: {
    label: 'Coloration',
    eyebrow: 'TRANSFORMATION CAPILLAIRE',
    img: '/imports/pink2.jpeg',
  },
  mariees: {
    label: 'Mariées',
    eyebrow: 'JOUR SPÉCIAL',
    img: '/imports/pink3.jpeg',
  },
  onglerie: {
    label: 'Onglerie',
    eyebrow: 'ESTHÉTIQUE PRÉCISE',
    img: '/imports/pink4.jpeg',
  },
  esthetique: {
    label: 'Esthétique',
    eyebrow: 'BEAUTÉ & SOINS',
    img: '/imports/pink5.jpeg',
  },
};

export const CAT_KEYS = Object.keys(SERVICES);

export const INITIAL_APPTS = [
  {
    id: 1,
    cat: 'hammam',
    name: 'Yasmine Benali',
    start: '09:00',
    end: '10:30',
    amount: 2500,
    statut: 'payé',
    practitioner: "Algia la moto",
    comment: 'Accès premium',
  },
  {
    id: 2,
    cat: 'coloration',
    name: 'Sophia Leroux',
    start: '10:00',
    end: '12:00',
    amount: 5000,
    statut: 'impayé',
    practitioner: "Malika domran",
    comment: 'Balayage complet',
  },
  {
    id: 3,
    cat: 'onglerie',
    name: 'Amira Tazi',
    start: '11:00',
    end: '12:00',
    amount: 1500,
    statut: 'payé',
    practitioner: "Melissa Onglerie",
    comment: 'Pose de vernis',
  },
  {
    id: 4,
    cat: 'mariees',
    name: 'Nadia Boulanger',
    start: '14:00',
    end: '16:00',
    amount: 8000,
    statut: 'acompte',
    practitioner: "Chabha bila",
    comment: 'Coiffure + Maquillage',
  },
  {
    id: 5,
    cat: 'esthetique',
    name: 'Leïla Moreau',
    start: '15:30',
    end: '16:30',
    amount: 3000,
    statut: 'payé',
    practitioner: "Malika Doumran",
    comment: 'Soin visage Lumière',
  },
  {
    id: 6,
    cat: 'hammam',
    name: 'Yasmine Benali',
    start: '17:00',
    end: '18:30',
    amount: 2500,
    statut: 'acompte',
    practitioner: "Omra Zubia",
    comment: '',
  },
];
export const API = "https://pink-back.onrender.com"

export const AUTH_COOKIE_NAME = 'pink_studio_auth';
export const AUTH_TOKEN_VALUE = 'pink-studio-token';