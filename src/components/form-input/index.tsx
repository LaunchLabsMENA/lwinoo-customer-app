import { FC, ReactNode } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom, useLocalizedTextStyle } from '../react-native';
import { useI18n } from '../../i18n';

type Props = TextInputProps & {
  label?: string;
  // Rendered on the right of the label row (e.g. a "required" chip).
  labelRight?: ReactNode;
  // Rendered inside the input, before the text.
  left?: ReactNode;
  uppercaseLabel?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  // Validation message shown under the field; also turns the border red.
  error?: string;
  // Keep text left-to-right even in Arabic (phone numbers, emails).
  ltr?: boolean;
};

export const FormInput: FC<Props> = ({
  label,
  labelRight,
  left,
  uppercaseLabel,
  containerStyle,
  error,
  ltr,
  style,
  ...props
}) => {
  const { row } = useI18n();
  const localized = useLocalizedTextStyle([styles.input, style]);
  const inputStyle = ltr ? [localized, styles.ltr] : localized;
  return (
  <View style={containerStyle}>
    {label ? (
      <View style={[styles.labelRow, { flexDirection: row }]}>
        <TextCustom style={uppercaseLabel ? styles.labelUpper : styles.label}>{label}</TextCustom>
        {labelRight}
      </View>
    ) : null}
    <View style={[styles.box, { flexDirection: row }, !!error && styles.boxError]}>
      {left}
      <TextInput placeholderTextColor={COLORS.placeholder} {...props} style={inputStyle} />
    </View>
    {error ? (
      <TextCustom style={styles.error} accessibilityLiveRegion="polite">
        {error}
      </TextCustom>
    ) : null}
  </View>
  );
};

export const RequiredChip = () => {
  const { t } = useI18n();
  return (
    <View style={styles.chip}>
      <TextCustom style={styles.chipText}>{t('common.required')}</TextCustom>
    </View>
  );
};

const styles = StyleSheet.create({
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: COLORS.inkMuted,
  },
  labelUpper: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  box: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  boxError: {
    borderColor: COLORS.error,
  },
  error: {
    marginTop: 6,
    fontSize: 12,
    color: COLORS.error,
  },
  ltr: {
    writingDirection: 'ltr',
  },
  input: {
    flex: 1,
    height: '100%',
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.ink,
  },
  chip: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.brand,
  },
  chipText: {
    fontSize: 10,
    color: COLORS.brandDeep,
  },
});
