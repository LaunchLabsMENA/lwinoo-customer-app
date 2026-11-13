import { FC, useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ArrowUpDown, Clock, MapPin, Scissors, Share, SlidersHorizontal, Truck } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { DirectionScroll } from '../../../components/direction-scroll';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n, type TranslationKey } from '../../../i18n';
import {
  BackCircle,
  CircleButton,
  DarkButton,
  Eyebrow,
  FASHION,
  HeartButton,
  ImageCarousel,
  Pill,
  Price,
  Rating,
  shadow,
  SizeSelector,
  useLocalized,
} from '../components';
import { ATELIER_IDS, getAtelier, getProduct, type FashionCategory } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'FashionAtelier'>;

const TABS: { id: FashionCategory | 'all'; label: TranslationKey }[] = [
  { id: 'all', label: 'fashion.atelier.allCreations' },
  { id: 'abayas', label: 'fashion.atelier.signatureAbayas' },
  { id: 'bisht', label: 'fashion.atelier.bishts' },
];

export const FashionAtelierScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();
  const atelier = getAtelier(route.params.atelierId);
  const catalogue = useMemo(() => ATELIER_IDS.map(getProduct), []);
  const [tab, setTab] = useState<FashionCategory | 'all'>('all');
  const [following, setFollowing] = useState(false);
  const [selectedId, setSelectedId] = useState(catalogue[0].id);
  const [sizes, setSizes] = useState<Record<string, string>>(() =>
    Object.fromEntries(catalogue.map(p => [p.id, p.sizes[1] ?? p.sizes[0]])),
  );
  const rowDir = { flexDirection: row };

  const visible = tab === 'all' ? catalogue : catalogue.filter(p => p.category === tab);
  const countFor = (id: FashionCategory | 'all') => (id === 'all' ? catalogue.length : catalogue.filter(p => p.category === id).length);
  const selected = getProduct(selectedId);

  const checkout = (productId: string) => {
    if (requireAuth('cart')) navigation.navigate('FashionCheckout', { productId, size: sizes[productId] });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}>
        <ImageCarousel images={atelier.images} height={320}>
          <View style={[styles.heroBar, rowDir, { top: insets.top + 6 }]}>
            <BackCircle onPress={navigation.goBack} variant="glass" />
            <CircleButton icon={Share} label={t('fashion.share')} variant="glass" />
          </View>
        </ImageCarousel>

        <View style={styles.sheet}>
          <View style={[styles.spread, rowDir]}>
            <Pill label={t('fashion.atelier.hauteCouture')} tone="rose" />
            <Pill label={t('fashion.availableNow')} tone="success" />
          </View>
          <HeadingText style={styles.name}>{l(atelier.name)}</HeadingText>
          <TextCustom style={styles.muted}>{l(atelier.specialty)}</TextCustom>

          <View style={[styles.infoRow, rowDir]}>
            <View style={[styles.inline, rowDir]}>
              <Clock size={12} color={COLORS.inkMuted} />
              <TextCustom style={styles.infoText}>{atelier.hours}</TextCustom>
            </View>
            <View style={[styles.inline, rowDir]}>
              <MapPin size={12} color={COLORS.inkMuted} />
              <TextCustom style={styles.infoText}>{l(atelier.city)}</TextCustom>
            </View>
            <Rating rating={atelier.rating} reviews={atelier.reviews} />
          </View>

          <View style={[styles.stats, rowDir]}>
            <Stat value={atelier.followers} label={t('fashion.atelier.followers')} />
            <View style={styles.statDivider} />
            <Stat value={atelier.following} label={t('fashion.atelier.following')} />
            <View style={styles.statDivider} />
            <Stat value={atelier.sales} label={t('fashion.atelier.sales')} />
          </View>

          <View style={[styles.actions, rowDir]}>
            <DarkButton
              title={following ? t('fashion.atelier.followingButton') : t('fashion.atelier.follow')}
              size="md"
              variant={following ? 'outline' : 'dark'}
              style={styles.flex}
              onPress={() => requireAuth('favourite') && setFollowing(v => !v)}
            />
            <DarkButton
              title={t('fashion.atelier.chat')}
              size="md"
              variant="outline"
              style={styles.flex}
              onPress={() => requireAuth('chat')}
            />
          </View>

          <View style={[styles.features, rowDir]}>
            <Feature icon={Truck} title={t('fashion.atelier.sameDay')} subtitle={t('fashion.atelier.sameDaySub')} />
            <Feature icon={Scissors} title={t('fashion.atelier.tailoring')} subtitle={t('fashion.atelier.tailoringSub')} />
          </View>
        </View>

        {/* Catalogue tabs */}
        <DirectionScroll contentContainerStyle={styles.tabs}>
          {TABS.map(item => {
            const on = item.id === tab;
            return (
              <Pressable
                key={item.id}
                onPress={() => setTab(item.id)}
                style={[styles.tab, on && styles.tabOn]}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
              >
                <TextCustom style={[styles.tabText, on && styles.tabTextOn]}>
                  {`${t(item.label)} (${countFor(item.id)})`}
                </TextCustom>
              </Pressable>
            );
          })}
        </DirectionScroll>

        <View style={[styles.spread, styles.filterRow, rowDir]}>
          <View style={[styles.inline, rowDir]}>
            <SlidersHorizontal size={12} color={COLORS.ink} />
            <TextCustom style={styles.filterText}>{t('fashion.atelier.filterSizes')}</TextCustom>
          </View>
          <View style={[styles.inline, rowDir]}>
            <ArrowUpDown size={12} color={COLORS.ink} />
            <TextCustom style={styles.filterText}>{t('fashion.atelier.sortFeatured')}</TextCustom>
          </View>
        </View>

        <View style={styles.list}>
          {visible.map(p => {
            const isSelected = p.id === selectedId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setSelectedId(p.id)}
                style={[styles.card, isSelected && styles.cardSelected]}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
              >
                <Pressable onPress={() => navigation.navigate('FashionProduct', { productId: p.id })}>
                  <Image source={p.images[0]} style={styles.cardImage} />
                  {p.badge ? <Pill label={t(p.badge)} tone="light" style={styles.badge} /> : null}
                  <HeartButton style={styles.heart} />
                </Pressable>
                <View style={styles.cardBody}>
                  <View style={[styles.spread, rowDir]}>
                    <TextCustom style={styles.cardName}>{l(p.name)}</TextCustom>
                    <Price amount={p.price} size={14} />
                  </View>
                  <View style={[styles.spread, rowDir]}>
                    <TextCustom style={styles.mutedSmall}>{l(p.subtitle)}</TextCustom>
                    <Rating rating={p.rating} reviews={p.reviews} size={10} />
                  </View>
                  <View style={[styles.inline, styles.sizeRow, rowDir]}>
                    <TextCustom style={styles.sizeLabel}>{t('fashion.size')}</TextCustom>
                    <SizeSelector
                      compact
                      sizes={p.sizes}
                      value={sizes[p.id]}
                      onChange={s => {
                        setSizes(prev => ({ ...prev, [p.id]: s }));
                        setSelectedId(p.id);
                      }}
                    />
                  </View>
                  <DarkButton title={t('fashion.addToCart')} size="md" onPress={() => checkout(p.id)} style={styles.add} />
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      {/* Sticky selection bar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <View style={[styles.spread, rowDir]}>
          <View style={styles.flex}>
            <Eyebrow>{t('fashion.atelier.selectedPiece')}</Eyebrow>
            <TextCustom style={styles.selectedName} numberOfLines={1}>
              {`${l(selected.name)} · ${sizes[selected.id] === 'FREE' ? t('fashion.freeSize') : sizes[selected.id]}`}
            </TextCustom>
          </View>
          <Price amount={selected.price} size={15} />
        </View>
        <DarkButton title={t('common.continue')} size="lg" onPress={() => checkout(selected.id)} style={styles.continue} />
      </View>
    </View>
  );
};

const Stat: FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.stat}>
    <TextCustom style={styles.statValue}>{value}</TextCustom>
    <TextCustom style={styles.mutedSmall}>{label}</TextCustom>
  </View>
);

const Feature: FC<{ icon: typeof Truck; title: string; subtitle: string }> = ({ icon: Icon, title, subtitle }) => {
  const { row } = useI18n();
  return (
    <View style={[styles.feature, { flexDirection: row }]}>
      <View style={styles.featureIcon}>
        <Icon size={15} color={COLORS.brandDeep} />
      </View>
      <View style={styles.flex}>
        <TextCustom style={styles.featureTitle} numberOfLines={1}>
          {title}
        </TextCustom>
        <TextCustom style={styles.mutedSmall} numberOfLines={2}>
          {subtitle}
        </TextCustom>
      </View>
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
  spread: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  inline: {
    alignItems: 'center',
    gap: 4,
  },
  muted: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  mutedSmall: {
    flexShrink: 1,
    fontSize: 10,
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
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.white,
  },
  name: {
    marginTop: 10,
    fontSize: 24,
  },
  infoRow: {
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 14,
    marginTop: 10,
  },
  infoText: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  stats: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: FASHION.bg,
    alignItems: 'center',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontFamily: FONTS.bold,
    fontSize: 15,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: COLORS.hairline,
  },
  actions: {
    gap: 10,
    marginTop: 14,
  },
  features: {
    gap: 10,
    marginTop: 14,
  },
  feature: {
    flex: 1,
    alignItems: 'center',
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  featureIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  tabs: {
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 18,
  },
  tab: {
    height: 32,
    paddingHorizontal: 14,
    borderRadius: 16,
    justifyContent: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabOn: {
    backgroundColor: COLORS.darkBrown,
    borderColor: COLORS.darkBrown,
  },
  tabText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
  tabTextOn: {
    color: COLORS.white,
  },
  filterRow: {
    paddingHorizontal: 20,
    marginTop: 14,
  },
  filterText: {
    fontSize: 11,
  },
  list: {
    gap: 16,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  card: {
    borderRadius: 20,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: 'transparent',
    ...shadow,
  },
  cardSelected: {
    borderColor: COLORS.brand,
  },
  cardImage: {
    width: '100%',
    height: 260,
    backgroundColor: COLORS.brandSoft,
  },
  badge: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  cardBody: {
    padding: 14,
    gap: 4,
  },
  cardName: {
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  sizeRow: {
    marginTop: 8,
    gap: 8,
  },
  sizeLabel: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  add: {
    marginTop: 12,
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.darkBrown,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  selectedName: {
    marginTop: 2,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  continue: {
    marginTop: 10,
  },
});
