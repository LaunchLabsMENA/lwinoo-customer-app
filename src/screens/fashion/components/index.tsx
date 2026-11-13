import { FC, ReactNode, useCallback, useState } from 'react';
import {
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  TextStyle,
  useWindowDimensions,
  View,
  ViewStyle,
} from 'react-native';
import { ChevronLeft, ChevronRight, Heart, LucideIcon, Star } from 'lucide-react-native';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { DirectionScroll } from '../../../components/direction-scroll';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n } from '../../../i18n';
import { Price } from '../../home/components';
import type { Localized, Product } from '../data';

export { Price };

// Picks the current language from catalogue copy.
export const useLocalized = () => {
  const { locale } = useI18n();
  return useCallback((text: Localized) => text[locale], [locale]);
};

export const FASHION = {
  // Slightly deeper ivory than the app surface, matching the boutique mocks.
  bg: '#F6EEEA',
  card: COLORS.white,
  chip: '#EFE4DF',
  gold: '#B8935A',
  star: '#F5B300',
};

type CircleButtonProps = {
  icon: LucideIcon;
  onPress?: () => void;
  label: string;
  variant?: 'light' | 'glass';
  style?: StyleProp<ViewStyle>;
  children?: ReactNode;
};

export const CircleButton: FC<CircleButtonProps> = ({ icon: Icon, onPress, label, variant = 'light', style, children }) => (
  <Pressable
    onPress={onPress}
    hitSlop={6}
    accessibilityRole="button"
    accessibilityLabel={label}
    style={({ pressed }) => [styles.circle, variant === 'glass' && styles.circleGlass, pressed && styles.pressed, style]}
  >
    <Icon size={18} color={variant === 'glass' ? COLORS.white : COLORS.ink} strokeWidth={1.9} />
    {children}
  </Pressable>
);

export const BackCircle: FC<{ onPress: () => void; variant?: 'light' | 'glass' }> = ({ onPress, variant }) => {
  const { isRTL, t } = useI18n();
  return <CircleButton icon={isRTL ? ChevronRight : ChevronLeft} onPress={onPress} label={t('common.back')} variant={variant} />;
};

// Centered title with an optional back button and trailing action.
export const TopBar: FC<{ title: string; onBack?: () => void; right?: ReactNode }> = ({ title, onBack, right }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.topBar, { flexDirection: row }]}>
      <View style={styles.topSide}>{onBack ? <BackCircle onPress={onBack} /> : null}</View>
      <TextCustom style={styles.topTitle} numberOfLines={1} accessibilityRole="header">
        {title}
      </TextCustom>
      <View style={[styles.topSide, styles.topRight]}>{right}</View>
    </View>
  );
};

// Favourite toggle. Guests are asked to sign in first.
export const HeartButton: FC<{ style?: StyleProp<ViewStyle>; size?: number }> = ({ style, size = 30 }) => {
  const [on, setOn] = useState(false);
  const { requireAuth } = useAuthGate();
  const { t } = useI18n();
  return (
    <Pressable
      hitSlop={6}
      onPress={() => requireAuth('favourite') && setOn(v => !v)}
      accessibilityRole="button"
      accessibilityState={{ selected: on }}
      accessibilityLabel={t('fashion.favourite')}
      style={[styles.heart, { width: size, height: size, borderRadius: size / 2 }, style]}
    >
      <Heart size={size * 0.5} color={on ? COLORS.brandDeep : COLORS.ink} fill={on ? COLORS.brandDeep : 'transparent'} strokeWidth={1.8} />
    </Pressable>
  );
};

type PillTone = 'dark' | 'light' | 'rose' | 'success' | 'glass';

export const Pill: FC<{ label: string; tone?: PillTone; style?: StyleProp<ViewStyle>; icon?: LucideIcon }> = ({
  label,
  tone = 'light',
  style,
  icon: Icon,
}) => (
  <View style={[styles.pill, PILL_BG[tone], style, { flexDirection: useI18n().row }]}>
    {Icon ? <Icon size={10} color={PILL_TEXT[tone].color as string} /> : null}
    <TextCustom style={[styles.pillText, PILL_TEXT[tone]]}>{label}</TextCustom>
  </View>
);

export const Eyebrow: FC<{ children: ReactNode; style?: StyleProp<TextStyle> }> = ({ children, style }) => (
  <TextCustom style={[styles.eyebrow, style]}>{children}</TextCustom>
);

