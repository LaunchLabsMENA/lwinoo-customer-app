import { IMAGES } from '../../../assets/images';

export const BANNERS = [
  {
    id: 'b1',
    tag: 'PRIVATE CONCIERGE',
    title: 'Ramadan and Eid\nCouture Glamour',
    subtitle: 'Book exceptional home artists for\nyour festive celebrations',
    image: IMAGES.glam,
  },
  {
    id: 'b2',
    tag: 'BRIDAL SUITE',
    title: 'Your Wedding,\nPerfected',
    subtitle: 'Bridal makeup, hair & henna\nin one booking',
    image: IMAGES.bridal,
  },
  {
    id: 'b3',
    tag: 'WELLNESS',
    title: 'Spa Rituals\nAt Home',
    subtitle: 'Certified therapists at\nyour doorstep',
    image: IMAGES.spa,
  },
];

export const CATEGORIES = [
  { id: 'c1', label: 'Hair Extension', image: IMAGES.hair },
  { id: 'c2', label: 'Makeup Artists', image: IMAGES.makeup },
  { id: 'c3', label: 'Occasion', image: IMAGES.fashion },
  { id: 'c4', label: 'Nails', image: IMAGES.nails },
];

export const AVAILABLE_NOW = [
  { id: 'a1', badge: 'Wait: 15 min', name: 'Salon Nour Privé', subtitle: 'Hair Haute Couture & Rituals', price: 180, image: IMAGES.salon },
  { id: 'a2', badge: 'Available Now', name: 'Reem Bridal Studio', subtitle: 'Bridal Makeup & Henna', price: 220, image: IMAGES.bridal },
  { id: 'a3', badge: 'Wait: 30 min', name: 'Lumière Spa', subtitle: 'Facials & Glow Rituals', price: 160, image: IMAGES.facial },
];

export const SPOTLIGHT_DEALS = [
  { id: 's1', title: 'Wedding Gown', subtitle: 'Bridal Haute Couture & Rituals', price: 180, rating: '5.0 (248)', image: IMAGES.bridal },
  { id: 's2', title: 'Hejazi', subtitle: 'Traditional Dresses with Rituals', price: 180, rating: '5.0 (248)', image: IMAGES.fashion },
  { id: 's3', title: 'Evening Glam', subtitle: 'Soft Glam & Lashes', price: 150, rating: '4.9 (190)', image: IMAGES.makeup },
];

export const MASTER_STYLISTS = [
  { id: 'm1', name: 'Mona Artistry', badge: 'VIP Pro', subtitle: 'Editorial & Royal Makeup', rating: '5.0', from: 450, image: IMAGES.portrait1 },
  { id: 'm2', name: 'Sanah Lena', badge: 'Organic Spa', subtitle: 'Skin Therapy & Facials', rating: '5.0', from: 320, image: IMAGES.portrait2 },
];

export const WELLNESS = [
  { id: 'w1', title: 'Spa & Massage', subtitle: 'Relaxation with deep tissue massage', price: 180, rating: '5.0 (248)', image: IMAGES.massage },
  { id: 'w2', title: 'Swedish Massage', subtitle: 'Relaxation with deep tissue massage', price: 180, rating: '5.0 (248)', image: IMAGES.wellness },
  { id: 'w3', title: 'Hot Stone', subtitle: 'Warm basalt stone therapy', price: 210, rating: '4.9 (132)', image: IMAGES.spa },
];

export const MOST_BOOKED = [
  { id: 'mb1', name: 'OMBRE', tagline: 'beauty salon' },
  { id: 'mb2', name: 'nailed', tagline: 'beauty salon' },
  { id: 'mb3', name: 'Dahab', tagline: 'spa & wellness' },
];

export const MAKEUP_ARTISTS = [
  { id: 'ma1', name: 'Namia Ijaz', role: 'Hair Stylist', image: IMAGES.portrait3 },
  { id: 'ma2', name: 'Esra Al Sheikh', role: 'Makeup Artist', image: IMAGES.portrait4 },
  { id: 'ma3', name: 'Sadia Tariq', role: 'Makeup Artist', image: IMAGES.portrait2 },
];

export const OFFERS = [
  { id: 'o1', brand: 'LWINOO', title: 'Extra 10%', code: 'B612' },
  { id: 'o2', brand: 'tamara', title: 'Extra 10%', code: 'B612' },
  { id: 'o3', brand: 'tabby', title: 'Extra 15%', code: 'GLOW15' },
];
