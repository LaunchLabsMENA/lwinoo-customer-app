import { ComponentRef, FC, useRef } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';

type Props = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
};

// A single hidden input drives the boxes, so paste and SMS autofill work.
export const OtpInput: FC<Props> = ({ length = 4, value, onChange }) => {
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);

  return (
    <Pressable style={styles.row} onPress={() => inputRef.current?.focus()}>
      {Array.from({ length }, (_, i) => {
        const char = value[i];
        const focused = i === value.length;
        return (
          <View key={i} style={[styles.box, (focused || char) && styles.boxActive]}>
            <TextCustom style={char ? styles.digit : styles.dash}>{char ?? '-'}</TextCustom>
          </View>
        );
      })}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={t => onChange(t.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        maxLength={length}
        autoFocus
        style={styles.hidden}
      />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  box: {
    flex: 1,
    height: 64,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.white,
  },
  boxActive: {
    borderColor: COLORS.brand,
  },
  digit: {
    fontFamily: FONTS.semiBold,
    fontSize: 22,
  },
  dash: {
    fontSize: 16,
    color: COLORS.placeholder,
  },
  hidden: {
    position: 'absolute',
    opacity: 0,
    width: 1,
    height: 1,
  },
});
