import { IMAGES } from '../../../assets/images';

export type PreferenceCategory = {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  image: { uri: string };
  topPick?: boolean;
};

export const CATEGORIES: PreferenceCategory[] = [
  {
    id: 'hair',
    title: 'Hair & Styling',
    subtitle: 'Signature blowouts, cuts, couture coloring',
    tags: ['Blowout', 'Balayage', 'Olaplex Cut'],
    image: IMAGES.hair,
    topPick: true,
  },
  {
    id: 'makeup',
    title: 'Makeup & Lashes',
    subtitle: 'Bridal glam, Russian volume lashes, soft glam',
    tags: ['Bridal', 'Evening Glam', 'Lash Lift'],
    image: IMAGES.makeup,
  },
  {
    id: 'nails',
    title: 'Nails & Henna',
    subtitle: 'Gel extensions, Russian manicure',
    tags: ['BIAB Gel', 'Nail Art', 'Henna Inscribing'],
    image: IMAGES.nails,
  },
  {
    id: 'skin',
    title: 'Skin & Facial',
    subtitle: 'Medical Hydrafacial, glow peel',
    tags: ['Hydrafacial', 'Glass Skin', 'LED Therapy'],
    image: IMAGES.facial,
  },
  {
    id: 'wellness',
    title: 'Body Wellness',
    subtitle: 'Moroccan bath, deep tissue massage',
    tags: ['Moroccan Bath', 'Massage', 'Body Scrub'],
    image: IMAGES.massage,
  },
  {
    id: 'home',
    title: 'At-Home Services',
    subtitle: 'Private certified stylists & artists arrive right at your residence or hotel suite.',
    tags: ['Home Visit', 'Hotel Suite'],
    image: IMAGES.salon,
  },
  {
    id: 'fashion',
    title: 'Abayas & Atelier Fashion',
    subtitle: 'Designer abayas, tailored fittings',
    tags: ['Custom Tailoring', 'Bespoke Silks'],
    image: IMAGES.abaya,
  },
];
