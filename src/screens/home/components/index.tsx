import { FC, ReactNode } from 'react';
import type { TranslationKey } from '../../../i18n';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Plus, Star } from 'lucide-react-native';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { useI18n } from '../../../i18n';

export const SectionHeader: FC<{ title: string; action?: string }> = ({ title, action }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.sectionHeader, { flexDirection: row }]}>
      <HeadingText style={styles.sectionTitle}>{title}</HeadingText>
      {action ? <TextCustom style={styles.sectionAction}>{action}</TextCustom> : null}
    </View>
  );
};

export const HScroll: FC<{ children: ReactNode }> = ({ children }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.hScroll}>
    {children}
  </ScrollView>
);

export const Price: FC<{ amount: number; size?: number }> = ({ amount, size = 15 }) => {
  const { t, isRTL } = useI18n();
  const currency = <TextCustom style={[styles.currency, { fontSize: size * 0.7 }]}>{t('common.currency')}</TextCustom>;
  // Arabic convention puts the currency after the amount.
  return (
    <TextCustom style={[styles.price, { fontSize: size }]}>
      {isRTL ? null : currency}
      {isRTL ? `${amount} ` : ` ${amount}`}
      {isRTL ? currency : null}
    </TextCustom>
  );
};

export const SmallButton: FC<{ title: string; onPress?: () => void }> = ({ title, onPress }) => (
  <Pressable style={styles.smallButton} onPress={onPress}>
    <TextCustom style={styles.smallButtonText}>{title}</TextCustom>
  </Pressable>
);

export const RatingBadge: FC<{ rating: string }> = ({ rating }) => (
  <View style={[styles.rating, { flexDirection: useI18n().row }]}>
    <Star size={10} color="#F5B300" fill="#F5B300" />
    <TextCustom style={styles.ratingText}>{rating}</TextCustom>
  </View>
);

type ServiceCardProps = {
  title: TranslationKey;
  subtitle: TranslationKey;
  price: number;
  rating: string;
  image: ImageSourcePropType;
};

// Two-up card used by "Spotlight Deals" and "Wellness and Spa".
export const ServiceCard: FC<ServiceCardProps> = ({ title, subtitle, price, rating, image }) => {
  const { t, row } = useI18n();
  return (
  <View style={styles.serviceCard}>
    <View>
      <Image source={image} style={styles.serviceImage} />
      <View style={styles.serviceRating}>
        <RatingBadge rating={rating} />
      </View>
    </View>
    <View style={styles.serviceBody}>
      <TextCustom style={styles.cardTitle} numberOfLines={1}>{t(title)}</TextCustom>
      <TextCustom style={styles.cardSub} numberOfLines={2}>{t(subtitle)}</TextCustom>
      <View style={[styles.serviceFooter, { flexDirection: row }]}>
        <Price amount={price} />
        <Pressable style={styles.plus}>
          <Plus size={16} color={COLORS.white} />
        </Pressable>
      </View>
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 28,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
  },
  sectionAction: {
    fontSize: 12,
    color: COLORS.brandDeep,
  },
  hScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  price: {
    fontFamily: FONTS.bold,
  },
  currency: {
    fontFamily: FONTS.semiBold,
  },
  smallButton: {
    paddingHorizontal: 18,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  smallButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.white,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.92)',
  },
  ratingText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  serviceCard: {
    width: 168,
    borderRadius: 16,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  serviceImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.brandSoft,
  },
  serviceRating: {
    position: 'absolute',
    left: 8,
    bottom: 8,
  },
  serviceBody: {
    padding: 10,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.inkMuted,
    minHeight: 28,
  },
  serviceFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  plus: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.brand,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
