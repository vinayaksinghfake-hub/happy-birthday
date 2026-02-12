import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Image,
  ImageSourcePropType,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  withDelay,
  Easing,
  FadeIn,
  FadeInUp,
  FadeInDown,
} from "react-native-reanimated";
import { Ionicons, Feather } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

const PHOTO_SOURCES: ImageSourcePropType[] = [
  require("@/assets/images/photo1.jpg"),
  require("@/assets/images/photo3.jpg"),
  require("@/assets/images/photo2.jpg"),
  require("@/assets/images/photo4.jpg"),
];

const PHOTOS = [
  { id: "1", caption: "Our first date", icon: "heart" as const },
  { id: "2", caption: "The first time we met", icon: "star" as const },
  { id: "3", caption: "That smile I fell in love with", icon: "sparkles" as const },
  { id: "4", caption: "My forever favorite moment", icon: "heart" as const },
];

function Sparkle({ delay, x, y, size }: { delay: number; x: number; y: number; size: number }) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 1200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      )
    );
    scale.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200 }),
          withTiming(0.3, { duration: 1200 })
        ),
        -1,
        false
      )
    );
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-30, { duration: 2400, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          left: x,
          top: y,
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <Ionicons name="sparkles" size={size} color={Colors.romantic.sparkle} />
    </Animated.View>
  );
}

function FloatingHeart({ delay, x, size }: { delay: number; x: number; size: number }) {
  const translateY = useSharedValue(SCREEN_HEIGHT);
  const opacity = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    const duration = 6000 + Math.random() * 4000;
    translateY.value = withDelay(
      delay,
      withRepeat(
        withTiming(-100, { duration, easing: Easing.inOut(Easing.ease) }),
        -1,
        false
      )
    );
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(0.15, { duration: 1500 }),
          withTiming(0.15, { duration: duration - 3000 }),
          withTiming(0, { duration: 1500 })
        ),
        -1,
        false
      )
    );
    rotation.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(15, { duration: 2000 }),
          withTiming(-15, { duration: 2000 })
        ),
        -1,
        true
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotation.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={[{ position: "absolute", left: x }, animatedStyle]}>
      <Ionicons name="heart" size={size} color={Colors.romantic.blushPink} />
    </Animated.View>
  );
}

function PulsingHeart({ onPress }: { onPress: () => void }) {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.15, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.heartButton, animatedStyle]}>
        <LinearGradient
          colors={["#E84057", "#D4487A", "#C74B90"]}
          style={styles.heartGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Ionicons name="heart" size={40} color="#fff" />
        </LinearGradient>
      </Animated.View>
    </Pressable>
  );
}

function PhotoCard({ item, index }: { item: typeof PHOTOS[0]; index: number }) {
  return (
    <View style={styles.photoCardContainer}>
      <View style={styles.photoGlow} />
      <View style={styles.photoCard}>
        <Image
          source={PHOTO_SOURCES[index]}
          style={styles.photoImage}
          resizeMode="cover"
        />
      </View>
      <View style={styles.captionContainer}>
        <Ionicons
          name={item.icon === "sparkles" ? "sparkles" : item.icon === "star" ? "star" : "heart"}
          size={14}
          color={Colors.romantic.deepRose}
        />
        <Text style={styles.captionText}>{item.caption}</Text>
      </View>
    </View>
  );
}

function SpecialPoint({ text, delay, icon }: { text: string; delay: number; icon: string }) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(600).springify()}
      style={styles.specialPoint}
    >
      <View style={styles.specialBullet}>
        <Ionicons name={icon as any} size={18} color={Colors.romantic.deepRose} />
      </View>
      <Text style={styles.specialText}>{text}</Text>
    </Animated.View>
  );
}

