import { FC, ReactNode, useState } from 'react';
import { Image, Pressable, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Car, CreditCard, Lock, Minus, Plus, Store, Trash2, Truck, Wallet } from 'lucide-react-native';
import type { RootStackParamList } from '../../../navigation/app/types';
import { COLORS } from '../../../assets/colors';
import { FONTS } from '../../../assets/fonts';
import { TextCustom } from '../../../components/react-native';
import { AppleIcon } from '../../../components/icons';
import { useAuthGate } from '../../../components/auth-gate';
import { useI18n, type TranslationKey } from '../../../i18n';
import { DarkButton, Eyebrow, FASHION, Pill, Price, shadow, TopBar, useLocalized } from '../components';
import { DELIVERY_OPTIONS, getAtelier, getProduct, type DeliveryOption, type PaymentId } from '../data';

type Props = NativeStackScreenProps<RootStackParamList, 'FashionCheckout'>;

const DELIVERY_ICONS: Record<DeliveryOption['id'], typeof Truck> = {
  express: Truck,
  boutique: Store,
  mobile: Car,
};

const PAYMENTS: { id: PaymentId; title: TranslationKey; detail?: TranslationKey; icon: ReactNode; recommended?: boolean }[] = [
  {
    id: 'applePay',
    title: 'fashion.pay.applePay',
    detail: 'fashion.pay.applePayDetail',
    icon: <AppleIcon size={16} color={COLORS.ink} />,
    recommended: true,
  },
  { id: 'mada', title: 'fashion.pay.mada', detail: 'fashion.pay.madaDetail', icon: <CreditCard size={16} color={COLORS.ink} /> },
  { id: 'stcPay', title: 'fashion.pay.stcPay', icon: <Wallet size={16} color={COLORS.ink} /> },
  { id: 'atelier', title: 'fashion.pay.atelier', icon: <Store size={16} color={COLORS.ink} /> },
];

