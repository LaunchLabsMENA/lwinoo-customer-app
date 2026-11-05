import { FC } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../assets/colors';
import { TextCustom } from '../react-native';
import { useI18n } from '../../i18n';

type Props = {
  step: number;
  total: number;
  label?: string;
};

export const StepProgress: FC<Props> = ({ step, total, label }) => {
  const { t, row } = useI18n();
  return (
    <View style={styles.container}>
      <View style={[styles.labels, { flexDirection: row }]}>
        <TextCustom style={styles.step}>{t('step.progress', { step, total })}</TextCustom>
        {label ? <TextCustom style={styles.label}>{label}</TextCustom> : null}
      </View>
      <View style={[styles.bars, { flexDirection: row }]}>
        {Array.from({ length: total }, (_, i) => (
          <View key={i} style={[styles.bar, i < step && styles.barActive]} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  step: {
    fontSize: 13,
    color: COLORS.inkMuted,
  },
  label: {
    fontSize: 13,
    color: COLORS.brand,
  },
  bars: {
    flexDirection: 'row',
    gap: 8,
  },
  bar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
    backgroundColor: COLORS.border,
  },
  barActive: {
    backgroundColor: COLORS.brand,
  },
});
