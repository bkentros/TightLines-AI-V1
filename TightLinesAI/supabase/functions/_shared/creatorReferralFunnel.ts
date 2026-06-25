type SupabaseClient = {
  from: (table: string) => {
    update: (values: Record<string, unknown>) => {
      eq: (column: string, value: string) => {
        is: (column: string, value: null) => Promise<unknown>;
      };
    };
    select: (columns: string) => {
      eq: (column: string, value: string) => {
        eq: (column: string, value: string) => {
          maybeSingle: () => Promise<{ data: { id: string } | null; error: unknown }>;
        };
      };
    };
    insert: (values: Record<string, unknown>) => Promise<{ error: unknown }>;
  };
};

export type ReferralAppOpenMatchMethod =
  | "deep_link"
  | "clipboard"
  | "fingerprint"
  | "install_recent"
  | "universal_link";

/** Idempotent: sets referral_clicks.app_opened_at + inserts funnel app_open once. */
export async function recordReferralAppOpen(
  supabase: SupabaseClient,
  input: {
    clickId: string;
    creatorId: string;
    matchMethod: ReferralAppOpenMatchMethod;
    alreadyOpened: boolean;
  },
): Promise<void> {
  if (!input.alreadyOpened) {
    await supabase
      .from("referral_clicks")
      .update({
        app_opened_at: new Date().toISOString(),
        app_open_match_method: input.matchMethod,
      })
      .eq("id", input.clickId)
      .is("app_opened_at", null);
  }

  const { data: existing } = await supabase
    .from("referral_funnel_events")
    .select("id")
    .eq("referral_click_id", input.clickId)
    .eq("event_type", "app_open")
    .maybeSingle();

  if (!existing) {
    const { error } = await supabase.from("referral_funnel_events").insert({
      referral_click_id: input.clickId,
      creator_id: input.creatorId,
      event_type: "app_open",
      match_method: input.matchMethod,
    });
    if (error) {
      console.warn("[recordReferralAppOpen] funnel insert failed", {
        clickId: input.clickId,
        creatorId: input.creatorId,
        error: error instanceof Error ? error.message : String(error),
      });
    }
  }
}
