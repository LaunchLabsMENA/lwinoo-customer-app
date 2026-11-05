import { IMAGES } from '../../../assets/images';
import type { TranslationKey } from '../../../i18n';

export type PreferenceCategory = {
  id: string;
  title: TranslationKey;
  subtitle: TranslationKey;
  tags: TranslationKey[];
  image: { uri: string };
  topPick?: boolean;
};

export const CATEGORIES: PreferenceCategory[] = [
  {
    id: 'hair',
    title: 'preferences.hair.title',
    subtitle: 'preferences.hair.subtitle',
    tags: ['preferences.hair.tag1', 'preferences.hair.tag2', 'preferences.hair.tag3'],
    image: IMAGES.hair,
    topPick: true,
  },
  {
    id: 'makeup',
    title: 'preferences.makeup.title',
    subtitle: 'preferences.makeup.subtitle',
    tags: ['preferences.makeup.tag1', 'preferences.makeup.tag2', 'preferences.makeup.tag3'],
    image: IMAGES.makeup,
  },
  {
    id: 'nails',
    title: 'preferences.nails.title',
    subtitle: 'preferences.nails.subtitle',
    tags: ['preferences.nails.tag1', 'preferences.nails.tag2', 'preferences.nails.tag3'],
    image: IMAGES.nails,
  },
  {
    id: 'skin',
    title: 'preferences.skin.title',
    subtitle: 'preferences.skin.subtitle',
    tags: ['preferences.skin.tag1', 'preferences.skin.tag2', 'preferences.skin.tag3'],
    image: IMAGES.facial,
  },
  {
    id: 'wellness',
    title: 'preferences.wellness.title',
    subtitle: 'preferences.wellness.subtitle',
    tags: ['preferences.wellness.tag1', 'preferences.wellness.tag2', 'preferences.wellness.tag3'],
    image: IMAGES.massage,
  },
  {
    id: 'home',
    title: 'preferences.home.title',
    subtitle: 'preferences.home.subtitle',
    tags: ['preferences.home.tag1', 'preferences.home.tag2'],
    image: IMAGES.salon,
  },
  {
    id: 'fashion',
    title: 'preferences.fashion.title',
    subtitle: 'preferences.fashion.subtitle',
    tags: ['preferences.fashion.tag1', 'preferences.fashion.tag2'],
    image: IMAGES.abaya,
  },
];
