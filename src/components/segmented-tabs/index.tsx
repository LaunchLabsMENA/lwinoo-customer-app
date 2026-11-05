import { StyleSheet, Pressable, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../react-native';
import { useI18n } from '../../i18n';

type Props<T extends string> = {
  options: { key: T; label: string }[];
  value: T;
  onChange: (key: T) => void;
};

export function SegmentedTabs<T extends string>({ options, value, onChange }: Props<T>) {
  const { row } = useI18n();
  return (
    <View style={[styles.container, { flexDirection: row }]}>
      {options.map(o => {
        const active = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[styles.tab, active && styles.tabActive]}>
            <TextCustom style={[styles.label, active && styles.labelActive]}>{o.label}</TextCustom>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  tab: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabActive: {
    backgroundColor: COLORS.brandSoft,
  },
  label: {
    fontSize: 14,
    color: COLORS.inkMuted,
  },
  labelActive: {
    fontFamily: FONTS.medium,
    color: COLORS.ink,
  },
});