export const Rating: FC<{ rating: string; reviews?: number; size?: number }> = ({ rating, reviews, size = 11 }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.rating, { flexDirection: row }]}>
      <Star size={size} color={FASHION.star} fill={FASHION.star} />
      <TextCustom style={[styles.ratingText, { fontSize: size }]}>
        {reviews != null ? `${rating} (${reviews})` : rating}
      </TextCustom>
    </View>
  );
};

export const SizeSelector: FC<{
  sizes: string[];
  value: string;
  onChange: (size: string) => void;
  compact?: boolean;
}> = ({ sizes, value, onChange, compact }) => {
  const { t, row } = useI18n();
  return (
    <View style={[styles.sizes, { flexDirection: row }]}>
      {sizes.map(s => {
        const selected = s === value;
        const label = s === 'FREE' ? t('fashion.freeSize') : s;
        return (
          <Pressable
            key={s}
            onPress={() => onChange(s)}
            accessibilityRole="radio"
            accessibilityState={{ selected }}
            style={[styles.size, compact && styles.sizeCompact, s === 'FREE' && styles.sizeWide, selected && styles.sizeOn]}
          >
            <TextCustom style={[styles.sizeText, compact && styles.sizeTextCompact, selected && styles.sizeTextOn]}>{label}</TextCustom>
          </Pressable>
        );
      })}
    </View>
  );
};

export const DarkButton: FC<{
  title: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'outline';
}> = ({ title, onPress, style, size = 'sm', variant = 'dark' }) => (
  <Pressable
    onPress={onPress}
    accessibilityRole="button"
    style={({ pressed }) => [
      styles.button,
      size === 'md' && styles.buttonMd,
      size === 'lg' && styles.buttonLg,
      variant === 'outline' && styles.buttonOutline,
      pressed && styles.pressed,
      style,
    ]}
  >
    <TextCustom
      style={[styles.buttonText, size !== 'sm' && styles.buttonTextLg, variant === 'outline' && styles.buttonTextOutline]}
    >
      {title}
    </TextCustom>
  </Pressable>
);

// Full-width paged image gallery with dots; overlay children sit on top (back / share / badges).
export const ImageCarousel: FC<{ images: { uri: string }[]; height: number; children?: ReactNode; radius?: number }> = ({
  images,
  height,
  children,
  radius = 0,
}) => {
  const { width } = useWindowDimensions();
  const { isRTL, row } = useI18n();
  const [index, setIndex] = useState(0);
  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / width);
    setIndex(isRTL ? images.length - 1 - page : page);
  };
  return (
    <View style={[styles.carousel, { height, borderBottomLeftRadius: radius, borderBottomRightRadius: radius }]}>
      <DirectionScroll pagingEnabled onMomentumScrollEnd={onScroll}>
        {images.map((img, i) => (
          <Image key={`${img.uri}-${i}`} source={img} style={{ width, height }} />
        ))}
      </DirectionScroll>
      {children}
      {images.length > 1 ? (
        <View style={[styles.carouselDots, { flexDirection: row }]} pointerEvents="none">
          {images.map((img, i) => (
            <View key={`${img.uri}-dot-${i}`} style={[styles.carouselDot, i === index && styles.carouselDotOn]} />
          ))}
        </View>
      ) : null}
    </View>
  );
};

// Two-up product tile used in "Trending Drops".
export const ProductTile: FC<{
  product: Product;
  atelierName: string;
  width: number;
  onPress: () => void;
  onAdd: () => void;
}> = ({ product, atelierName, width, onPress, onAdd }) => {
  const { t, row } = useI18n();
  const l = useLocalized();
  return (
    <Pressable onPress={onPress} style={[styles.tile, { width }]} accessibilityRole="button" accessibilityLabel={l(product.name)}>
      <View>
        <Image source={product.images[0]} style={styles.tileImage} />
        {product.badge ? <Pill label={t(product.badge)} tone="light" style={styles.tileBadge} /> : null}
        <HeartButton style={styles.tileHeart} size={28} />
      </View>
      <View style={styles.tileBody}>
        <Eyebrow>{atelierName}</Eyebrow>
        <TextCustom style={styles.tileName} numberOfLines={1}>
          {l(product.name)}
        </TextCustom>
        <View style={[styles.tileMeta, { flexDirection: row }]}>
          <Price amount={product.price} size={13} />
          <Rating rating={product.rating} size={10} />
        </View>
        <DarkButton title={t('fashion.addToCart')} onPress={onAdd} style={styles.tileButton} />
      </View>
    </Pressable>
  );
};

