import { Platform } from 'react-native';
import { getValidAccessToken, invokeEdgeFunction } from './supabase';

export type FeedbackTopic =
  | 'general'
  | 'bug'
  | 'feature'
  | 'subscription'
  | 'todays_bite'
  | 'tackle_box'
  | 'water_read'
  | 'smart_log';

export type FeedbackSentiment = 'looks_right' | 'needs_work' | 'note';

export type SubmitFeedbackInput = {
  topic: FeedbackTopic;
  message: string;
  sentiment?: FeedbackSentiment | null;
  featureName?: string | null;
  contextLines?: string[];
};

export async function submitFeedback(input: SubmitFeedbackInput): Promise<{
  ok: boolean;
  email_sent?: boolean;
}> {
  const accessToken = await getValidAccessToken();
  return invokeEdgeFunction('submit-feedback', {
    accessToken,
    body: {
      topic: input.topic,
      message: input.message,
      sentiment: input.sentiment ?? null,
      feature_name: input.featureName ?? null,
      context_lines: input.contextLines ?? [],
      app_platform: Platform.OS,
    },
  });
}
