export const PUBLIC_SUPPORT_EMAIL = 'support@finfindr.app';

export function buildSupportMailtoUrl(input?: {
  subject?: string;
  body?: string;
}): string {
  const params = [
    input?.subject ? `subject=${encodeURIComponent(input.subject)}` : null,
    input?.body ? `body=${encodeURIComponent(input.body)}` : null,
  ].filter((value): value is string => Boolean(value));

  return `mailto:${PUBLIC_SUPPORT_EMAIL}${params.length ? `?${params.join('&')}` : ''}`;
}
