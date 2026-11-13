import { FC, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BadgeCheck, Check, CircleCheck, MapPin, Share, Sparkles, Star } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n, type TranslationKey } from '../../../i18n';
import {
  BackCircle,
  CircleButton,
  DarkButton,
  Eyebrow,
  FASHION,
  ImageCarousel,
  Pill,
  Price,
  Rating,
  shadow,
  SizeSelector,
  useLocalized,
} from '../components';
import { getAtelier, getProduct, REVIEW } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'FashionProduct'>;

const SPECS: { label: TranslationKey; value: TranslationKey }[] = [
  { label: 'fashion.product.fabric', value: 'fashion.product.fabricValue' },
  { label: 'fashion.product.care', value: 'fashion.product.careValue' },
  { label: 'fashion.product.origin', value: 'fashion.product.originValue' },
];

export const FashionProductScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();
  const product = getProduct(route.params.productId);
  const atelier = getAtelier(product.atelierId);
  const [toneId, setToneId] = useState(product.tones[0]?.id);
  const [size, setSize] = useState(product.sizes[Math.min(2, product.sizes.length - 1)]);
  const tone = product.tones.find(x => x.id === toneId);
  const rowDir = { flexDirection: row };

  const addToCart = () => {
    if (requireAuth('cart')) navigation.navigate('FashionCheckout', { productId: product.id, size, toneId });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}>
        <ImageCarousel images={product.images} height={400}>
          <View style={[styles.heroBar, rowDir, { top: insets.top + 6 }]}>
            <BackCircle onPress={navigation.goBack} variant="glass" />
            <CircleButton icon={Share} label={t('fashion.share')} variant="glass" />
          </View>
        </ImageCarousel>

        <View style={styles.sheet}>
          <View style={[styles.spread, rowDir]}>
            <Pill label={t('fashion.product.verifiedBoutique')} tone="rose" icon={BadgeCheck} />
            <Pill label={t('fashion.product.inStock')} tone="success" />
          </View>

          <HeadingText style={styles.name}>{l(product.name)}</HeadingText>
          <Pressable onPress={() => navigation.navigate('FashionAtelier', { atelierId: atelier.id })} accessibilityRole="link">
            <TextCustom style={styles.atelier}>{l(atelier.name)}</TextCustom>
          </Pressable>
          <View style={[styles.inline, styles.meta, rowDir]}>
            <MapPin size={12} color={COLORS.inkMuted} />
            <TextCustom style={styles.mutedSmall}>{l(atelier.city)}</TextCustom>
            <View style={styles.metaDot} />
            <Rating rating={product.rating} reviews={product.reviews} />
          </View>
          <View style={styles.price}>
            <Price amount={product.price} size={22} />
          </View>

          {/* Tone */}
          {tone ? (
            <>
              <View style={[styles.spread, styles.blockHeader, rowDir]}>
                <TextCustom style={styles.label}>
                  {t('fashion.product.tone')} <TextCustom style={styles.labelValue}>{l(tone.name)}</TextCustom>
                </TextCustom>
                <TextCustom style={styles.mutedSmall}>{t('fashion.product.finish')}</TextCustom>
              </View>
              <View style={[styles.swatches, rowDir]}>
                {product.tones.map(x => {
                  const on = x.id === toneId;
                  return (
                    <Pressable
                      key={x.id}
                      onPress={() => setToneId(x.id)}
                      style={[styles.swatchRing, on && styles.swatchRingOn]}
                      accessibilityRole="radio"
                      accessibilityState={{ selected: on }}
                      accessibilityLabel={l(x.name)}
                    >
                      <View style={[styles.swatch, { backgroundColor: x.color }]}>
                        {on ? <Check size={14} color={COLORS.white} strokeWidth={2.5} /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          {/* Size */}
          <View style={[styles.spread, styles.blockHeader, rowDir]}>
            <TextCustom style={styles.label}>{t('fashion.size')}</TextCustom>
            <TextCustom style={styles.sizeGuide}>{t('fashion.sizeGuide')}</TextCustom>
          </View>
          <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />

          {/* Try-on perk */}
          <View style={[styles.tryOn, rowDir]}>
            <View style={styles.tryOnIcon}>
              <Sparkles size={16} color={COLORS.brandDeep} />
            </View>
            <View style={styles.flex}>
              <TextCustom style={styles.tryOnTitle}>{t('fashion.product.tryOnTitle')}</TextCustom>
              <TextCustom style={styles.tryOnBody}>{t('fashion.product.tryOnBody')}</TextCustom>
            </View>
          </View>

          <TextCustom style={styles.description}>{l(product.description)}</TextCustom>

          <View style={styles.specs}>
            {SPECS.map(s => (
              <View key={s.label} style={[styles.spec, rowDir]}>
                <TextCustom style={styles.specLabel}>{t(s.label)}</TextCustom>
                <TextCustom style={styles.specValue}>{t(s.value)}</TextCustom>
              </View>
            ))}
          </View>

          <TextCustom style={[styles.label, styles.deliveryTitle]}>{t('fashion.product.deliveryPickup')}</TextCustom>
          {(['fashion.product.deliveryDays', 'fashion.product.pickupAvailable'] as TranslationKey[]).map(key => (
            <View key={key} style={[styles.inline, styles.check, rowDir]}>
              <CircleCheck size={15} color={COLORS.success} />
              <TextCustom style={styles.checkText}>{t(key, { threshold: 200 })}</TextCustom>
            </View>
          ))}

          {/* Review */}
          <View style={styles.review}>
            <View style={[styles.inline, rowDir]}>
              <View style={styles.avatar}>
                <TextCustom style={styles.avatarText}>{REVIEW.initials}</TextCustom>
              </View>
              <View style={styles.flex}>
                <View style={[styles.inline, rowDir]}>
                  <TextCustom style={styles.reviewName}>{l(REVIEW.name)}</TextCustom>
                  <BadgeCheck size={13} color={COLORS.brandDeep} />
                </View>
                <TextCustom style={styles.mutedSmall}>{l(REVIEW.meta)}</TextCustom>
              </View>
              <View style={[styles.stars, rowDir]}>
                {[0, 1, 2, 3, 4].map(i => (
                  <Star key={i} size={11} color={FASHION.star} fill={FASHION.star} />
                ))}
              </View>
            </View>
            <TextCustom style={styles.reviewBody}>{l(REVIEW.body)}</TextCustom>
            <View style={[styles.inline, styles.reviewPhotos, rowDir]}>
              {REVIEW.photos.map((p, i) => (
                <Image key={i} source={p} style={styles.reviewPhoto} />
              ))}
              <Eyebrow style={styles.morePhotos}>{t('fashion.product.morePhotos', { count: REVIEW.extraPhotos })}</Eyebrow>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <DarkButton title={t('fashion.addToCart')} size="lg" onPress={addToCart} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  flex: {
    flex: 1,
  },
  spread: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  inline: {
    alignItems: 'center',
    gap: 6,
  },
  mutedSmall: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  heroBar: {
    position: 'absolute',
    left: 16,
    right: 16,
    justifyContent: 'space-between',
  },
  sheet: {
    marginTop: -24,
    paddingHorizontal: 20,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  name: {
    marginTop: 12,
    fontSize: 24,
  },
  atelier: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.brandDeep,
    textDecorationLine: 'underline',
  },
  meta: {
    marginTop: 8,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.inkMuted,
  },
  price: {
    marginTop: 10,
  },
  blockHeader: {
    marginTop: 20,
    marginBottom: 10,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  labelValue: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  sizeGuide: {
    fontSize: 11,
    color: COLORS.inkMuted,
    textDecorationLine: 'underline',
  },
  swatches: {
    gap: 10,
  },
  swatchRing: {
    width: 38,
    height: 38,
    borderRadius: 19,
    padding: 3,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  swatchRingOn: {
    borderColor: COLORS.ink,
  },
  swatch: {
    flex: 1,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryOn: {
    marginTop: 20,
    padding: 14,
    gap: 12,
    borderRadius: 16,
    backgroundColor: FASHION.bg,
  },
  tryOnIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tryOnTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  tryOnBody: {
    marginTop: 3,
    fontSize: 11,
    lineHeight: 16,
    color: COLORS.inkMuted,
  },
  description: {
    marginTop: 18,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.inkMuted,
  },
  specs: {
    marginTop: 14,
    gap: 10,
  },
  spec: {
    gap: 12,
  },
  specLabel: {
    width: 70,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  specValue: {
    flex: 1,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  deliveryTitle: {
    marginTop: 20,
    marginBottom: 4,
  },
  check: {
    marginTop: 8,
  },
  checkText: {
    flexShrink: 1,
    fontSize: 12,
  },
  review: {
    marginTop: 22,
    padding: 14,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    ...shadow,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.brandDeep,
  },
  reviewName: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  stars: {
    gap: 1,
  },
  reviewBody: {
    marginTop: 10,
    fontSize: 12,
    lineHeight: 18,
    fontStyle: 'italic',
  },
  reviewPhotos: {
    marginTop: 10,
  },
  reviewPhoto: {
    width: 48,
    height: 48,
    borderRadius: 10,
    backgroundColor: COLORS.brandSoft,
  },
  morePhotos: {
    marginHorizontal: 4,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: COLORS.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.hairline,
  },
});
