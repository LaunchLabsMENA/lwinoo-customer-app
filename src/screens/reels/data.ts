import type { Localized } from '../fashion/data';

// Placeholder reels (Mixkit free stock clips). Swap for the reels API later.
const mixkit = (id: number) => ({
  video: { uri: `https://assets.mixkit.co/videos/${id}/${id}-720.mp4` },
  poster: { uri: `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg` },
});

const L = (en: string, ar: string): Localized => ({ en, ar });

export type Reel = {
  id: string;
  video: { uri: string };
  poster: { uri: string };
  creator: Localized;
  handle: string;
  avatar: { uri: string };
  caption: Localized;
  tag: Localized;
  likes: number;
  comments: number;
  // A reel either links to a Boutique piece or to a bookable service.
  productId?: string;
};

export const REELS: Reel[] = [
  {
    id: 'r1',
    ...mixkit(41509),
    creator: L('Al Dahabia', 'الذهبية'),
    handle: '@aldahabia.atelier',
    avatar: mixkit(41509).poster,
    caption: L(
      'First look at the Eid Privé Edit ✨ hand-spun silk that moves with you.',
      'نظرة أولى على إصدار عيد بريفيه ✨ حرير مغزول يدويًا ينساب مع كل حركة.',
    ),
    tag: L('Couture · Jeddah', 'أزياء راقية · جدة'),
    likes: 12400,
    comments: 318,
    productId: 'noor-layered-kaftan',
  },
  {
    id: 'r2',
    ...mixkit(39875),
    creator: L('Mona Artistry', 'منى آرتستري'),
    handle: '@mona.artistry',
    avatar: mixkit(39875).poster,
    caption: L(
      'Soft glam for evening events. Dewy base, sculpted brows, and a satin lip.',
      'مكياج ناعم لسهرات المناسبات: بشرة ندية، حواجب محددة، وشفاه ساتان.',
    ),
    tag: L('Makeup · Riyadh', 'مكياج · الرياض'),
    likes: 8900,
    comments: 204,
  },
  {
    id: 'r3',
    ...mixkit(34487),
    creator: L('Salon Nour Privé', 'صالون نور بريفيه'),
    handle: '@nour.prive',
    avatar: mixkit(34487).poster,
    caption: L(
      'Behind the scenes: our signature blowout in under 30 minutes.',
      'خلف الكواليس: تسريحة البلو آوت المميزة لدينا في أقل من 30 دقيقة.',
    ),
    tag: L('Hair · Riyadh', 'شعر · الرياض'),
    likes: 5300,
    comments: 97,
  },
  {
    id: 'r4',
    ...mixkit(42296),
    creator: L('Nour Couture', 'نور كوتور'),
    handle: '@nourcouture',
    avatar: mixkit(42296).poster,
    caption: L(
      'Weekend styling with the Crepe Gold Thread abaya. Which tone is your favourite?',
      'تنسيق نهاية الأسبوع مع عباية الكريب بخيوط ذهبية. أي لون تفضلين؟',
    ),
    tag: L('Fashion · Riyadh', 'أزياء · الرياض'),
    likes: 15700,
    comments: 462,
    productId: 'crepe-gold-thread',
  },
];