export default function BirthdayScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);
  const [showSurprise, setShowSurprise] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);

  const sparkles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    y: Math.random() * SCREEN_HEIGHT * 0.8,
    size: 8 + Math.random() * 16,
    delay: Math.random() * 3000,
  }));

  const floatingHearts = Array.from({ length: 8 }, (_, i) => ({
    id: i,
    x: Math.random() * SCREEN_WIDTH,
    size: 16 + Math.random() * 24,
    delay: i * 1200,
  }));

  const handleScrollToSurprise = () => {
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    scrollRef.current?.scrollTo({ y: SCREEN_HEIGHT * 0.9, animated: true });
  };

  const handleSurprisePress = () => {
    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
    setShowSurprise(true);
  };

  const onPhotoScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const x = e.nativeEvent.contentOffset.x;
    const index = Math.round(x / (SCREEN_WIDTH * 0.78));
    setActivePhoto(index);
  };

  const webTopInset = Platform.OS === "web" ? 67 : 0;
  const webBottomInset = Platform.OS === "web" ? 34 : 0;

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        bounces={true}
        contentContainerStyle={{ paddingBottom: 0 }}
      >
        {/* HERO SECTION */}
        <LinearGradient
          colors={["#2D1B30", "#4A1942", "#6B2D5B", "#8B3A62"]}
          style={[styles.heroSection, { paddingTop: insets.top + webTopInset + 60 }]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 1 }}
        >
          {sparkles.map((s) => (
            <Sparkle key={s.id} delay={s.delay} x={s.x} y={s.y} size={s.size} />
          ))}
          {floatingHearts.map((h) => (
            <FloatingHeart key={h.id} delay={h.delay} x={h.x} size={h.size} />
          ))}

          <Animated.View entering={FadeInDown.duration(1000).delay(300)}>
            <View style={styles.heroDecoTop}>
              <Ionicons name="sparkles" size={20} color={Colors.romantic.sparkle} />
              <View style={styles.heroLine} />
              <Ionicons name="heart" size={16} color={Colors.romantic.blushPink} />
              <View style={styles.heroLine} />
              <Ionicons name="sparkles" size={20} color={Colors.romantic.sparkle} />
            </View>
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.duration(1200).delay(500)}
            style={styles.heroTitle}
          >
            Happy Birthday,{"\n"}My Beautiful{"\n"}Kshitija
          </Animated.Text>

          <Animated.View entering={FadeIn.duration(800).delay(800)}>
            <Ionicons name="heart" size={28} color={Colors.romantic.heartRed} style={{ alignSelf: "center", marginVertical: 12 }} />
          </Animated.View>

          <Animated.Text
            entering={FadeInUp.duration(1000).delay(1000)}
            style={styles.heroSubtitle}
          >
            To my talented, kind-hearteddd girl who codes & sings like like an angelll 😭💖.
          </Animated.Text>

          <Animated.View entering={FadeInUp.duration(800).delay(1400)}>
            <Pressable
              onPress={handleScrollToSurprise}
              style={({ pressed }) => [
                styles.scrollButton,
                { opacity: pressed ? 0.85 : 1, transform: [{ scale: pressed ? 0.97 : 1 }] },
              ]}
            >
              <LinearGradient
                colors={["#D4487A", "#E84057"]}
                style={styles.scrollButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.scrollButtonText}>Scroll for a Surprise</Text>
                <Ionicons name="sparkles" size={18} color="#fff" />
              </LinearGradient>
            </Pressable>
          </Animated.View>

          <Animated.View entering={FadeIn.delay(1800).duration(600)} style={styles.heroBottomDeco}>
            <View style={styles.heroWave} />
          </Animated.View>
        </LinearGradient>

        {/* PHOTO GALLERY SECTION */}
        <LinearGradient
          colors={["#FFF0F3", "#FFF8F0", "#FFE4EC"]}
          style={styles.gallerySection}
        >
          <Animated.View entering={FadeInUp.duration(800)}>
            <Text style={styles.sectionTitle}>Our Memories</Text>
            <View style={styles.titleDeco}>
              <View style={styles.decoLine} />
              <Ionicons name="heart" size={14} color={Colors.romantic.deepRose} />
              <View style={styles.decoLine} />
            </View>
          </Animated.View>

          <FlatList
            data={PHOTOS}
            horizontal
            pagingEnabled={false}
            snapToInterval={SCREEN_WIDTH * 0.78 + 12}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.photoList}
            onScroll={onPhotoScroll}
            scrollEventThrottle={16}
            renderItem={({ item, index }) => (
              <PhotoCard item={item} index={index} />
            )}
            keyExtractor={(item) => item.id}
          />

          <View style={styles.dotsContainer}>
            {PHOTOS.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  i === activePhoto && styles.dotActive,
                ]}
              />
            ))}
          </View>
        </LinearGradient>

        {/* ABOUT HER SECTION */}
        <LinearGradient
          colors={["#FFE4EC", "#F8E8F0", "#E8D4F0"]}
          style={styles.aboutSection}
        >
          <Animated.View entering={FadeInUp.duration(800)}>
            <Text style={styles.sectionTitle}>Why You're So Special</Text>
            <View style={styles.titleDeco}>
              <View style={styles.decoLine} />
              <Ionicons name="sparkles" size={14} color={Colors.romantic.deepRose} />
              <View style={styles.decoLine} />
            </View>
          </Animated.View>

          <View style={styles.specialList}>
            <SpecialPoint
              text="Your are strong, independent and cuteee girl."
              delay={100}
              icon="star"
            />
            <SpecialPoint
              text="You are brilliantly smart and beautifully intelligent."
              delay={250}
              icon="code-slash"
            />
            <SpecialPoint
              text="Your singing melts my heart every time."
              delay={400}
              icon="musical-notes"
            />
            <SpecialPoint
              text="You inspire me every single day."
              delay={550}
              icon="sunny"
            />
            <SpecialPoint
              text="I'm so lucky to have you in my life."
              delay={700}
              icon="heart"
            />
          </View>
        </LinearGradient>

        {/* LOVE LETTER SECTION */}
        <LinearGradient
          colors={["#E8D4F0", "#DBC4E8", "#D8B4E2"]}
          style={styles.letterSection}
        >
          <Animated.View entering={FadeInUp.duration(800)}>
            <Text style={styles.sectionTitle}>A Letter to You</Text>
            <View style={styles.titleDeco}>
              <View style={styles.decoLine} />
              <Feather name="feather" size={14} color={Colors.romantic.deepRose} />
              <View style={styles.decoLine} />
            </View>
          </Animated.View>

          <Animated.View
            entering={FadeIn.duration(1000).delay(300)}
            style={styles.letterCard}
          >
            <LinearGradient
              colors={["rgba(255,255,255,0.95)", "rgba(255,240,243,0.95)"]}
              style={styles.letterCardInner}
            >
              <Ionicons name="mail-open" size={28} color={Colors.romantic.deepRose} style={{ alignSelf: "center", marginBottom: 16 }} />

              <Text style={styles.letterSalutation}>Kshitija,</Text>
              <Text style={styles.letterBody}>
                On your special day, I want to tell you how I feel. I love you deeply, and I see you as my happiness, my peace, and my greatest blessing.
              </Text>
              <Text style={styles.letterBody}>
                I admire you more every day as I watch you chase your dreams, work so hard, and sing with passion.
              </Text>
              <Text style={styles.letterBody}>
                I promise to stand beside you, support you, and celebrate you through every moment, today and always.
              </Text>
              <Text style={styles.letterSign}>
                Happy Birthday, my love
              </Text>
              <Ionicons name="heart" size={20} color={Colors.romantic.heartRed} style={{ alignSelf: "center", marginTop: 8 }} />
            </LinearGradient>
          </Animated.View>
        </LinearGradient>

        {/* FINAL SURPRISE SECTION */}
        <LinearGradient
          colors={["#4A1942", "#2D1B30", "#1A0F1E"]}
          style={styles.surpriseSection}
        >
          {sparkles.slice(0, 12).map((s) => (
            <Sparkle
              key={`s2-${s.id}`}
              delay={s.delay + 500}
              x={s.x}
              y={s.y * 0.4}
              size={s.size}
            />
          ))}

          <Animated.View entering={FadeInUp.duration(1000)}>
            <Text style={styles.surpriseTitle}>
              Will You Keep Being{"\n"}My Forever?
            </Text>
          </Animated.View>

          <Animated.View entering={FadeIn.duration(800).delay(400)} style={styles.surpriseIconRow}>
            <Ionicons name="sparkles" size={20} color={Colors.romantic.sparkle} />
            <Ionicons name="heart" size={24} color={Colors.romantic.heartRed} />
            <Ionicons name="sparkles" size={20} color={Colors.romantic.sparkle} />
          </Animated.View>

          <Animated.View entering={FadeInUp.duration(800).delay(600)}>
            <PulsingHeart onPress={handleSurprisePress} />
          </Animated.View>

          {showSurprise && (
            <Animated.View entering={FadeInUp.duration(800).springify()} style={styles.surpriseReveal}>
              <LinearGradient
                colors={["rgba(212,72,122,0.2)", "rgba(232,64,87,0.2)"]}
                style={styles.surpriseRevealInner}
              >
                <Ionicons name="sparkles" size={24} color={Colors.romantic.sparkle} />
                <Text style={styles.surpriseRevealText}>
                  Forever Starts Now
                </Text>
                <Ionicons name="sparkles" size={24} color={Colors.romantic.sparkle} />
              </LinearGradient>
            </Animated.View>
          )}

          <Animated.View entering={FadeIn.delay(1000).duration(600)} style={styles.footerDeco}>
            <Text style={styles.footerText}>Made with</Text>
            <Ionicons name="heart" size={14} color={Colors.romantic.heartRed} />
            <Text style={styles.footerText}>for Kshitija</Text>
          </Animated.View>
        </LinearGradient>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2D1B30",
  },
  scrollView: {
    flex: 1,
  },

  heroSection: {
    minHeight: SCREEN_HEIGHT,
    paddingHorizontal: 28,
    paddingBottom: 60,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  heroDecoTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
  },
  heroLine: {
    width: 40,
    height: 1,
    backgroundColor: "rgba(255,182,193,0.5)",
  },
  heroTitle: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 44,
    color: "#fff",
    textAlign: "center",
    lineHeight: 56,
    textShadowColor: "rgba(212,72,122,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
  },
  heroSubtitle: {
    fontFamily: "Poppins_400Regular",
    fontSize: 15,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 16,
    marginTop: 4,
  },
  scrollButton: {
    marginTop: 32,
    borderRadius: 30,
    overflow: "hidden",
  },
  scrollButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
  },
  scrollButtonText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 15,
    color: "#fff",
  },
  heroBottomDeco: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 40,
  },
  heroWave: {
    flex: 1,
    backgroundColor: "#FFF0F3",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },

  gallerySection: {
    paddingVertical: 48,
  },
  sectionTitle: {
    fontFamily: "PlayfairDisplay_700Bold",
    fontSize: 28,
    color: Colors.romantic.textPrimary,
    textAlign: "center",
    marginBottom: 8,
  },
  titleDeco: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 28,
  },
  decoLine: {
    width: 36,
    height: 1.5,
    backgroundColor: Colors.romantic.blushPink,
  },
  photoList: {
    paddingHorizontal: 20,
    gap: 12,
  },
  photoCardContainer: {
    width: SCREEN_WIDTH * 0.78,
    alignItems: "center",
  },
  photoGlow: {
    position: "absolute",
    top: 8,
    left: 8,
    right: 8,
    bottom: 30,
    borderRadius: 20,
    backgroundColor: Colors.romantic.deepRose,
    opacity: 0.5,
    shadowColor: Colors.romantic.deepRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
  },
  photoCard: {
    width: "100%",
    height: SCREEN_WIDTH * 0.95,
    borderRadius: 20,
    overflow: "hidden",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 20,
  },
  captionContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 12,
    paddingHorizontal: 8,
  },
  captionText: {
    fontFamily: "Poppins_500Medium",
    fontSize: 13,
    color: Colors.romantic.textSecondary,
    fontStyle: "italic",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.romantic.blushPink,
    opacity: 0.4,
  },
  dotActive: {
    opacity: 1,
    backgroundColor: Colors.romantic.deepRose,
    width: 24,
  },

  aboutSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  specialList: {
    gap: 16,
  },
  specialPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    borderRadius: 16,
    shadowColor: Colors.romantic.deepRose,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  specialBullet: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.romantic.petal,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  specialText: {
    flex: 1,
    fontFamily: "Poppins_500Medium",
    fontSize: 15,
    color: Colors.romantic.textPrimary,
    lineHeight: 22,
    paddingTop: 6,
  },

  letterSection: {
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  letterCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: Colors.romantic.deepRose,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 6,
  },
  letterCardInner: {
    padding: 28,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212,72,122,0.15)",
  },
  letterSalutation: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 28,
    color: Colors.romantic.deepRose,
    marginBottom: 16,
  },
  letterBody: {
    fontFamily: "PlayfairDisplay_400Regular",
    fontSize: 15,
    color: Colors.romantic.textPrimary,
    lineHeight: 26,
    marginBottom: 14,
  },
  letterSign: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 22,
    color: Colors.romantic.deepRose,
    textAlign: "center",
    marginTop: 12,
  },

  surpriseSection: {
    paddingVertical: 80,
    paddingHorizontal: 28,
    alignItems: "center",
    minHeight: SCREEN_HEIGHT * 0.7,
    justifyContent: "center",
    overflow: "hidden",
  },
  surpriseTitle: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 36,
    color: "#fff",
    textAlign: "center",
    lineHeight: 48,
    textShadowColor: "rgba(212,72,122,0.6)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 20,
    marginBottom: 16,
  },
  surpriseIconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 32,
  },
  heartButton: {
    borderRadius: 40,
    overflow: "hidden",
    shadowColor: Colors.romantic.heartRed,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  heartGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  surpriseReveal: {
    marginTop: 32,
  },
  surpriseRevealInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.3)",
  },
  surpriseRevealText: {
    fontFamily: "DancingScript_700Bold",
    fontSize: 26,
    color: "#fff",
    textShadowColor: "rgba(255,215,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  footerDeco: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 60,
  },
  footerText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
});
