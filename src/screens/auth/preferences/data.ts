import { IMAGES } from '../../../assets/images';

// Local artwork for categories the server has no image for, keyed by category slug.
export const CATEGORY_IMAGES: Record<string, { uri: string }> = {
  'hair-styling': IMAGES.hair,
  'makeup-lashes': IMAGES.makeup,
  'nails-henna': IMAGES.nails,
  'skin-facial': IMAGES.facial,
  'spa-body-wellness': IMAGES.massage,
  'at-home-beauty': IMAGES.salon,
  'abayas-atelier-fashion': IMAGES.abaya,
};
