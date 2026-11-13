import { FC, memo, ReactNode, useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  LayoutChangeEvent,
  Pressable,
  Share,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useIsFocused, useNavigation, type NavigationProp } from '@react-navigation/native';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import Video from 'react-native-video';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { BadgeCheck, Bookmark, Heart, MessageCircle, Play, Plus, Send, ShoppingBag, Volume2, VolumeX } from 'lucide-react-native';
import type { MainTabParamList, RootStackParamList } from '../../navigation/app/types';
import { COLORS } from '../../assets/colors';
import { FONTS } from '../../assets/fonts';
import { TextCustom } from '../../components/react-native';
import { useAuthGate } from '../../components/auth-gate';
import { useI18n } from '../../i18n';
import { useLocalized } from '../fashion/components';
import { REELS, type Reel } from './data';

type Props = BottomTabScreenProps<MainTabParamList, 'Reels'>;

// Space reserved for the floating tab bar (pill height + its gap).
const TAB_BAR_SPACE = 84;

const compact = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));

export const ReelsScreen: FC<Props> = () => {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();
  const focused = useIsFocused();
  const [height, setHeight] = useState(0);
  const [active, setActive] = useState(0);
  const [muted, setMuted] = useState(false);

  const onViewable = useRef(({ viewableItems }: { viewableItems: { index?: number | null; isViewable: boolean }[] }) => {
    const first = viewableItems.find(v => v.isViewable);
    if (first?.index != null) setActive(first.index);
  }).current;

  const onLayout = (e: LayoutChangeEvent) => setHeight(e.nativeEvent.layout.height);

  const renderItem = useCallback(
    ({ item, index }: { item: Reel; index: number }) => (
      <ReelItem
        reel={item}
        height={height}
        // Only the visible reel plays; neighbours stay mounted (preloaded) but paused.
        playing={focused && index === active}
        mounted={Math.abs(index - active) <= 1}
        muted={muted}
        bottomInset={Math.max(insets.bottom, 12) + TAB_BAR_SPACE}
      />
    ),
    [height, focused, active, muted, insets.bottom],
  );

  return (
    <View style={styles.container} onLayout={onLayout}>
      <StatusBar barStyle="light-content" />
      {height > 0 ? (
        <FlatList
          data={REELS}
          keyExtractor={r => r.id}
          renderItem={renderItem}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          decelerationRate="fast"
          snapToInterval={height}
          getItemLayout={(_, index) => ({ length: height, offset: height * index, index })}
          onViewableItemsChanged={onViewable}
          viewabilityConfig={{ itemVisiblePercentThreshold: 60 }}
          windowSize={3}
          initialNumToRender={1}
          maxToRenderPerBatch={2}
        />
      ) : null}

      <View style={[styles.header, { top: insets.top + 6 }]} pointerEvents="box-none">
        <TextCustom style={styles.title}>{t('tabs.Reels')}</TextCustom>
        <Pressable
          onPress={() => setMuted(m => !m)}
          style={styles.mute}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={t(muted ? 'reels.unmute' : 'reels.mute')}
        >
          {muted ? <VolumeX size={18} color={COLORS.white} /> : <Volume2 size={18} color={COLORS.white} />}
        </Pressable>
      </View>
    </View>
  );
};

type ItemProps = {
  reel: Reel;
  height: number;
  playing: boolean;
  mounted: boolean;
  muted: boolean;
  bottomInset: number;
};

