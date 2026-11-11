import { FC, useCallback, useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  type ScrollViewInstance,
  type ScrollViewProps,
} from 'react-native';
import { useI18n } from '../../i18n';

// Horizontal list that follows the reading direction. The app mirrors layouts per locale
// (not via I18nManager), so in Arabic we lay items out right-to-left and open at the right end.
export const DirectionScroll: FC<Omit<ScrollViewProps, 'ref'>> = ({
  contentContainerStyle,
  onContentSizeChange,
  ...rest
}) => {
  const { isRTL } = useI18n();
  const inner = useRef<ScrollViewInstance>(null);
  const anchored = useRef(false);

  // Re-anchor when the language changes.
  useEffect(() => {
    anchored.current = false;
    if (!isRTL) inner.current?.scrollTo({ x: 0, animated: false });
  }, [isRTL]);

  const handleSize = useCallback(
    (w: number, h: number) => {
      if (isRTL && !anchored.current) {
        anchored.current = true;
        inner.current?.scrollToEnd({ animated: false });
      }
      onContentSizeChange?.(w, h);
    },
    [isRTL, onContentSizeChange],
  );

  return (
    <ScrollView
      ref={inner}
      horizontal
      showsHorizontalScrollIndicator={false}
      {...rest}
      contentContainerStyle={[contentContainerStyle, isRTL && styles.rtl]}
      onContentSizeChange={handleSize}
    />
  );
};

const styles = StyleSheet.create({
  rtl: {
    flexDirection: 'row-reverse',
  },
});
