import { StyleSheet, Text, useWindowDimensions, View } from "react-native";

import { paper } from "../../lib/theme";
import { layoutPreviewLabel } from "../../lib/iphoneLayoutPreview";

type Props = {
  width: number | null;
  children: React.ReactNode;
};

/**
 * Admin-only: shows Home as it would appear on a narrower iPhone by scaling
 * the full device layout down (edge-to-edge inside the preview column, no side gutters).
 */
export function HomeLayoutPreviewFrame({ width, children }: Props) {
  const { width: deviceWidth, height: deviceHeight } = useWindowDimensions();

  if (width == null) return <>{children}</>;

  const scale = width / deviceWidth;

  return (
    <View style={styles.host}>
      <Text style={styles.badge}>
        Layout preview · {layoutPreviewLabel(width)} · scaled to {width}pt · tap Off
        in Settings for full screen
      </Text>
      <View style={[styles.clip, { width }]}>
        <View
          style={[
            styles.scaledLayer,
            {
              width: deviceWidth,
              height: deviceHeight,
              transform: [{ scale }],
            },
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
    backgroundColor: paper.dashboardCream,
    alignItems: "center",
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
    color: "rgba(10,27,46,0.55)",
    backgroundColor: "rgba(10,27,46,0.06)",
  },
  clip: {
    flex: 1,
    overflow: "hidden",
    alignSelf: "center",
  },
  scaledLayer: {
    transformOrigin: "top left",
  },
});
