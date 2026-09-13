// Generate transactional SQL tests for an isolated database with PierCast migrations applied.
import {
  buildPierCastDailyScoreSnapshot,
  buildPierCastReviewOutlook,
  buildPierCastShadowForecastPayload,
  PIER_CAST_CORE_SPECIES_IDS,
  PIER_CAST_ENGINE_VERSION,
} from "../supabase/functions/_shared/pierCastEngine/index.ts";
import { completeLmhofsBatch } from "../supabase/functions/_shared/pierCastEngine/tests/fixtures/lmhofs.ts";
const batch = completeLmhofsBatch();
const outlook = buildPierCastReviewOutlook({
  batch,
  evaluationTime: "2026-09-10T00:35:00.000Z",
});
const payload = buildPierCastShadowForecastPayload({
  batch,
  outlook,
  ingestionSource: "live_lmhofs",
  engineVersion: PIER_CAST_ENGINE_VERSION,
});
const snapshot = buildPierCastDailyScoreSnapshot({
  batch,
  lakeDate: "2026-09-10",
  generatedAt: "2026-09-10T00:36:00.000Z",
  engineVersion: PIER_CAST_ENGINE_VERSION,
});
const legacy = structuredClone(snapshot);
delete legacy.speciesRosterVersion;
legacy.engineVersion = "pier-cast-simple-model-v0.8.0";
for (const city of legacy.cities) {
  city.date.species = city.date.species.filter((s) =>
    (PIER_CAST_CORE_SPECIES_IDS as readonly string[]).includes(s.speciesId)
  );
}
const q = (value: unknown) => {
  const text = JSON.stringify(value);
  if (text.includes("$fixture$")) throw Error("Unsafe fixture");
  return "$fixture$" + text + "$fixture$::jsonb";
};
const wrong = structuredClone(snapshot);
wrong.cities[0].date.species.at(-1)!.speciesId = "channel_catfish";
const duplicate = structuredClone(snapshot);
duplicate.cities[0].date.species.at(-1)!.speciesId = "chinook_salmon";
const wrongForecast = structuredClone(payload.forecasts);
wrongForecast[0].speciesId = "channel_catfish";
const legacyRun = {...payload.run, engineVersion: "pier-cast-simple-model-v0.8.0", speciesRosterVersion: "piercast-five-city-four-species-v1"};
const legacyForecasts = payload.forecasts.filter(f => (PIER_CAST_CORE_SPECIES_IDS as readonly string[]).includes(f.speciesId));
console.log(`begin;
insert into public.pier_cast_temperature_cycles values ('${batch.issuedAt}','complete') on conflict do nothing;
do $test$ declare result jsonb; begin
 result:=public.commit_pier_cast_shadow_forecast(${q(payload.run)},${
  q(payload.forecasts)
});
 if (result->>'forecastCount')::integer<>135 then raise exception 'expanded shadow count';end if;
 result:=public.commit_pier_cast_shadow_forecast(${q(payload.run)},${
  q(payload.forecasts)
});
 if result->>'status'<>'already_committed' then raise exception 'shadow idempotency';end if;
 begin perform public.commit_pier_cast_shadow_forecast(${q(payload.run)},${
  q(wrongForecast)
});raise exception 'bad forecast accepted'; exception when others then if sqlerrm='bad forecast accepted' then raise;end if;end;
 begin perform public.commit_pier_cast_daily_score_snapshot(${
  q(wrong)
});raise exception 'wrong-city species accepted';exception when others then if sqlerrm='wrong-city species accepted' then raise;end if;end;
 begin perform public.commit_pier_cast_daily_score_snapshot(${
  q(duplicate)
});raise exception 'duplicate accepted';exception when others then if sqlerrm='duplicate accepted' then raise;end if;end;
 result:=public.commit_pier_cast_daily_score_snapshot(${q(legacy)});
 if result->>'status'<>'committed' then raise exception 'legacy write';end if;
 result:=public.commit_pier_cast_daily_score_snapshot(${q(snapshot)});
 if result->>'status'<>'already_committed' then raise exception 'daily lock changed';end if;
 if (select jsonb_array_length(snapshot->'cities'->0->'date'->'species') from public.pier_cast_daily_score_snapshots where lake_date='2026-09-10')<>4 then raise exception 'legacy overwritten';end if;
end;$test$;
rollback;
begin;
insert into public.pier_cast_temperature_cycles values ('${batch.issuedAt}','complete') on conflict do nothing;
do $test$ declare result jsonb; begin
 result:=public.commit_pier_cast_daily_score_snapshot(${q(snapshot)});
 if result->>'status'<>'committed' then raise exception 'new snapshot failed';end if;
 if (select jsonb_array_length(snapshot->'cities'->0->'date'->'species') from public.pier_cast_daily_score_snapshots where lake_date='2026-09-10')<>6 then raise exception 'new roster missing';end if;
 if has_function_privilege('anon','public.commit_pier_cast_daily_score_snapshot(jsonb)','execute') then raise exception 'public privilege';end if;
end;$test$;
rollback;`);