const ReelItem = memo(function ReelItemView({ reel, height, playing, mounted, muted, bottomInset }: ItemProps) {
  const { t, row } = useI18n();
  const l = useLocalized();
  const { requireAuth } = useAuthGate();
  const root = useNavigation<NavigationProp<RootStackParamList>>();
  const [paused, setPaused] = useState(false);
  const [ready, setReady] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const rowDir = { flexDirection: row };

  const isPlaying = playing && !paused;

  const onShare = () => {
    Share.share({ message: `${l(reel.creator)} — ${l(reel.caption)}` }).catch(() => {});
  };

  const onCta = () => {
    if (reel.productId) root.navigate('FashionProduct', { productId: reel.productId });
    else requireAuth('book');
  };

  return (
    <View style={[styles.item, { height }]}>
      <Image source={reel.poster} style={StyleSheet.absoluteFill} resizeMode="cover" />
      {mounted ? (
        <Video
          source={reel.video}
          style={[StyleSheet.absoluteFill, !ready && styles.hidden]}
          resizeMode="cover"
          repeat
          paused={!isPlaying}
          muted={muted}
          controls={false}
          disableFocus
          ignoreSilentSwitch="ignore"
          playInBackground={false}
          onReadyForDisplay={() => setReady(true)}
          onBuffer={e => setBuffering(e.isBuffering)}
        />
      ) : null}

      {/* Tap anywhere to pause / resume */}
      <Pressable
        style={StyleSheet.absoluteFill}
        onPress={() => setPaused(p => !p)}
        accessibilityRole="button"
        accessibilityLabel={t(isPlaying ? 'reels.pause' : 'reels.play')}
      />

      <Svg style={styles.fade} pointerEvents="none">
        <Defs>
          <LinearGradient id={`reelFade-${reel.id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#000" stopOpacity={0} />
            <Stop offset="1" stopColor="#000" stopOpacity={0.7} />
          </LinearGradient>
        </Defs>
        <Rect x="0" y="0" width="100%" height="100%" fill={`url(#reelFade-${reel.id})`} />
      </Svg>

      {playing && (buffering || !ready) ? (
        <ActivityIndicator style={styles.center} color={COLORS.white} />
      ) : null}
      {playing && paused ? (
        <View style={styles.center} pointerEvents="none">
          <View style={styles.playBadge}>
            <Play size={28} color={COLORS.white} fill={COLORS.white} />
          </View>
        </View>
      ) : null}

      {/* Bottom: creator, caption, CTA — with the action rail beside it */}
      <View style={[styles.bottom, rowDir, { bottom: bottomInset }]} pointerEvents="box-none">
        <View style={styles.info} pointerEvents="box-none">
          <View style={[styles.creatorRow, rowDir]}>
            <Image source={reel.avatar} style={styles.avatar} />
            <View style={styles.flexShrink}>
              <View style={[styles.inline, rowDir]}>
                <TextCustom style={styles.creator} numberOfLines={1}>
                  {l(reel.creator)}
                </TextCustom>
                <BadgeCheck size={13} color={COLORS.brand} />
              </View>
              <TextCustom style={styles.handle}>{reel.handle}</TextCustom>
            </View>
            <Pressable
              onPress={() => requireAuth('favourite') && setFollowing(f => !f)}
              style={[styles.follow, following && styles.following]}
              accessibilityRole="button"
            >
              <TextCustom style={styles.followText}>{t(following ? 'reels.following' : 'reels.follow')}</TextCustom>
            </Pressable>
          </View>
          <TextCustom style={styles.caption} numberOfLines={3}>
            {l(reel.caption)}
          </TextCustom>
          <View style={[styles.inline, styles.ctaRow, rowDir]}>
            <View style={styles.tag}>
              <TextCustom style={styles.tagText}>{l(reel.tag)}</TextCustom>
            </View>
            <Pressable onPress={onCta} style={[styles.cta, rowDir]} accessibilityRole="button">
              {reel.productId ? <ShoppingBag size={13} color={COLORS.ink} /> : <Plus size={13} color={COLORS.ink} />}
              <TextCustom style={styles.ctaText}>{t(reel.productId ? 'reels.shopLook' : 'reels.bookNow')}</TextCustom>
            </Pressable>
          </View>
        </View>

        <View style={styles.rail}>
          <RailButton
            label={compact(reel.likes + (liked ? 1 : 0))}
            a11y={t('reels.like')}
            onPress={() => requireAuth('likeReel') && setLiked(v => !v)}
          >
            <Heart size={26} color={liked ? COLORS.brand : COLORS.white} fill={liked ? COLORS.brand : 'transparent'} />
          </RailButton>
          <RailButton label={compact(reel.comments)} a11y={t('reels.comment')} onPress={() => requireAuth('commentReel')}>
            <MessageCircle size={26} color={COLORS.white} />
          </RailButton>
          <RailButton
            label={t('reels.save')}
            a11y={t('reels.save')}
            onPress={() => requireAuth('saveReel') && setSaved(v => !v)}
          >
            <Bookmark size={25} color={COLORS.white} fill={saved ? COLORS.white : 'transparent'} />
          </RailButton>
          <RailButton label={t('reels.share')} a11y={t('reels.share')} onPress={onShare}>
            <Send size={24} color={COLORS.white} />
          </RailButton>
        </View>
      </View>
    </View>
  );
});

const RailButton: FC<{ label: string; a11y: string; onPress: () => void; children: ReactNode }> = ({
  label,
  a11y,
  onPress,
  children,
}) => (
  <Pressable onPress={onPress} style={styles.railButton} hitSlop={6} accessibilityRole="button" accessibilityLabel={a11y}>
    {children}
    <TextCustom style={styles.railLabel}>{label}</TextCustom>
  </Pressable>
);

const textShadow = {
  textShadowColor: 'rgba(0,0,0,0.45)',
  textShadowRadius: 6,
  textShadowOffset: { width: 0, height: 1 },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  item: {
    width: '100%',
    backgroundColor: COLORS.black,
    overflow: 'hidden',
  },
  hidden: {
    opacity: 0,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '55%',
  },
  center: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 4,
  },
  header: {
    position: 'absolute',
    left: 20,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontFamily: FONTS.heading,
    fontSize: 22,
    color: COLORS.white,
    ...textShadow,
  },
  mute: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottom: {
    position: 'absolute',
    left: 16,
    right: 12,
    alignItems: 'flex-end',
    gap: 12,
  },
  info: {
    flex: 1,
  },
  flexShrink: {
    flexShrink: 1,
  },
  inline: {
    alignItems: 'center',
    gap: 4,
  },
  creatorRow: {
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: COLORS.white,
    backgroundColor: COLORS.brandSoft,
  },
  creator: {
    flexShrink: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.white,
    ...textShadow,
  },
  handle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  follow: {
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.white,
    justifyContent: 'center',
  },
  following: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderColor: 'transparent',
  },
  followText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.white,
  },
  caption: {
    marginTop: 10,
    fontSize: 13,
    lineHeight: 19,
    color: COLORS.white,
    ...textShadow,
  },
  ctaRow: {
    marginTop: 10,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
  },
  tagText: {
    fontSize: 11,
    color: COLORS.white,
  },
  cta: {
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 12,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.white,
  },
  ctaText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
  },
  rail: {
    alignItems: 'center',
    gap: 18,
    paddingBottom: 4,
  },
  railButton: {
    alignItems: 'center',
    gap: 3,
  },
  railLabel: {
    fontFamily: FONTS.medium,
    fontSize: 11,
    color: COLORS.white,
    ...textShadow,
  },
});
