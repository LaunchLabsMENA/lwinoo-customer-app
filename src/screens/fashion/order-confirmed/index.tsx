import { FC, useEffect } from 'react';
import { BackHandler, Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Check, Download, MapPin, QrCode, Truck } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { HeadingText, TextCustom } from '../../../components/react-native';
import { BrandGradient } from '../../../components/brand-gradient';
import { useI18n, type TranslationKey } from '../../../i18n';
import { DarkButton, Eyebrow, Pill, Price, useLocalized } from '../components';
import { DELIVERY_OPTIONS, getProduct, type DeliveryOption, type PaymentId } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'FashionOrderConfirmed'>;

const PAYMENT_LABEL: Record<PaymentId, TranslationKey> = {
  applePay: 'fashion.pay.applePay',
  mada: 'fashion.pay.mada',
  stcPay: 'fashion.pay.stcPay',
  atelier: 'fashion.pay.atelier',
};

const WINDOW: Record<DeliveryOption['id'], TranslationKey> = {
  express: 'fashion.confirmed.windowExpress',
  boutique: 'fashion.confirmed.windowBoutique',
  mobile: 'fashion.confirmed.windowMobile',
};

export const FashionOrderConfirmedScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const l = useLocalized();
  const { productId, size, toneId, total, deliveryId, paymentId, orderNo } = route.params;
  const product = getProduct(productId);
  const tone = product.tones.find(x => x.id === toneId);
  const delivery = DELIVERY_OPTIONS.find(d => d.id === deliveryId) ?? DELIVERY_OPTIONS[0];
  const sizeLabel = size === 'FREE' ? t('fashion.freeSize') : size;
  const rowDir = { flexDirection: row };

  const done = () => navigation.navigate('Main', { screen: 'Fashion' });

  // The order is placed; Android back should leave the flow rather than return to checkout.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      navigation.navigate('Main', { screen: 'Fashion' });
      return true;
    });
    return () => sub.remove();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <BrandGradient id="orderConfirmedGradient" colors={['#F1D3D6', '#F7E6E4', '#FBF5F2']} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 24 }]}
      >
        <View style={styles.ringOuter}>
          <View style={styles.ringInner}>
            <View style={styles.check}>
              <Check size={34} color={COLORS.white} strokeWidth={2.5} />
            </View>
          </View>
        </View>
        <HeadingText style={styles.title}>{t('fashion.confirmed.title')}</HeadingText>
        <TextCustom style={styles.subtitle}>{t('fashion.confirmed.subtitle')}</TextCustom>

        <View style={styles.receipt}>
          <View style={[styles.spread, rowDir]}>
            <View>
              <Eyebrow>{t('fashion.confirmed.vipPass')}</Eyebrow>
              <TextCustom style={styles.orderNo}>{`#${orderNo}`}</TextCustom>
            </View>
            <Pill label={t('fashion.confirmed.paid')} tone="success" />
          </View>

          <View style={styles.divider} />

          <View style={[styles.item, rowDir]}>
            <Image source={product.images[0]} style={styles.itemImage} />
            <View style={styles.flex}>
              <Eyebrow>{t('fashion.confirmed.hauteCouture')}</Eyebrow>
              <TextCustom style={styles.itemName} numberOfLines={2}>
                {l(product.name)}
              </TextCustom>
              <TextCustom style={styles.muted}>
                {tone ? `${t('fashion.size')} ${sizeLabel} · ${l(tone.name)}` : `${t('fashion.size')} ${sizeLabel}`}
              </TextCustom>
              <View style={[styles.spread, styles.itemFooter, rowDir]}>
                <Price amount={total} size={15} />
                <Pill label={t(PAYMENT_LABEL[paymentId])} tone="rose" />
              </View>
            </View>
          </View>

          <View style={[styles.block, rowDir]}>
            <View style={styles.flex}>
              <View style={[styles.inline, rowDir]}>
                <View style={styles.liveDot} />
                <Eyebrow>{t('fashion.confirmed.dispatchLive')}</Eyebrow>
              </View>
              <TextCustom style={styles.blockTitle}>{t(WINDOW[delivery.id])}</TextCustom>
              <View style={[styles.inline, rowDir]}>
                <MapPin size={11} color={COLORS.inkMuted} />
                <TextCustom style={styles.muted} numberOfLines={1}>
                  {l(delivery.detail)}
                </TextCustom>
              </View>
            </View>
            <View style={styles.truck}>
              <Truck size={18} color={COLORS.ink} />
            </View>
          </View>

          <View style={[styles.block, rowDir]}>
            <View style={styles.flex}>
              <Eyebrow>{t('fashion.confirmed.fastPass')}</Eyebrow>
              <TextCustom style={[styles.muted, styles.fastPassBody]}>{t('fashion.confirmed.fastPassBody')}</TextCustom>
              <Pressable style={[styles.inline, styles.invoice, rowDir]} hitSlop={6} accessibilityRole="button">
                <Download size={12} color={COLORS.ink} />
                <TextCustom style={styles.invoiceText}>{t('fashion.confirmed.invoice')}</TextCustom>
              </Pressable>
            </View>
            <View style={styles.qr}>
              <QrCode size={58} color={COLORS.ink} strokeWidth={1.4} />
            </View>
          </View>
        </View>

        <DarkButton title={t('fashion.confirmed.continue')} size="lg" onPress={done} style={styles.continue} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBF5F2',
  },
  content: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  flex: {
    flex: 1,
  },
  spread: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  inline: {
    alignItems: 'center',
    gap: 5,
  },
  muted: {
    flexShrink: 1,
    marginTop: 2,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  ringOuter: {
    width: 124,
    height: 124,
    borderRadius: 62,
    backgroundColor: 'rgba(217,167,173,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(217,167,173,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  check: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: COLORS.brandDeep,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.brandDeep,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  title: {
    marginTop: 20,
    fontSize: 28,
    textAlign: 'center',
  },
  subtitle: {
    marginTop: 6,
    fontSize: 13,
    textAlign: 'center',
    color: COLORS.inkMuted,
  },
  receipt: {
    alignSelf: 'stretch',
    marginTop: 26,
    padding: 16,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.92)',
    shadowColor: COLORS.darkBrown,
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  orderNo: {
    marginTop: 2,
    fontFamily: FONTS.bold,
    fontSize: 15,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    marginVertical: 14,
    borderStyle: 'dashed',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  item: {
    gap: 12,
  },
  itemImage: {
    width: 70,
    height: 86,
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  itemName: {
    marginTop: 2,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  itemFooter: {
    marginTop: 8,
  },
  block: {
    marginTop: 14,
    padding: 12,
    gap: 12,
    alignItems: 'center',
    borderRadius: 14,
    backgroundColor: '#FAF3EE',
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.success,
  },
  blockTitle: {
    marginTop: 4,
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  truck: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fastPassBody: {
    lineHeight: 15,
  },
  invoice: {
    marginTop: 8,
  },
  invoiceText: {
    fontFamily: FONTS.semiBold,
    fontSize: 11,
    textDecorationLine: 'underline',
  },
  qr: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: COLORS.white,
  },
  continue: {
    alignSelf: 'stretch',
    marginTop: 24,
  },
});