export const FashionCheckoutScreen: FC<Props> = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { t, row } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();
  const { productId, size, toneId } = route.params;
  const product = getProduct(productId);
  const atelier = getAtelier(product.atelierId);
  const tone = product.tones.find(x => x.id === toneId) ?? product.tones[0];
  const [qty, setQty] = useState(1);
  const [deliveryId, setDeliveryId] = useState<DeliveryOption['id']>('express');
  const [paymentId, setPaymentId] = useState<PaymentId>('applePay');
  const delivery = DELIVERY_OPTIONS.find(d => d.id === deliveryId) ?? DELIVERY_OPTIONS[0];
  const subtotal = product.price * qty;
  const total = subtotal + delivery.fee;
  const sizeLabel = size === 'FREE' ? t('fashion.freeSize') : size;
  const rowDir = { flexDirection: row };

  const placeOrder = () => {
    if (!requireAuth('pay')) return;
    navigation.replace('FashionOrderConfirmed', {
      productId,
      size,
      toneId: tone?.id,
      total,
      deliveryId,
      paymentId,
      orderNo: `LW-FSH-${Math.floor(10000 + Math.random() * 90000)}`,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" />
      <TopBar title={t('fashion.checkout.title')} onBack={navigation.goBack} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        {/* Item */}
        <View style={[styles.card, styles.item, rowDir]}>
          <Image source={product.images[0]} style={styles.itemImage} />
          <View style={styles.flex}>
            <View style={[styles.spread, rowDir]}>
              <Eyebrow>{t('fashion.checkout.maison', { name: l(atelier.name) })}</Eyebrow>
              <Pressable onPress={navigation.goBack} hitSlop={8} accessibilityRole="button" accessibilityLabel={t('fashion.checkout.remove')}>
                <Trash2 size={15} color={COLORS.inkMuted} />
              </Pressable>
            </View>
            <TextCustom style={styles.itemName} numberOfLines={2}>
              {l(product.name)}
            </TextCustom>
            <TextCustom style={styles.mutedSmall}>
              {tone ? `${t('fashion.size')} ${sizeLabel} · ${l(tone.name)}` : `${t('fashion.size')} ${sizeLabel}`}
            </TextCustom>
            <View style={[styles.spread, styles.itemFooter, rowDir]}>
              <View style={[styles.stepper, rowDir]}>
                <Pressable
                  onPress={() => setQty(q => Math.max(1, q - 1))}
                  style={styles.stepButton}
                  accessibilityRole="button"
                  accessibilityLabel={t('fashion.checkout.decrease')}
                >
                  <Minus size={13} color={COLORS.ink} />
                </Pressable>
                <TextCustom style={styles.qty}>{qty}</TextCustom>
                <Pressable
                  onPress={() => setQty(q => Math.min(9, q + 1))}
                  style={styles.stepButton}
                  accessibilityRole="button"
                  accessibilityLabel={t('fashion.checkout.increase')}
                >
                  <Plus size={13} color={COLORS.ink} />
                </Pressable>
              </View>
              <Price amount={subtotal} size={16} />
            </View>
          </View>
        </View>

        {/* Delivery */}
        <View style={[styles.spread, styles.sectionHeader, rowDir]}>
          <TextCustom style={styles.sectionTitle}>{t('fashion.checkout.location')}</TextCustom>
          <Pressable onPress={() => requireAuth('order') && navigation.navigate('Addresses')} hitSlop={8} accessibilityRole="button">
            <TextCustom style={styles.link}>{t('fashion.checkout.editAddress')}</TextCustom>
          </Pressable>
        </View>
        <View style={styles.options}>
          {DELIVERY_OPTIONS.map(option => {
            const Icon = DELIVERY_ICONS[option.id];
            const on = option.id === deliveryId;
            return (
              <Pressable
                key={option.id}
                onPress={() => setDeliveryId(option.id)}
                style={[styles.card, styles.option, rowDir, on && styles.optionOn]}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <View style={styles.optionIcon}>
                  <Icon size={16} color={COLORS.brandDeep} />
                </View>
                <View style={styles.flex}>
                  <TextCustom style={styles.optionTitle}>{t(option.title)}</TextCustom>
                  <TextCustom style={styles.mutedSmall}>{l(option.detail)}</TextCustom>
                  {option.chip ? <Pill label={t(option.chip)} tone="success" style={styles.optionChip} /> : null}
                </View>
                <Radio on={on} />
              </Pressable>
            );
          })}
        </View>

        {/* Summary */}
        <View style={[styles.card, styles.summary]}>
          <View style={[styles.spread, rowDir]}>
            <TextCustom style={styles.optionTitle}>{t('fashion.checkout.orderSummary')}</TextCustom>
            <Eyebrow>{t('fashion.checkout.currency')}</Eyebrow>
          </View>
          <SummaryRow label={t('fashion.checkout.subtotal', { count: qty })} value={<Price amount={subtotal} size={13} />} />
          <SummaryRow
            label={t(delivery.fee ? 'fashion.checkout.deliveryFee' : 'fashion.checkout.whiteGlove')}
            value={
              delivery.fee ? (
                <Price amount={delivery.fee} size={13} />
              ) : (
                <TextCustom style={styles.free}>{t('fashion.checkout.free')}</TextCustom>
              )
            }
          />
          <View style={styles.divider} />
          <SummaryRow label={t('fashion.checkout.total')} value={<Price amount={total} size={16} />} bold />
        </View>

        {/* Payment */}
        <View style={[styles.spread, styles.sectionHeader, rowDir]}>
          <TextCustom style={styles.sectionTitle}>{t('fashion.checkout.paymentMethod')}</TextCustom>
          <Pill label={t('fashion.checkout.encrypted')} tone="success" icon={Lock} />
        </View>
        <View style={styles.options}>
          {PAYMENTS.map(p => {
            const on = p.id === paymentId;
            return (
              <Pressable
                key={p.id}
                onPress={() => setPaymentId(p.id)}
                style={[styles.card, styles.payment, rowDir, on && styles.paymentOn]}
                accessibilityRole="radio"
                accessibilityState={{ selected: on }}
              >
                <Radio on={on} />
                <View style={styles.payIcon}>{p.icon}</View>
                <View style={styles.flex}>
                  <TextCustom style={styles.optionTitle}>{t(p.title)}</TextCustom>
                  {p.detail ? <TextCustom style={styles.mutedSmall}>{t(p.detail)}</TextCustom> : null}
                </View>
                {p.recommended ? <Pill label={t('fashion.pay.recommended')} tone="dark" /> : null}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <DarkButton title={t('fashion.checkout.payTotal', { amount: total })} size="lg" onPress={placeOrder} />
      </View>
    </View>
  );
};

const Radio: FC<{ on: boolean }> = ({ on }) => (
  <View style={[styles.radio, on && styles.radioOn]}>{on ? <View style={styles.radioDot} /> : null}</View>
);

const SummaryRow: FC<{ label: string; value: ReactNode; bold?: boolean }> = ({ label, value, bold }) => (
  <View style={[styles.spread, styles.summaryRow, { flexDirection: useI18n().row }]}>
    <TextCustom style={bold ? styles.optionTitle : styles.summaryLabel}>{label}</TextCustom>
    {value}
  </View>
);

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
  mutedSmall: {
    marginTop: 2,
    fontSize: 11,
    color: COLORS.inkMuted,
  },
  link: {
    fontSize: 12,
    color: COLORS.brandDeep,
  },
  card: {
    borderRadius: 16,
    backgroundColor: COLORS.white,
    ...shadow,
  },
  item: {
    marginHorizontal: 20,
    marginTop: 8,
    padding: 12,
    gap: 12,
  },
  itemImage: {
    width: 80,
    height: 100,
    borderRadius: 12,
    backgroundColor: COLORS.brandSoft,
  },
  itemName: {
    marginTop: 3,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
  },
  itemFooter: {
    marginTop: 10,
  },
  stepper: {
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 4,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  stepButton: {
    width: 22,
    height: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qty: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    minWidth: 12,
    textAlign: 'center',
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 10,
  },
  sectionTitle: {
    fontFamily: FONTS.headingSemiBold,
    fontSize: 17,
  },
  options: {
    gap: 10,
    paddingHorizontal: 20,
  },
  option: {
    padding: 12,
    gap: 12,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  optionOn: {
    borderColor: COLORS.brand,
  },
  optionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.brandSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
  },
  optionChip: {
    marginTop: 6,
  },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOn: {
    borderColor: COLORS.darkBrown,
  },
  radioDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.darkBrown,
  },
  summary: {
    marginHorizontal: 20,
    marginTop: 18,
    padding: 14,
  },
  summaryRow: {
    marginTop: 10,
  },
  summaryLabel: {
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  free: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.success,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: COLORS.hairline,
    marginTop: 12,
  },
  payment: {
    padding: 12,
    gap: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  paymentOn: {
    borderColor: COLORS.darkBrown,
  },
  payIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: FASHION.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: FASHION.bg,
  },
});
