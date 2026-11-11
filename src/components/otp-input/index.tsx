import { ComponentRef, FC, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: boolean;
};

// A single hidden input drives the boxes, so paste and SMS autofill work.
// Digits always read left to right, in Arabic too.
export const OtpInput: FC<Props> = ({ length = 4, value, onChange, error }) => {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const [focused, setFocused] = useState(true);

  return (
    <Pressable
      style={styles.row}
      onPress={() => inputRef.current?.focus()}
      accessible
      accessibilityLabel={`${value.length} / ${length}`}
    >
      {Array.from({ length }, (_, i) => {
        const char = value[i];
        // The box the next digit goes into (the last one once the code is complete).
        const current = focused && i === Math.min(value.length, length - 1);
        return (
          <View
            key={i}
            style={[
              styles.box,
              char ? styles.boxFilled : null,
              current ? styles.boxCurrent : null,
              error ? styles.boxError : null,
            ]}
          >
            {char ? (
              <TextCustom style={[styles.digit, error && styles.digitError]}>
                {char}
              </TextCustom>
            ) : current ? (
              <View style={styles.caret} />
            ) : (
              <View style={styles.dot} />
            )}
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, length))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        caretHidden
        style={styles.hidden}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
  },
  box: {
    width: 64,
    height: 70,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  boxFilled: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.brand,
  },
  boxCurrent: {
    borderWidth: 1.5,
    borderColor: COLORS.brandDeep,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.brandDeep,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  boxError: {
    borderColor: COLORS.error,
    backgroundColor: '#FDF1F1',
  },
  digit: {
    fontFamily: FONTS.semiBold,
    fontSize: 26,
    color: COLORS.ink,
  },
  digitError: {
    color: COLORS.error,
  },
  caret: {
    width: 2,
    height: 26,
    borderRadius: 1,
    backgroundColor: COLORS.brandDeep,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.border,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
