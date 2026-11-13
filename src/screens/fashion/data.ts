import { IMAGES } from '../../assets/images';
import type { TranslationKey } from '../../i18n';

// Static catalogue for the Boutique tab. Catalogue copy carries both languages (as the API will);
// interface labels live in the translation files.

export type Localized = { en: string; ar: string };
type Img = { uri: string };

const L = (en: string, ar: string): Localized => ({ en, ar });

export type FashionCategory = 'abayas' | 'evening' | 'bridal' | 'bisht';

export type Tone = { id: string; name: Localized; color: string };

export type Product = {
  id: string;
  atelierId: string;
  category: FashionCategory;
  name: Localized;
  subtitle: Localized;
  description: Localized;
  price: number;
  rating: string;
  reviews: number;
  images: Img[];
  badge?: TranslationKey;
  sizes: string[];
  tones: Tone[];
};

export type Atelier = {
  id: string;
  name: Localized;
  specialty: Localized;
  city: Localized;
  rating: string;
  reviews: number;
  badge: TranslationKey;
  perk: TranslationKey;
  hours: string;
  followers: string;
  following: string;
  sales: string;
  images: Img[];
};

const TONES: Tone[] = [
  { id: 'navy', name: L('Midnight Navy', 'كحلي ليلي'), color: '#1F2A44' },
  { id: 'noir', name: L('Noir Black', 'أسود داكن'), color: '#2B2522' },
  { id: 'pearl', name: L('Pearl Champagne', 'شمبانيا لؤلؤية'), color: '#E9DCCB' },
  { id: 'taupe', name: L('Desert Taupe', 'رملي صحراوي'), color: '#7A6150' },
];

const ALPHA_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const LENGTH_SIZES = ['52', '54', '56', '58'];

export const ATELIERS: Atelier[] = [
  {
    id: 'al-dahabia',
    name: L('Al Dahabia', 'الذهبية'),
    specialty: L('Bridal Couture', 'أزياء العرائس الراقية'),
    city: L('Jeddah', 'جدة'),
    rating: '5.0',
    reviews: 10,
    badge: 'fashion.badge.topSeller',
    perk: 'fashion.perk.nextDayFitting',
    hours: '9AM – 9PM',
    followers: '4.2K',
    following: '217',
    sales: '1.6K',
    images: [IMAGES.fashionHijabCoat, IMAGES.fashionRack, IMAGES.fashionWhiteFlow],
  },
  {
    id: 'nour-couture',
    name: L('Nour Couture', 'نور كوتور'),
    specialty: L('Riyadh · Paris Fashion', 'الرياض · أزياء باريسية'),
    city: L('Riyadh', 'الرياض'),
    rating: '4.9',
    reviews: 86,
    badge: 'fashion.badge.expressMake',
    perk: 'fashion.perk.exclusiveBisht',
    hours: '10AM – 10PM',
    followers: '3.1K',
    following: '142',
    sales: '980',
    images: [IMAGES.fashionCamelCoat, IMAGES.fashionRack2, IMAGES.fashionIvory],
  },
  {
    id: 'al-khayyat',
    name: L('Al Khayyat', 'الخيّاط'),
    specialty: L('Hand-Embroidered Kaftans', 'قفاطين مطرزة يدويًا'),
    city: L('Riyadh', 'الرياض'),
    rating: '4.8',
    reviews: 54,
    badge: 'fashion.badge.bespoke',
    perk: 'fashion.perk.homeFitting',
    hours: '9AM – 8PM',
    followers: '2.4K',
    following: '98',
    sales: '640',
    images: [IMAGES.fashionFloralGown, IMAGES.fashionAtelier, IMAGES.fashionGreenGown],
  },
];

const ABAYA_DESC = L(
  'An elegant hand-embroidered abaya in premium crepe fabric. Gold thread detailing along the cuffs and collar. Fully lined for comfort.',
  'عباية أنيقة مطرزة يدويًا من قماش الكريب الفاخر، بتفاصيل من خيوط ذهبية على الأكمام والياقة. مبطّنة بالكامل لراحة تامة.',
);