export const SectionTitle: FC<{
  title: string;
  action?: string;
  onAction?: () => void;
  right?: ReactNode;
  style?: StyleProp<ViewStyle>;
}> = ({ title, action, onAction, right, style }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.section, { flexDirection: row }, style]}>
      <HeadingText style={styles.sectionTitle}>{title}</HeadingText>
      {right}
      {action ? (
        <Pressable onPress={onAction} hitSlop={8} accessibilityRole="button">
          <TextCustom style={styles.sectionAction}>{action}</TextCustom>
        </Pressable>
      ) : null}
    </View>
  );
};

const PILL_BG: Record<PillTone, ViewStyle> = {
  dark: { backgroundColor: COLORS.darkBrown },
  light: { backgroundColor: 'rgba(255,255,255,0.94)' },
  rose: { backgroundColor: COLORS.brandSoft },
  success: { backgroundColor: COLORS.successSoft },
  glass: { backgroundColor: 'rgba(40,28,24,0.55)' },
};

const PILL_TEXT: Record<PillTone, TextStyle> = {
  dark: { color: COLORS.white },
  light: { color: COLORS.ink },
  rose: { color: COLORS.brandDeep },
  success: { color: COLORS.success },
  glass: { color: COLORS.white },
};

export const shadow: ViewStyle = {
  shadowColor: COLORS.darkBrown,
  shadowOpacity: 0.06,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
};

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.82,
  },
  circle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow,
  },
  circleGlass: {
    backgroundColor: 'rgba(40,28,24,0.35)',
    shadowOpacity: 0,
    elevation: 0,
  },
  topBar: {
    height: 52,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  topSide: {
    width: 44,
  },
  topRight: {
    alignItems: 'flex-end',
  },
  topTitle: {
    flex: 1,
    textAlign: 'center',
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  heart: {
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    alignSelf: 'flex-start',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  pillText: {
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    letterSpacing: 0.3,
  },
  eyebrow: {
    fontFamily: FONTS.semiBold,
    fontSize: 9,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: COLORS.inkMuted,
  },
  rating: {
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontFamily: FONTS.medium,
    color: COLORS.ink,
  },
  sizes: {
    flexWrap: 'wrap',
    gap: 8,
  },
  size: {
    minWidth: 46,
    height: 38,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sizeCompact: {
    minWidth: 34,
    height: 26,
    borderRadius: 7,
    paddingHorizontal: 6,
  },
  sizeWide: {
    paddingHorizontal: 14,
  },
  sizeOn: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown,
  },
  sizeText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
  },
  sizeTextCompact: {
    fontSize: 11,
  },
  sizeTextOn: {
    color: COLORS.white,
  },
  button: {
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  buttonMd: {
    height: 44,
    borderRadius: 22,
  },
  buttonLg: {
    height: 52,
    borderRadius: 26,
  },
  buttonOutline: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  buttonTextLg: {
    fontSize: 15,
  },
  buttonTextOutline: {
    color: COLORS.ink,
  },
  carousel: {
    overflow: 'hidden',
    backgroundColor: COLORS.brandSoft,
  },
  carouselDots: {
    position: 'absolute',
    bottom: 14,
    alignSelf: 'center',
    gap: 5,
  },
  carouselDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.55)',
  },
  carouselDotOn: {
    width: 16,
    backgroundColor: COLORS.white,
  },
  tile: {
    borderRadius: 16,
    backgroundColor: FASHION.card,
    overflow: 'hidden',
    ...shadow,
  },
  tileImage: {
    width: '100%',
    height: 170,
    backgroundColor: COLORS.brandSoft,
  },
  tileBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  tileHeart: {
    position: 'absolute',
    top: 8,
    right: 8,
  },
  tileBody: {
    padding: 10,
    gap: 3,
  },
  tileName: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  tileMeta: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  tileButton: {
    marginTop: 8,
  },
  section: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 26,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 19,
  },
  sectionAction: {
    fontSize: 12,
    color: COLORS.brandDeep,
  },
});
