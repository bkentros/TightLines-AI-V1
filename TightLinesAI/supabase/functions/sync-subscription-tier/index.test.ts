import { assertEquals, assertRejects } from "jsr:@std/assert";
import { syncExistingProfileTier } from "./index.ts";

function profileClient(result: {
  data: Record<string, unknown> | null;
  error: { message: string } | null;
}) {
  const observed: Record<string, unknown> = {};
  const client = {
    from(table: string) {
      observed.table = table;
      return {
        update(values: Record<string, unknown>) {
          observed.values = values;
          return {
            eq(column: string, value: string) {
              observed.filter = { column, value };
              return {
                select() {
                  return {
                    maybeSingle: async () => result,
                  };
                },
              };
            },
          };
        },
      };
    },
  };
  return { client, observed };
}

Deno.test("subscription tier sync updates an existing profile", async () => {
  const profile = { id: "user-1", subscription_tier: "angler" };
  const { client, observed } = profileClient({ data: profile, error: null });

  const result = await syncExistingProfileTier(
    client as never,
    "user-1",
    "angler",
    "2026-09-02T03:00:00.000Z",
  );

  assertEquals(result, { profile, state: "updated" });
  assertEquals(observed, {
    table: "profiles",
    values: {
      subscription_tier: "angler",
      updated_at: "2026-09-02T03:00:00.000Z",
    },
    filter: { column: "id", value: "user-1" },
  });
});

Deno.test("subscription tier sync treats an absent onboarding profile as pending", async () => {
  const { client } = profileClient({ data: null, error: null });

  const result = await syncExistingProfileTier(
    client as never,
    "user-without-profile",
    "angler",
  );

  assertEquals(result, { profile: null, state: "pending_onboarding" });
});

Deno.test("subscription tier sync still raises genuine database failures", async () => {
  const { client } = profileClient({
    data: null,
    error: { message: "database unavailable" },
  });

  await assertRejects(
    () => syncExistingProfileTier(client as never, "user-1", "free"),
    Error,
    "database unavailable",
  );
});
