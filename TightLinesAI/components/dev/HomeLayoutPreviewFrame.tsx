import { StyleSheet, Text, View } from "react-native";

import { paper } from "../../lib/theme";
import { layoutPreviewLabel } from "../../lib/iphoneLayoutPreview";
import { IPHONE_LAYOUT_PROFILES } from "../../lib/responsiveAuth";

type Props = {
  width: number | null;
  children: React.ReactNode;
};

/**
 * Admin-only: previews Home inside a true-to-size device frame at the chosen
 * iPhone width/height. We constrain the box (no transform scaling) so the inner
 * ScrollView keeps native scrolling — the whole layout, including the footer and
 * Transparency button, stays reachable on every preset.
 */
export function HomeLayoutPreviewFrame({ width, children }: Props) {
  if (width == null) return <>{children}</>;

  // For a given width, simulate the SHORTEST matching iPhone so vertical-fit
  // issues surface in the strictest case (e.g. 375 → SE 667, not Mini 812).
  const matching = IPHONE_LAYOUT_PROFILES.filter((p) => p.width === width);
  const presetHeight = matching.length
    ? Math.min(...matching.map((p) => p.height))
    : null;

  return (
    <View style={styles.host}>
      <Text style={styles.badge}>
        Layout preview · {layoutPreviewLabel(width)} · tap Off in Settings for
        full screen
      </Text>
      <View style={styles.stage}>
        <View
          style={[
            styles.frame,
            { width, maxWidth: "100%" },
            presetHeight != null && { height: presetHeight, maxHeight: "100%" },
          ]}
        >
          {children}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    flex: 1,
    backgroundColor: paper.dashboardInk,
  },
  badge: {
    alignSelf: "stretch",
    textAlign: "center",
    paddingTop: 4,
    paddingBottom: 6,
    paddingHorizontal: 10,
    fontFamily: "JetBrainsMono_500Medium",
    fontSize: 8.5,
    letterSpacing: 0.6,
    color: "rgba(255,255,255,0.7)",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  stage: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  frame: {
    overflow: "hidden",
    backgroundColor: paper.dashboardCream,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.18)",
  },
});
