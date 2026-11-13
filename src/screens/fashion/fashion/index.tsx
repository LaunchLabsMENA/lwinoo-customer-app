import { FC, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, TextInput, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation, type NavigationProp } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { ArrowLeft, ArrowRight, Gift, Search, ShoppingBag, SlidersHorizontal, Sparkles } from 'lucide-react-native';
import type { MainTabParamList, RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { IMAGES } from '../../../assets/images';
import { HeadingText, TextCustom, useLocalizedTextStyle } from '../../../components/react-native';
import { DirectionScroll } from '../../../components/direction-scroll';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n } from '../../../i18n';
import {
  CircleButton,
  Eyebrow,
  FASHION,
  Pill,
  ProductTile,
  Rating,
  SectionTitle,
  shadow,
  TopBar,
  useLocalized,
} from '../components';
import { ATELIERS, COLLECTION, getAtelier, getProduct, HOME_FILTERS, type FashionCategory, TRENDING_IDS } from '../data';

type Props = BottomTabScreenProps<MainTabParamList, 'Fashion'>;

export const FashionScreen: FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { t, row, isRTL } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();
  const root = useNavigation<NavigationProp<RootStackParamList>>();
  const [filter, setFilter] = useState<FashionCategory | 'all'>('all');
  const searchStyle = useLocalizedTextStyle(styles.searchInput);
  const tileWidth = (width - 40 - 12) / 2;
  const Arrow = isRTL ? ArrowLeft : ArrowRight;
  const rowDir = { flexDirection: row };

  const trending = useMemo(() => {
    const all = TRENDING_IDS.map(getProduct);
    return filter === 'all' ? all : all.filter(p => p.category === filter);
  }, [filter]);

  const openProduct = (productId: string) => root.navigate('FashionProduct', { productId });
  const addToCart = (productId: string) => {
    if (!requireAuth('cart')) return;
    const p = getProduct(productId);
    root.navigate('FashionCheckout', { productId, size: p.sizes[Math.min(2, p.sizes.length - 1)] });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <TopBar
        title={t('fashion.title')}
        right={<CircleButton icon={ShoppingBag} label={t('fashion.bag')} onPress={() => requireAuth('cart')} />}
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {/* Search */}
        <View style={[styles.searchRow, rowDir]}>
          <View style={[styles.search, rowDir]}>
            <Search size={16} color={COLORS.inkMuted} />
            <TextInput placeholder={t('fashion.search')} placeholderTextColor={COLORS.placeholder} style={searchStyle} />
          </View>
          <Pressable style={styles.filterButton} accessibilityRole="button" accessibilityLabel={t('fashion.filters')}>
            <SlidersHorizontal size={17} color={COLORS.white} />
          </Pressable>
        </View>

        {/* Category chips */}
        <DirectionScroll contentContainerStyle={styles.chips}>
          {HOME_FILTERS.map(f => {
            const on = f.id === filter;
            return (
              <Pressable
                key={f.id}
                onPress={() => setFilter(f.id)}
                style={[styles.chip, on && styles.chipOn]}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <TextCustom style={[styles.chipText, on && styles.chipTextOn]}>{t(f.label)}</TextCustom>
              </Pressable>
            );
          })}
        </DirectionScroll>

        {/* Capsule preview */}
        <Pressable
          style={[styles.capsule, rowDir]}
          onPress={() => root.navigate('FashionCollection', { collectionId: COLLECTION.id })}
          accessibilityRole="button"
        >
          <View style={styles.capsuleBody}>
            <View style={[styles.capsuleEyebrow, rowDir]}>
              <View style={styles.liveDot} />
              <Eyebrow style={styles.capsuleEyebrowText}>{t('fashion.capsulePreview')}</Eyebrow>
            </View>
            <HeadingText style={styles.capsuleTitle}>{l(COLLECTION.previewTitle)}</HeadingText>
            <TextCustom style={styles.capsuleBy}>{l(COLLECTION.byline)}</TextCustom>
            <View style={[styles.capsuleCta, rowDir]}>
              <TextCustom style={styles.capsuleCtaText}>{t('fashion.exploreCollection')}</TextCustom>
              <Arrow size={13} color={COLORS.ink} />
            </View>
          </View>
          <Image source={COLLECTION.previewImage} style={styles.capsuleImage} />
        </Pressable>

        {/* Featured ateliers */}
        <SectionTitle title={t('fashion.featuredAteliers')} action={t('common.viewAll')} />
        <DirectionScroll contentContainerStyle={styles.hList}>
          {ATELIERS.map(a => (
            <Pressable
              key={a.id}
              style={styles.atelier}
              onPress={() => root.navigate('FashionAtelier', { atelierId: a.id })}
              accessibilityRole="button"
              accessibilityLabel={l(a.name)}
            >
              <View>
                <Image source={a.images[0]} style={styles.atelierImage} />
                <Pill label={t(a.badge)} tone="light" style={styles.atelierBadge} />
              </View>
              <View style={styles.atelierBody}>
                <View style={[styles.spread, rowDir]}>
                  <TextCustom style={styles.atelierName} numberOfLines={1}>
                    {l(a.name)}
                  </TextCustom>
                  <Rating rating={a.rating} size={10} />
                </View>
                <TextCustom style={styles.muted} numberOfLines={1}>
                  {`${l(a.city)} · ${l(a.specialty)}`}
                </TextCustom>
                <View style={[styles.spread, styles.atelierFooter, rowDir]}>
                  <Pill label={t(a.perk)} tone="rose" />
                  <TextCustom style={styles.link}>{t('fashion.view')}</TextCustom>
                </View>
              </View>
            </Pressable>
          ))}
        </DirectionScroll>

        {/* Gifting suite */}
        <View style={[styles.gift, rowDir]}>
          <Image source={IMAGES.fashionIvory} style={styles.giftImage} />
          <View style={styles.flex}>
            <View style={[styles.inline, rowDir]}>
              <Gift size={13} color={COLORS.brandDeep} />
              <TextCustom style={styles.giftTitle}>{t('fashion.gifting.title')}</TextCustom>
            </View>
            <TextCustom style={styles.muted}>{t('fashion.gifting.subtitle')}</TextCustom>
            <View style={[styles.inline, styles.giftMeta, rowDir]}>
              <Rating rating="5.0" size={10} />
              <TextCustom style={styles.mutedSmall}>{t('fashion.gifting.clients')}</TextCustom>
            </View>
          </View>
          <Pressable
            style={styles.giftButton}
            accessibilityRole="button"
            onPress={() => root.navigate('FashionAtelier', { atelierId: ATELIERS[0].id })}
          >
            <TextCustom style={styles.giftButtonText}>{t('fashion.view')}</TextCustom>
          </Pressable>
        </View>

        {/* Trending drops */}
        <SectionTitle
          title={t('fashion.trendingDrops')}
          right={
            <View style={[styles.curated, rowDir]}>
              <Sparkles size={11} color={COLORS.brandDeep} />
              <TextCustom style={styles.curatedText}>{t('fashion.curated')}</TextCustom>
            </View>
          }
        />
        {trending.length === 0 ? (
          <TextCustom style={styles.empty}>{t('fashion.noResults')}</TextCustom>
        ) : (
          <View style={[styles.grid, rowDir]}>
            {trending.map(p => (
              <ProductTile
                key={p.id}
                product={p}
                atelierName={l(getAtelier(p.atelierId).name)}
                width={tileWidth}
                onPress={() => openProduct(p.id)}
                onAdd={() => addToCart(p.id)}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FASHION.bg,
  },
  flex: {
    flex: 1,
  },
  inline: {
    alignItems: 'center',
    gap: 5,
  },
  spread: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 6,
  },
  muted: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  mutedSmall: {
    fontSize: 10,
    color: COLORS.inkMuted,
  },
  link: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    color: COLORS.ink,
    textDecorationLine: 'underline',
  },
  searchRow: {
    alignItems: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginTop: 4,
  },
  search: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    height: 44,
    paddingHorizontal: 14,
    borderRadius: 22,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.ink,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.darkBrown,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chips: {
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 14,
  },
  chip: {
    paddingHorizontal: 14,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  chipOn: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown,
  },
  chipText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  chipTextOn: {
    color: COLORS.white,
  },
  capsule: {
    marginTop: 16,
    marginHorizontal: 20,
    height: 176,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...shadow,
  },
  capsuleBody: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  capsuleEyebrow: {
    alignItems: 'center',
    gap: 6,
  },
  capsuleEyebrowText: {
    color: COLORS.brandDeep,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.brandDeep,
  },
  capsuleTitle: {
    marginTop: 8,
    fontSize: 22,
    lineHeight: 27,
  },
  capsuleBy: {
    marginTop: 6,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  capsuleCta: {
    marginTop: 12,
    alignItems: 'center',
    gap: 4,
  },
  capsuleCtaText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  capsuleImage: {
    width: 140,
    height: '100%',
    backgroundColor: COLORS.brandSoft,
  },
  hList: {
    gap: 12,
    paddingHorizontal: 20,
    paddingBottom: 6,
  },
  atelier: {
    width: 200,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...shadow,
  },
  atelierImage: {
    width: '100%',
    height: 110,
    backgroundColor: COLORS.brandSoft,
  },
  atelierBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
  },
  atelierBody: {
    padding: 10,
  },
  atelierName: {
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  atelierFooter: {
    marginTop: 10,
  },
  gift: {
    marginTop: 20,
    marginHorizontal: 20,
    padding: 12,
    gap: 12,
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: COLORS.white,
    ...shadow,
  },
  giftImage: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  giftTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  giftMeta: {
    marginTop: 4,
  },
  giftButton: {
    paddingHorizontal: 16,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.darkBrown,
    justifyContent: 'center',
  },
  giftButtonText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  curated: {
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.brandSoft,
  },
  curatedText: {
    fontSize: 11,
    color: COLORS.brandDeep,
  },
  grid: {
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 20,
  },
  empty: {
    textAlign: 'center',
    color: COLORS.inkMuted,
    marginTop: 12,
  },
});
