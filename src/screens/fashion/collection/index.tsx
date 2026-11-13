import { FC, useState } from 'react';
import { Image, ImageBackground, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n } from '../../../i18n';
import {
  DarkButton,
  Eyebrow,
  FASHION,
  HeartButton,
  Pill,
  Price,
  shadow,
  SizeSelector,
  TopBar,
  useLocalized,
} from '../components';
import { COLLECTION, getProduct, type CollectionPiece } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'FashionCollection'>;

const HERO_HEIGHT = 300;

export const FashionCollectionScreen: FC<Props> = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();

  const addToCart = (productId: string, size: string) => {
    if (requireAuth('cart')) navigation.navigate('FashionCheckout', { productId, size });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <TopBar title={l(COLLECTION.title)} onBack={navigation.goBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 32 }}>
        {/* Hero, fading into the page */}
        <ImageBackground source={COLLECTION.hero} style={styles.hero}>
          <Svg style={styles.fade} pointerEvents="none">
            <Defs>
              <LinearGradient id="collectionFade" x1="0" y1="0" x2="0" y2="1">
                <Stop offset="0" stopColor={FASHION.bg} stopOpacity={0} />
                <Stop offset="1" stopColor={FASHION.bg} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#collectionFade)" />
          </Svg>
        </ImageBackground>

        <View style={styles.intro}>
          <Eyebrow style={styles.maison}>{l(COLLECTION.maison)}</Eyebrow>
          <HeadingText style={styles.heading}>{l(COLLECTION.heading)}</HeadingText>
          <TextCustom style={styles.description}>{l(COLLECTION.description)}</TextCustom>
        </View>

        <View style={[styles.matrixHeader, { flexDirection: row }]}>
          <View>
            <Eyebrow>{t('fashion.collection.fourSignatures')}</Eyebrow>
            <HeadingText style={styles.matrixTitle}>{t('fashion.collection.capsuleMatrix')}</HeadingText>
          </View>
          <TextCustom style={styles.pieceCount}>
            {t('fashion.collection.curatedPieces', { count: String(COLLECTION.pieces.length).padStart(2, '0') })}
          </TextCustom>
        </View>

        <View style={styles.pieces}>
          {COLLECTION.pieces.map(piece => (
            <PieceCard
              key={piece.productId}
              piece={piece}
              onOpen={() => navigation.navigate('FashionProduct', { productId: piece.productId })}
              onAdd={size => addToCart(piece.productId, size)}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const PieceCard: FC<{ piece: CollectionPiece; onOpen: () => void; onAdd: (size: string) => void }> = ({ piece, onOpen, onAdd }) => {
  const { t, row, isRTL } = useI18n();
  const l = useLocalized();
  const product = getProduct(piece.productId);
  const [size, setSize] = useState(product.sizes[1] ?? product.sizes[0]);
  const Chevron = isRTL ? ChevronLeft : ChevronRight;
  const rowDir = { flexDirection: row };

  return (
    <View style={styles.card}>
      <Pressable onPress={onOpen} accessibilityRole="button" accessibilityLabel={l(product.name)}>
        {piece.split ? (
          <View style={[styles.split, rowDir]}>
            <Image source={product.images[0]} style={styles.splitImage} />
            <Image source={product.images[1] ?? product.images[0]} style={styles.splitImage} />
          </View>
        ) : (
          <Image source={product.images[0]} style={styles.cardImage} />
        )}
        <Pill label={l(piece.tag)} tone="light" style={styles.tag} />
        <HeartButton style={styles.heart} />
        {piece.overlay ? (
          <Pill label={l(piece.overlay)} tone="glass" icon={Sparkles} style={styles.overlay} />
        ) : null}
      </Pressable>

      <View style={styles.cardBody}>
        <View style={[styles.spread, rowDir]}>
          <TextCustom style={styles.name}>{l(product.name)}</TextCustom>
          <Price amount={product.price} size={14} />
        </View>
        <TextCustom style={styles.sub}>{l(product.subtitle)}</TextCustom>

        {piece.split ? <TextCustom style={styles.longDescription}>{l(product.description)}</TextCustom> : null}

        {piece.lowStock ? (
          <View style={[styles.spread, styles.lowStockRow, rowDir]}>
            <TextCustom style={styles.lowStock}>{l(piece.lowStock)}</TextCustom>
            <Pressable onPress={onOpen} style={[styles.inline, rowDir]} hitSlop={6} accessibilityRole="button">
              <TextCustom style={styles.details}>{t('fashion.viewDetails')}</TextCustom>
              <Chevron size={13} color={COLORS.ink} />
            </Pressable>
          </View>
        ) : (
          <>
            <View style={[styles.spread, styles.sizeHeader, rowDir]}>
              <Eyebrow>{t('fashion.selectLengthSize')}</Eyebrow>
              <TextCustom style={styles.sizeGuide}>{t('fashion.sizeGuide')}</TextCustom>
            </View>
            <SizeSelector sizes={product.sizes} value={size} onChange={setSize} />
          </>
        )}

        <DarkButton title={t('fashion.addToCart')} size="md" onPress={() => onAdd(size)} style={styles.add} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: FASHION.bg,
  },
  hero: {
    height: HERO_HEIGHT,
    marginTop: 4,
    backgroundColor: COLORS.brandSoft,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: HERO_HEIGHT * 0.5,
  },
  intro: {
    paddingHorizontal: 20,
    marginTop: -28,
  },
  maison: {
    color: COLORS.brandDeep,
  },
  heading: {
    marginTop: 6,
    fontSize: 26,
  },
  description: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 20,
    color: COLORS.inkMuted,
  },
  matrixHeader: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 28,
  },
  matrixTitle: {
    marginTop: 4,
    fontSize: 20,
  },
  pieceCount: {
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  pieces: {
    gap: 18,
    paddingHorizontal: 20,
    marginTop: 14,
  },
  card: {
    borderRadius: 20,
    backgroundColor: COLORS.white,
    overflow: 'hidden',
    ...shadow,
  },
  cardImage: {
    width: '100%',
    height: 300,
    backgroundColor: COLORS.brandSoft,
  },
  split: {
    height: 260,
    gap: 2,
  },
  splitImage: {
    flex: 1,
    height: '100%',
    backgroundColor: COLORS.brandSoft,
  },
  tag: {
    position: 'absolute',
    top: 12,
    left: 12,
  },
  heart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  overlay: {
    position: 'absolute',
    bottom: 12,
    left: 12,
  },
  cardBody: {
    padding: 14,
  },
  spread: {
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  inline: {
    alignItems: 'center',
    gap: 2,
  },
  name: {
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
  },
  sub: {
    marginTop: 3,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  longDescription: {
    marginTop: 8,
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.inkMuted,
  },
  sizeHeader: {
    marginTop: 14,
    marginBottom: 8,
  },
  sizeGuide: {
    fontSize: 11,
    color: COLORS.inkMuted,
    textDecorationLine: 'underline',
  },
  lowStockRow: {
    marginTop: 12,
  },
  lowStock: {
    flexShrink: 1,
    fontSize: 11,
    fontStyle: 'italic',
    color: COLORS.brandDeep,
  },
  details: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
  },
  add: {
    marginTop: 14,
  },
});
