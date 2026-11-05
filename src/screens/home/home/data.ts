import { IMAGES } from '../../../assets/images';
import type { TranslationKey } from '../../../i18n';

// Text fields are translation keys; names of businesses and people stay as-is.

export const BANNERS: { id: string; tag: TranslationKey; title: TranslationKey; subtitle: TranslationKey; image: { uri: string } }[] = [
  { id: 'b1', tag: 'home.banner1.tag', title: 'home.banner1.title', subtitle: 'home.banner1.subtitle', image: IMAGES.glam },
  { id: 'b2', tag: 'home.banner2.tag', title: 'home.banner2.title', subtitle: 'home.banner2.subtitle', image: IMAGES.bridal },
  { id: 'b3', tag: 'home.banner3.tag', title: 'home.banner3.title', subtitle: 'home.banner3.subtitle', image: IMAGES.spa },
];

export const CATEGORIES: { id: string; label: TranslationKey; image: { uri: string } }[] = [
  { id: 'c1', label: 'home.category.hairExtension', image: IMAGES.hair },
  { id: 'c2', label: 'home.category.makeupArtists', image: IMAGES.makeup },
  { id: 'c3', label: 'home.category.occasion', image: IMAGES.fashion },
  { id: 'c4', label: 'home.category.nails', image: IMAGES.nails },
];

// waitMinutes: null means available now.
export const AVAILABLE_NOW: {
  id: string;
  waitMinutes: number | null;
  name: string;
  subtitle: TranslationKey;
  price: number;
  image: { uri: string };
}[] = [
  { id: 'a1', waitMinutes: 15, name: 'Salon Nour Privé', subtitle: 'home.avail.hairCouture', price: 180, image: IMAGES.salon },
  { id: 'a2', waitMinutes: null, name: 'Reem Bridal Studio', subtitle: 'home.avail.bridalHenna', price: 220, image: IMAGES.bridal },
  { id: 'a3', waitMinutes: 30, name: 'Lumière Spa', subtitle: 'home.avail.facials', price: 160, image: IMAGES.facial },
];

export type ServiceItem = {
  id: string;
  title: TranslationKey;
  subtitle: TranslationKey;
  price: number;
  rating: string;
  image: { uri: string };
};

export const SPOTLIGHT_DEALS: ServiceItem[] = [
  { id: 's1', title: 'home.deal.weddingGown', subtitle: 'home.deal.weddingGownSub', price: 180, rating: '5.0 (248)', image: IMAGES.bridal },
  { id: 's2', title: 'home.deal.hejazi', subtitle: 'home.deal.hejaziSub', price: 180, rating: '5.0 (248)', image: IMAGES.fashion },
  { id: 's3', title: 'home.deal.eveningGlam', subtitle: 'home.deal.eveningGlamSub', price: 150, rating: '4.9 (190)', image: IMAGES.makeup },
];

export const MASTER_STYLISTS: {
  id: string;
  name: string;
  badge: TranslationKey;
  subtitle: TranslationKey;
  rating: string;
  from: number;
  image: { uri: string };
}[] = [
  { id: 'm1', name: 'Mona Artistry', badge: 'home.stylist.vipPro', subtitle: 'home.stylist.editorial', rating: '5.0', from: 450, image: IMAGES.portrait1 },
  { id: 'm2', name: 'Sanah Lena', badge: 'home.stylist.organicSpa', subtitle: 'home.stylist.skinTherapy', rating: '5.0', from: 320, image: IMAGES.portrait2 },
];

export const WELLNESS: ServiceItem[] = [
  { id: 'w1', title: 'home.wellness.spaMassage', subtitle: 'home.wellness.deepTissue', price: 180, rating: '5.0 (248)', image: IMAGES.massage },
  { id: 'w2', title: 'home.wellness.swedish', subtitle: 'home.wellness.deepTissue', price: 180, rating: '5.0 (248)', image: IMAGES.wellness },
  { id: 'w3', title: 'home.wellness.hotStone', subtitle: 'home.wellness.hotStoneSub', price: 210, rating: '4.9 (132)', image: IMAGES.spa },
];

export const MOST_BOOKED: { id: string; name: string; tagline: TranslationKey }[] = [
  { id: 'mb1', name: 'OMBRE', tagline: 'home.brand.beautySalon' },
  { id: 'mb2', name: 'nailed', tagline: 'home.brand.beautySalon' },
  { id: 'mb3', name: 'Dahab', tagline: 'home.brand.spaWellness' },
];

export const MAKEUP_ARTISTS: { id: string; name: string; role: TranslationKey; image: { uri: string } }[] = [
  { id: 'ma1', name: 'Namia Ijaz', role: 'home.role.hairStylist', image: IMAGES.portrait3 },
  { id: 'ma2', name: 'Esra Al Sheikh', role: 'home.role.makeupArtist', image: IMAGES.portrait4 },
  { id: 'ma3', name: 'Sadia Tariq', role: 'home.role.makeupArtist', image: IMAGES.portrait2 },
];

export const OFFERS = [
  { id: 'o1', brand: 'LWINOO', percent: 10, code: 'B612' },
  { id: 'o2', brand: 'tamara', percent: 10, code: 'B612' },
  { id: 'o3', brand: 'tabby', percent: 15, code: 'GLOW15' },
];
