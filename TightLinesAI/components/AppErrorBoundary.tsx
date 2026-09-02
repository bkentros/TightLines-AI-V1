import { Component, type ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { captureAnalytics } from '../lib/analytics';
import { paper, paperFonts, paperSpacing } from '../lib/theme';

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches uncaught React render errors so the app shows recovery UI instead
 * of an immediate native crash loop.
 */
export class AppErrorBoundary extends Component<
  AppErrorBoundaryProps,
  AppErrorBoundaryState
> {
  state: AppErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: { componentStack?: string | null }) {
    captureAnalytics('app_render_error', {
      error_name: error.name || 'Error',
      error_message: error.message?.slice(0, 300) || 'Unknown render error',
      has_component_stack: Boolean(info.componentStack),
    });
    if (__DEV__) {
      console.error('[AppErrorBoundary]', error, info.componentStack);
    }
  }

  private handleRetry = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      const detail = this.state.error.message?.trim();
      return (
        <View style={styles.screen}>
          <Text style={styles.eyebrow}>FINFINDR · RECOVERY</Text>
          <Text style={styles.title}>Something went wrong.</Text>
          <Text style={styles.body}>
            FinFindr hit an unexpected error. Tap try again. If this keeps
            happening, delete the app and reinstall from TestFlight or the App
            Store.
          </Text>
          {detail ? (
            <Text style={styles.detail} selectable>
              {detail}
            </Text>
          ) : null}
          <Pressable
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
            onPress={this.handleRetry}
          >
            <Text style={styles.buttonText}>TRY AGAIN</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: paper.dashboardCream,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: paperSpacing.xl,
    gap: paperSpacing.md,
  },
  eyebrow: {
    fontFamily: paperFonts.metaMonoBold,
    fontSize: 10,
    letterSpacing: 2.4,
    color: paper.dashboardBlue,
  },
  title: {
    fontFamily: paperFonts.display,
    fontSize: 28,
    color: paper.dashboardInk,
    textAlign: 'center',
  },
  body: {
    fontFamily: paperFonts.body,
    fontSize: 15,
    lineHeight: 22,
    color: paper.dashboardInk,
    opacity: 0.78,
    textAlign: 'center',
  },
  detail: {
    fontFamily: paperFonts.metaMono,
    fontSize: 11,
    lineHeight: 16,
    color: paper.dashboardInk,
    opacity: 0.55,
    textAlign: 'center',
    marginTop: paperSpacing.xs,
  },
  button: {
    marginTop: paperSpacing.sm,
    paddingHorizontal: paperSpacing.lg,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: paper.dashboardInk,
  },
  buttonPressed: {
    opacity: 0.88,
  },
  buttonText: {
    fontFamily: paperFonts.bodyBold,
    fontSize: 12,
    letterSpacing: 2.4,
    color: '#FFFFFF',
  },
});