export const PRODUCTS: Product[] = [
  // Trending / Al Dahabia
  {
    id: 'satin-abaya',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Satin Abaya', 'عباية ساتان'),
    subtitle: L('Midnight Navy · Pure Crepe', 'كحلي ليلي · كريب خالص'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 10,
    images: [IMAGES.fashionBlackCoat, IMAGES.fashionDarkCoat, IMAGES.fashionHijabCoat],
    badge: 'fashion.badge.bestseller',
    sizes: ALPHA_SIZES,
    tones: TONES,
  },
  {
    id: 'crepe-gold-thread',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Crepe Gold Thread', 'كريب بخيوط ذهبية'),
    subtitle: L('Camel Sand · Gold Piping', 'رملي جملي · حواف ذهبية'),
    description: ABAYA_DESC,
    price: 180,
    rating: '4.9',
    reviews: 32,
    images: [IMAGES.fashionCamelCoat, IMAGES.fashionRack],
    badge: 'fashion.badge.newDrop',
    sizes: ALPHA_SIZES,
    tones: TONES.slice(1),
  },
  {
    id: 'lace-royal-kaftan',
    atelierId: 'al-khayyat',
    category: 'evening',
    name: L('Lace Royal Kaftan', 'قفطان ملكي بالدانتيل'),
    subtitle: L('Rose Bloom · Chantilly Lace', 'وردي · دانتيل شانتيي'),
    description: ABAYA_DESC,
    price: 180,
    rating: '4.9',
    reviews: 21,
    images: [IMAGES.fashionFloralGown, IMAGES.fashionGreenGown],
    badge: 'fashion.badge.limited',
    sizes: ALPHA_SIZES,
    tones: TONES,
  },
  {
    id: 'velvet-midnight-bisht',
    atelierId: 'nour-couture',
    category: 'bisht',
    name: L('Velvet Midnight Bisht', 'بشت مخملي ليلي'),
    subtitle: L('Deep Noir · Zari Trim', 'أسود عميق · حواف زري'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 14,
    images: [IMAGES.fashionDarkCoat, IMAGES.fashionBlackCoat],
    badge: 'fashion.badge.bespoke',
    sizes: ALPHA_SIZES,
    tones: TONES.slice(0, 2),
  },
  // Eid collection pieces
  {
    id: 'nayla-draped-silk',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Nayla Draped Silk Abaya', 'عباية نايلا الحريرية المنسدلة'),
    subtitle: L('Midnight Navy · Fluid Silhouette', 'كحلي ليلي · قصّة انسيابية'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 18,
    images: [IMAGES.fashionHijabCoat, IMAGES.fashionBlackCoat],
    sizes: LENGTH_SIZES,
    tones: TONES,
  },
  {
    id: 'noor-layered-kaftan',
    atelierId: 'al-dahabia',
    category: 'evening',
    name: L('Noor Layered Kaftan', 'قفطان نور متعدد الطبقات'),
    subtitle: L('Pearl Champagne · Antique Gold', 'شمبانيا لؤلؤية · ذهبي عتيق'),
    description: ABAYA_DESC,
    price: 180,
    rating: '4.9',
    reviews: 12,
    images: [IMAGES.fashionWhiteFlow, IMAGES.fashionIvory],
    sizes: LENGTH_SIZES,
    tones: TONES,
  },
  {
    id: 'onyx-organza',
    atelierId: 'al-dahabia',
    category: 'evening',
    name: L('Onyx Organza Ceremonial', 'عباية الأونيكس الأورجانزا للمناسبات'),
    subtitle: L('French Flare Cuffs · Hand-Pleated', 'أكمام فرنسية واسعة · مطويّة يدويًا'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 9,
    images: [IMAGES.fashionBlackCoat, IMAGES.fashionDarkCoat],
    sizes: LENGTH_SIZES,
    tones: TONES.slice(0, 2),
  },
  {
    id: 'luster-velvet-bisht',
    atelierId: 'al-dahabia',
    category: 'bisht',
    name: L('Luster Velvet Evening Bisht', 'بشت السهرة المخملي اللامع'),
    subtitle: L('Deep Noir Edition · Hand-Spun', 'إصدار أسود عميق · مغزول يدويًا'),
    description: L(
      'Designed for Eid majlis hosts. Includes personalised Arabic calligraphy monogramming along the inner lining silk hem.',
      'مصمم لمضيفات مجالس العيد. يشمل تطريز اسمك بالخط العربي على حافة البطانة الحريرية الداخلية.',
    ),
    price: 180,
    rating: '5.0',
    reviews: 7,
    images: [IMAGES.fashionDarkCoat, IMAGES.fashionRack2],
    sizes: LENGTH_SIZES,
    tones: TONES.slice(0, 2),
  },
  // Atelier catalogue
  {
    id: 'satin-silk-sash',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Satin Abaya with Silk Sash', 'عباية ساتان بحزام حريري'),
    subtitle: L('Midnight Navy · Includes matching Shela', 'كحلي ليلي · مع شيلة مطابقة'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 34,
    images: [IMAGES.fashionHijabCoat, IMAGES.fashionRack],
    badge: 'fashion.badge.newEdition',
    sizes: ['52', '54', '56'],
    tones: TONES,
  },
  {
    id: 'embroidered-crepe',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Embroidered Crepe Abaya', 'عباية كريب مطرزة'),
    subtitle: L('Heavy Matte Crepe · Burnished Gold', 'كريب مطفي ثقيل · ذهبي مصقول'),
    description: ABAYA_DESC,
    price: 180,
    rating: '5.0',
    reviews: 20,
    images: [IMAGES.fashionRack2, IMAGES.fashionIvory],
    badge: 'fashion.badge.handStitched',
    sizes: ['52', '54', '56'],
    tones: TONES,
  },
  {
    id: 'double-georgette',
    atelierId: 'al-dahabia',
    category: 'abayas',
    name: L('Double Georgette Abaya', 'عباية جورجيت مزدوجة'),
    subtitle: L('Desert Taupe · Concealed Pocket', 'رملي صحراوي · جيب مخفي'),
    description: ABAYA_DESC,
    price: 180,
    rating: '4.9',
    reviews: 19,
    images: [IMAGES.fashionCamelCoat, IMAGES.fashionWhiteFlow],
    badge: 'fashion.badge.wrinkleFree',
    sizes: ['52', '54', '56'],
    tones: TONES.slice(2),
  },
  {
    id: 'monochrome-raw-silk-bisht',
    atelierId: 'al-dahabia',
    category: 'bisht',
    name: L('Monochrome Raw Silk Bisht', 'بشت حرير خام أحادي اللون'),
    subtitle: L('Charcoal & Sand · Couture Edge', 'فحمي ورملي · حواف كوتور'),
    description: ABAYA_DESC,
    price: 750,
    rating: '5.0',
    reviews: 41,
    images: [IMAGES.fashionDarkCoat, IMAGES.fashionAtelier],
    badge: 'fashion.badge.limited',
    sizes: ['FREE'],
    tones: TONES.slice(0, 2),
  },
];

export const TRENDING_IDS = ['satin-abaya', 'crepe-gold-thread', 'lace-royal-kaftan', 'velvet-midnight-bisht'];
export const ATELIER_IDS = ['satin-silk-sash', 'embroidered-crepe', 'double-georgette', 'monochrome-raw-silk-bisht'];

export const getProduct = (id: string): Product => PRODUCTS.find(p => p.id === id) ?? PRODUCTS[0];
export const getAtelier = (id: string): Atelier => ATELIERS.find(a => a.id === id) ?? ATELIERS[0];

export const HOME_FILTERS: { id: FashionCategory | 'all'; label: TranslationKey }[] = [
  { id: 'all', label: 'fashion.filter.all' },
  { id: 'abayas', label: 'fashion.filter.abayas' },
  { id: 'evening', label: 'fashion.filter.evening' },
  { id: 'bisht', label: 'fashion.filter.bisht' },
];

export type CollectionPiece = {
  productId: string;
  tag: Localized;
  overlay?: Localized;
  lowStock?: Localized;
  split?: boolean;
};

export const COLLECTION = {
  id: 'eid-prive-2026',
  title: L('Eid Privé Collection 2026', 'مجموعة عيد بريفيه 2026'),
  heading: L('The Eid Privé Edit', 'إصدار عيد بريفيه'),
  previewTitle: L('The Eid Privé\nEdit 2026', 'إصدار عيد بريفيه\n2026'),
  maison: L('Maison Al Dahabia · Jeddah Atelier', 'دار الذهبية · مشغل جدة'),
  byline: L('Maison Al Dahabia & Noor', 'دار الذهبية ونور'),
  description: L(
    'A celebration of timeless modesty rooted in the earth-toned geometries of classical Najdi architecture, hand-spun Tokushima Japanese silks, and antique metallic zardozi threads.',
    'احتفاء بالحشمة الخالدة المستوحاة من الأشكال الهندسية الترابية للعمارة النجدية الكلاسيكية، وحرير توكوشيما الياباني المغزول يدويًا، وخيوط الزردوزي المعدنية العتيقة.',
  ),
  hero: IMAGES.fashionWhiteFlow,
  previewImage: IMAGES.fashionGreenGown,
  pieces: [
    { productId: 'nayla-draped-silk', tag: L('Lead Piece 01/04', 'القطعة الرئيسية 01/04') },
    {
      productId: 'noor-layered-kaftan',
      tag: L('Signature 02/04', 'القطعة المميزة 02/04'),
      overlay: L('Sheer Silk Veil Included', 'يشمل طرحة حريرية شفافة'),
    },
    {
      productId: 'onyx-organza',
      tag: L('Ceremonial 03/04', 'قطعة المناسبات 03/04'),
      lowStock: L('Only 3 units left in Size 56', 'تبقّى 3 قطع فقط بمقاس 56'),
    },
    {
      productId: 'luster-velvet-bisht',
      tag: L('Grand Soirée 04/04', 'السهرة الكبرى 04/04'),
      overlay: L('Monogram Service Available', 'خدمة التطريز بالاسم متاحة'),
      split: true,
    },
  ] as CollectionPiece[],
};

export const REVIEW = {
  initials: 'NA',
  name: L('Noura Al-Saud', 'نورة آل سعود'),
  meta: L('Verified Abaya Patron · Riyadh', 'عميلة موثّقة · الرياض'),
  body: L(
    '“The drape of this satin is unmatched. It flows so well against the skin during warm evenings and the embroidery glints exquisitely in low restaurant lighting.”',
    '«انسدال هذا الساتان لا مثيل له. ينساب بنعومة في الأمسيات الدافئة، ويتلألأ التطريز بشكل رائع تحت الإضاءة الخافتة.»',
  ),
  photos: [IMAGES.fashionBlackCoat, IMAGES.fashionHijabCoat],
  extraPhotos: 2,
};

export type DeliveryOption = {
  id: 'express' | 'boutique' | 'mobile';
  title: TranslationKey;
  detail: Localized;
  chip?: TranslationKey;
  fee: number;
};

export const DELIVERY_OPTIONS: DeliveryOption[] = [
  {
    id: 'express',
    title: 'fashion.delivery.express',
    detail: L('Villa 14, Prince Turki St, Al Nakheel, Riyadh', 'فيلا 14، شارع الأمير تركي، النخيل، الرياض'),
    chip: 'fashion.delivery.within3h',
    fee: 0,
  },
  {
    id: 'boutique',
    title: 'fashion.delivery.boutique',
    detail: L('2nd Floor, Al Hamra Tower, Olaya, Riyadh', 'الطابق الثاني، برج الحمراء، العليا، الرياض'),
    fee: 0,
  },
  {
    id: 'mobile',
    title: 'fashion.delivery.mobile',
    detail: L('Courier waits 20 mins while you try. Sizes S & M.', 'ينتظر المندوب 20 دقيقة أثناء التجربة. المقاسات S و M.'),
    fee: 25,
  },
];

export type PaymentId = 'applePay' | 'mada' | 'stcPay' | 'atelier';
