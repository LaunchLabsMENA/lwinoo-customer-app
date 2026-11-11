import { FC, useState } from 'react';
import {
  Image,
  ImageBackground,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Bell, ChevronDown, ChevronLeft, ChevronRight, MapPin, Search, SlidersHorizontal, Sparkles, Star } from 'lucide-react-native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { MainTabParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { IMAGES } from '../../../assets/images';
import { HeadingText, TextCustom, useLocalizedTextStyle } from '../../../components/react-native';
import { useI18n } from '../../../i18n';
import { BrandGradient } from '../../../components/brand-gradient';
import { HScroll, Price, SectionHeader, ServiceCard, SmallButton } from '../components';
import { useAuthGate } from '../../../components/auth-gate';
import { DirectionScroll } from '../../../components/direction-scroll';
import {
  AVAILABLE_NOW,
  BANNERS,
  CATEGORIES,
  MAKEUP_ARTISTS,
  MASTER_STYLISTS,
  MOST_BOOKED,
  OFFERS,
  SPOTLIGHT_DEALS,
  WELLNESS,
} from './data';

type Props = BottomTabScreenProps<MainTabParamList, 'Home'>;

export const HomeScreen: FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const bannerWidth = width - 40;
  const [bannerIndex, setBannerIndex] = useState(0);
  const { t, isRTL, row } = useI18n();
  // Guests browse everything here; acting on it (book, cart, notifications) asks them to sign in.
  const { requireAuth } = useAuthGate();
  const onBook = () => requireAuth('book');
  const onAddToCart = () => requireAuth('cart');
  const searchInputStyle = useLocalizedTextStyle(styles.searchInput);
  const StripChevron = isRTL ? ChevronLeft : ChevronRight;
  const rowDir = { flexDirection: row };

  // In Arabic the first banner sits at the right end, so count pages from the right.
  const onBannerScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const page = Math.round(e.nativeEvent.contentOffset.x / (bannerWidth + 12));
    setBannerIndex(isRTL ? BANNERS.length - 1 - page : page);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: insets.bottom + 110 }}
      >
        <View style={styles.headerBg}>
          <BrandGradient id="homeGradient" colors={['#F3E1E0', '#F8EDEA', COLORS.surface]} />
        </View>

        {/* Header */}
        <View style={[styles.header, rowDir]}>
          <Image source={IMAGES.logo} style={styles.avatar} />
          <View style={styles.flex}>
            <View style={[styles.row, rowDir]}>
              <TextCustom style={styles.greeting}>{t('home.greeting', { name: 'Sara' })}</TextCustom>
              <Sparkles size={14} color={COLORS.brandDeep} />
            </View>
            <View style={[styles.row, rowDir]}>
              <MapPin size={11} color={COLORS.inkMuted} />
              <TextCustom style={styles.location}>{` ${t('home.location')} `}</TextCustom>
              <ChevronDown size={12} color={COLORS.inkMuted} />
            </View>
          </View>
          <Pressable
            style={styles.bell}
            onPress={() => requireAuth('notifications')}
            accessibilityRole="button"
            accessibilityLabel={t('guestGate.notifications')}
          >
            <Bell size={18} color={COLORS.ink} />
            <View style={styles.bellBadge}>
              <TextCustom style={styles.bellBadgeText}>2</TextCustom>
            </View>
          </Pressable>
        </View>

        {/* Register strip */}
        <View style={[styles.strip, rowDir]}>
          <Sparkles size={13} color={COLORS.white} />
          <TextCustom style={styles.stripText}>{t('home.register')}</TextCustom>
          <Sparkles size={13} color={COLORS.white} />
          <StripChevron size={16} color={COLORS.white} style={isRTL ? styles.stripChevronRtl : styles.stripChevron} />
        </View>

        {/* Search */}
        <View style={[styles.search, rowDir]}>
          <Search size={18} color={COLORS.inkMuted} />
          <TextInput placeholder={t('home.search')} placeholderTextColor={COLORS.placeholder} style={searchInputStyle} />
          <SlidersHorizontal size={18} color={COLORS.ink} />
        </View>

        {/* Hero banners */}
        <DirectionScroll
          snapToInterval={bannerWidth + 12}
          decelerationRate="fast"
          contentContainerStyle={styles.bannerList}
          onMomentumScrollEnd={onBannerScroll}
        >
          {BANNERS.map(b => (
            <ImageBackground key={b.id} source={b.image} style={[styles.banner, { width: bannerWidth }]} imageStyle={styles.bannerImage}>
              <View style={styles.bannerOverlay} />
              <View style={styles.bannerTag}>
                <TextCustom style={styles.bannerTagText}>{t(b.tag)}</TextCustom>
              </View>
              <HeadingText style={styles.bannerTitle}>{t(b.title)}</HeadingText>
              <TextCustom style={styles.bannerSub}>{t(b.subtitle)}</TextCustom>
            </ImageBackground>
          ))}
        </DirectionScroll>
        <View style={[styles.dots, rowDir]}>
          {BANNERS.map((b, i) => (
            <View key={b.id} style={[styles.dotItem, i === bannerIndex && styles.dotActive]} />
          ))}
        </View>

        {/* Categories */}
        <HScroll>
          {CATEGORIES.map(c => (
            <View key={c.id} style={styles.category}>
              <Image source={c.image} style={styles.categoryImage} />
              <TextCustom style={styles.categoryLabel}>{t(c.label)}</TextCustom>
            </View>
          ))}
        </HScroll>

        <SectionHeader title={t('home.section.immediate')} action={t('common.seeAll')} />
        <HScroll>
          {AVAILABLE_NOW.map(a => (
            <View key={a.id} style={styles.availCard}>
              <View>
                <Image source={a.image} style={styles.availImage} />
                <View style={[styles.waitBadge, rowDir]}>
                  <View style={styles.greenDot} />
                  <TextCustom style={styles.waitText}>{a.waitMinutes === null ? t('home.availableNow') : t('home.wait', { minutes: a.waitMinutes })}</TextCustom>
                </View>
              </View>
              <View style={styles.availBody}>
                <TextCustom style={styles.cardTitle}>{a.name}</TextCustom>
                <TextCustom style={styles.cardSub}>{t(a.subtitle)}</TextCustom>
                <View style={[styles.availFooter, rowDir]}>
                  <View>
                    <TextCustom style={styles.startingFrom}>{t('home.startingFrom')}</TextCustom>
                    <Price amount={a.price} size={16} />
                  </View>
                  <SmallButton title={t('common.book')} onPress={onBook} />
                </View>
              </View>
            </View>
          ))}
        </HScroll>

        <SectionHeader title={t('home.section.spotlight')} action={t('common.viewAll')} />
        <HScroll>
          {SPOTLIGHT_DEALS.map(s => (
            <ServiceCard key={s.id} {...s} onAdd={onAddToCart} />
          ))}
        </HScroll>

        <SectionHeader title={t('home.section.stylists')} action={t('common.viewAll')} />
        <View style={styles.stylists}>
          {MASTER_STYLISTS.map(m => (
            <View key={m.id} style={[styles.stylist, rowDir]}>
              <Image source={m.image} style={styles.stylistImage} />
              <View style={styles.flex}>
                <View style={[styles.row, rowDir]}>
                  <TextCustom style={styles.cardTitle}>{m.name}</TextCustom>
                  <View style={styles.stylistBadge}>
                    <TextCustom style={styles.stylistBadgeText}>{t(m.badge)}</TextCustom>
                  </View>
                </View>
                <TextCustom style={styles.cardSub}>{t(m.subtitle)}</TextCustom>
                <View style={[styles.row, styles.stylistMeta, rowDir]}>
                  <Star size={11} color="#F5B300" fill="#F5B300" />
                  <TextCustom style={styles.metaText}>{` ${t('home.stylist.meta', { rating: m.rating, price: m.from })}`}</TextCustom>
                </View>
              </View>
              <SmallButton title={t('common.book')} onPress={onBook} />
            </View>
          ))}
        </View>

        {/* Dyson promo */}
        <View style={[styles.promo, rowDir]}>
          <View style={styles.promoBody}>
            <TextCustom style={styles.promoEyebrow}>{t('home.promo.fav')}</TextCustom>
            <HeadingText style={styles.promoTitle}>Dyson Airwrap</HeadingText>
            <View style={styles.promoChip}>
              <TextCustom style={styles.promoChipText}>{t('home.promo.upTo')}</TextCustom>
            </View>
            <View style={styles.promoButton}>
              <TextCustom style={styles.promoButtonText}>{t('home.promo.getYours')}</TextCustom>
            </View>
          </View>
          <Image source={IMAGES.hairTool} style={styles.promoImage} />
        </View>

        <SectionHeader title={t('home.section.wellness')} action={t('common.viewAll')} />
        <HScroll>
          {WELLNESS.map(w => (
            <ServiceCard key={w.id} {...w} onAdd={onAddToCart} />
          ))}
        </HScroll>

        {/* Oud promo */}
        <ImageBackground source={IMAGES.perfume} style={styles.oud} imageStyle={styles.oudImage}>
          <View style={styles.oudOverlay} />
          <TextCustom style={[styles.promoEyebrow, styles.light]}>{t('home.promo.fav')}</TextCustom>
          <HeadingText style={[styles.promoTitle, styles.light]}>{t('home.oud.title')}</HeadingText>
          <View style={styles.oudButton}>
            <TextCustom style={styles.oudButtonText}>{t('home.oud.cta', { price: 180 })}</TextCustom>
          </View>
        </ImageBackground>

        <SectionHeader title={t('home.section.mostBooked')} />
        <HScroll>
          {MOST_BOOKED.map(b => (
            <View key={b.id} style={styles.brandTile}>
              <TextCustom style={styles.brandName}>{b.name}</TextCustom>
              <TextCustom style={styles.brandTagline}>{t(b.tagline)}</TextCustom>
            </View>
          ))}
        </HScroll>

        <SectionHeader title={t('home.section.makeupArtists')} />
        <HScroll>
          {MAKEUP_ARTISTS.map(a => (
            <View key={a.id} style={styles.artist}>
              <Image source={a.image} style={styles.artistImage} />
              <TextCustom style={styles.artistName}>{a.name}</TextCustom>
              <TextCustom style={styles.artistRole}>{t(a.role)}</TextCustom>
            </View>
          ))}
        </HScroll>

        <SectionHeader title={t('home.section.offers')} />
        <HScroll>
          {OFFERS.map(o => (
            <View key={o.id} style={styles.offer}>
              <TextCustom style={styles.offerBrand}>{o.brand}</TextCustom>
              <TextCustom style={styles.offerTitle}>{t('home.offer.extra', { percent: o.percent })}</TextCustom>
              <TextCustom style={styles.offerCode}>{t('home.offer.code', { code: o.code })}</TextCustom>
            </View>
          ))}
        </HScroll>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.surface,
  },
  headerBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 420,
  },
  flex: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  light: {
    color: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
  },
  greeting: {
    fontFamily: FONTS.semiBold,
    fontSize: 16,
  },
  location: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  bell: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadge: {
    position: 'absolute',
    top: 6,
    right: 7,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#E5484D',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellBadgeText: {
    fontSize: 9,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  strip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
    marginHorizontal: 20,
    height: 34,
    borderRadius: 10,
    backgroundColor: COLORS.brandDeep,
  },
  stripText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  stripChevron: {
    position: 'absolute',
    right: 10,
  },
  stripChevronRtl: {
    position: 'absolute',
    left: 10,
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 14,
    marginHorizontal: 20,
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.white,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
  },
  bannerList: {
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 16,
  },
  banner: {
    height: 170,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  bannerImage: {
    borderRadius: 18,
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    backgroundColor: 'rgba(40,28,24,0.45)',
  },
  bannerTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  bannerTagText: {
    fontFamily: FONTS.semiBold,
    fontSize: 10,
    letterSpacing: 0.8,
  },
  bannerTitle: {
    marginTop: 10,
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
    color: COLORS.white,
  },
  bannerSub: {
    marginTop: 6,
    fontSize: 11,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.85)',
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
    marginTop: 10,
    marginBottom: 16,
  },
  dotItem: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.border,
  },
  dotActive: {
    width: 16,
    backgroundColor: COLORS.brandDeep,
  },
  category: {
    alignItems: 'center',
  },
  categoryImage: {
    width: 96,
    height: 112,
    borderRadius: 16,
    backgroundColor: COLORS.brandSoft,
  },
  categoryLabel: {
    marginTop: 6,
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  cardTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  cardSub: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  availCard: {
    width: 250,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  availImage: {
    width: '100%',
    height: 120,
    backgroundColor: COLORS.brandSoft,
  },
  waitBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2EB872',
  },
  waitText: {
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
  availBody: {
    padding: 12,
  },
  availFooter: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  startingFrom: {
    fontSize: 9,
    letterSpacing: 0.6,
    color: COLORS.inkMuted,
  },
  stylists: {
    gap: 12,
    paddingHorizontal: 20,
  },
  stylist: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 16,
    backgroundColor: COLORS.card,
  },
  stylistImage: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  stylistBadge: {
    marginHorizontal: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: COLORS.brandSoft,
  },
  stylistBadgeText: {
    fontSize: 9,
  },
  stylistMeta: {
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  promo: {
    flexDirection: 'row',
    marginTop: 24,
    marginHorizontal: 20,
    height: 150,
    borderRadius: 18,
    backgroundColor: COLORS.card,
    overflow: 'hidden',
  },
  promoBody: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  promoEyebrow: {
    fontSize: 10,
    letterSpacing: 1,
    color: COLORS.brandDeep,
  },
  promoTitle: {
    marginTop: 4,
    fontSize: 22,
  },
  promoChip: {
    alignSelf: 'flex-start',
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: COLORS.brandSoft,
  },
  promoChipText: {
    fontSize: 10,
    fontFamily: FONTS.semiBold,
  },
  promoButton: {
    alignSelf: 'flex-start',
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: COLORS.brand,
  },
  promoButtonText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  promoImage: {
    width: 150,
    height: '100%',
    backgroundColor: COLORS.brandSoft,
  },
  oud: {
    marginTop: 24,
    marginHorizontal: 20,
    height: 150,
    padding: 16,
    justifyContent: 'center',
  },
  oudImage: {
    borderRadius: 18,
  },
  oudOverlay: {
    ...StyleSheet.absoluteFill,
    borderRadius: 18,
    backgroundColor: 'rgba(40,28,24,0.45)',
  },
  oudButton: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  oudButtonText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
  brandTile: {
    width: 120,
    height: 110,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    fontFamily: FONTS.heading,
    fontSize: 20,
    letterSpacing: 1,
  },
  brandTagline: {
    marginTop: 2,
    fontSize: 10,
    fontStyle: 'italic',
    color: COLORS.inkMuted,
  },
  artist: {
    width: 110,
  },
  artistImage: {
    width: 110,
    height: 120,
    borderRadius: 14,
    backgroundColor: COLORS.brandSoft,
  },
  artistName: {
    marginTop: 6,
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    textAlign: 'center',
  },
  artistRole: {
    fontSize: 10,
    textAlign: 'center',
    color: COLORS.inkMuted,
  },
  offer: {
    width: 140,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: COLORS.card,
    alignItems: 'center',
  },
  offerBrand: {
    fontFamily: FONTS.heading,
    fontSize: 16,
    letterSpacing: 1,
  },
  offerTitle: {
    marginTop: 8,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  offerCode: {
    marginTop: 2,
    fontSize: 10,
    color: COLORS.inkMuted,
  },
});
