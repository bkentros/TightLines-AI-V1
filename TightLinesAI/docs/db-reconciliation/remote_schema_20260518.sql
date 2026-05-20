


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer DEFAULT 0, "in_max_attempts" integer DEFAULT 10) RETURNS TABLE("allowed" boolean, "same_request" boolean, "job_id" "uuid", "lake_id" "uuid", "season_context_key" "text", "map_width" integer, "engine_version" "text", "status" "text", "attempts" integer, "max_attempts" integer, "next_attempt_at" timestamp with time zone, "last_error" "text", "requested_by" "uuid", "created_at" timestamp with time zone, "updated_at" timestamp with time zone)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  active public.water_reader_user_active_generation_requests;
  job public.water_reader_generation_jobs;
  requested_max_attempts integer := greatest(coalesce(in_max_attempts, 10), 1);
  request_is_same boolean;
begin
  perform pg_advisory_xact_lock(
    hashtext('water_reader_user_active_generation_request'),
    hashtext(in_user_id::text)
  );

  delete from public.water_reader_user_active_generation_requests active_requests
  where active_requests.user_id = in_user_id
    and exists (
      select 1
      from public.water_reader_engine_read_cache cache
      where cache.lake_id = active_requests.lake_id
        and cache.season_context_key = active_requests.season_context_key
        and cache.map_width = active_requests.map_width
        and cache.engine_version = active_requests.engine_version
    );

  select *
  into active
  from public.water_reader_user_active_generation_requests
  where user_id = in_user_id
  for update;

  if active.user_id is not null then
    select *
    into job
    from public.water_reader_generation_jobs
    where id = active.generation_job_id;

    if job.id is not null and job.status = 'failed' and job.attempts < job.max_attempts then
      update public.water_reader_generation_jobs jobs
      set
        status = 'queued',
        max_attempts = greatest(jobs.max_attempts, requested_max_attempts),
        failed_at = null,
        locked_by = null,
        locked_at = null,
        next_attempt_at = now()
      where jobs.id = job.id
      returning jobs.* into job;
    end if;

    if job.id is not null and job.status in ('queued', 'processing') then
      request_is_same :=
        active.lake_id = in_lake_id
        and active.season_context_key = in_season_context_key
        and active.map_width = in_map_width
        and active.engine_version = in_engine_version;

      if request_is_same then
        insert into public.water_reader_user_history (
          user_id,
          lake_id,
          season_context_key,
          map_width,
          engine_version,
          generation_job_id,
          status,
          last_viewed_at
        )
        values (
          in_user_id,
          active.lake_id,
          active.season_context_key,
          active.map_width,
          active.engine_version,
          job.id,
          'preparing',
          now()
        )
        on conflict on constraint water_reader_user_history_cache_key_unique
        do update set
          generation_job_id = excluded.generation_job_id,
          status = 'preparing',
          last_viewed_at = now();
      end if;

      return query
      select
        false,
        request_is_same,
        job.id,
        active.lake_id,
        active.season_context_key,
        active.map_width,
        active.engine_version,
        job.status,
        job.attempts,
        job.max_attempts,
        job.next_attempt_at,
        job.last_error,
        job.requested_by,
        job.created_at,
        job.updated_at;
      return;
    end if;

    delete from public.water_reader_user_active_generation_requests
    where user_id = in_user_id;
  end if;

  job := public.ensure_water_reader_generation_job(
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    in_user_id,
    coalesce(in_priority, 0)
  );

  update public.water_reader_generation_jobs jobs
  set
    max_attempts = greatest(jobs.max_attempts, requested_max_attempts),
    status = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then 'queued'
      else jobs.status
    end,
    failed_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.failed_at
    end,
    locked_by = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.locked_by
    end,
    locked_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then null
      else jobs.locked_at
    end,
    next_attempt_at = case
      when jobs.status = 'failed' and jobs.attempts < greatest(jobs.max_attempts, requested_max_attempts) then now()
      else jobs.next_attempt_at
    end
  where jobs.id = job.id
  returning jobs.* into job;

  insert into public.water_reader_user_active_generation_requests (
    user_id,
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    generation_job_id
  )
  values (
    in_user_id,
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    job.id
  );

  insert into public.water_reader_user_history (
    user_id,
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    generation_job_id,
    status,
    last_viewed_at
  )
  values (
    in_user_id,
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    job.id,
    'preparing',
    now()
  )
  on conflict on constraint water_reader_user_history_cache_key_unique
  do update set
    generation_job_id = excluded.generation_job_id,
    status = 'preparing',
    last_viewed_at = now();

  return query
  select
    true,
    true,
    job.id,
    job.lake_id,
    job.season_context_key,
    job.map_width,
    job.engine_version,
    job.status,
    job.attempts,
    job.max_attempts,
    job.next_attempt_at,
    job.last_error,
    job.requested_by,
    job.created_at,
    job.updated_at;
end;
$$;


ALTER FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer, "in_max_attempts" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."browse_waterbodies_by_state"("state_filter" "text" DEFAULT NULL::"text", "waterbody_type_filter" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 10) RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "surface_area_acres" numeric, "centroid_lat" double precision, "centroid_lon" double precision, "preview_bbox_min_lon" double precision, "preview_bbox_min_lat" double precision, "preview_bbox_max_lon" double precision, "preview_bbox_max_lat" double precision, "data_tier" "text", "aerial_available" boolean, "depth_available" boolean, "depth_usability_status" "text", "availability" "text", "source_status" "text", "best_available_mode" "text", "confidence" "text", "water_reader_support_status" "text", "water_reader_support_reason" "text", "has_polygon_geometry" boolean, "polygon_area_acres" double precision, "polygon_qa_flags" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
  with params as (
    select
      upper(nullif(trim(state_filter), '')) as state_q,
      lower(nullif(trim(waterbody_type_filter), '')) as type_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  limited_ids as materialized (
    select
      w.id,
      w.surface_area_acres,
      w.search_priority,
      w.canonical_name,
      w.state_code,
      w.county_name
    from public.waterbody_index w
    cross join params p
    where
      w.is_named = true
      and w.is_searchable = true
      and w.county_name is not null
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (p.type_q is null or w.waterbody_type = p.type_q)
    order by
      w.search_priority,
      w.surface_area_acres desc nulls last,
      w.canonical_name,
      w.state_code,
      coalesce(w.county_name, '')
    limit (select row_limit from params)
  ),
  limited as materialized (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      w.search_priority,
      ST_NumGeometries(w.geometry) as poly_components,
      ST_NPoints(w.geometry) as poly_pts,
      case
        when w.geometry is null or ST_IsEmpty(w.geometry) then false
        else coalesce(ST_IsValid(w.geometry), false)
      end as geom_valid
    from limited_ids i
    join public.waterbody_index w on w.id = i.id
  ),
  bbox_raw as (
    select
      d.id,
      ST_XMin(env)::double precision as min_lon,
      ST_YMin(env)::double precision as min_lat,
      ST_XMax(env)::double precision as max_lon,
      ST_YMax(env)::double precision as max_lat
    from limited d
    cross join lateral (select ST_Envelope(d.geometry) as env) e
  ),
  bbox_padded as (
    select
      id,
      (min_lon + max_lon) / 2.0 as center_lon,
      (min_lat + max_lat) / 2.0 as center_lat,
      least(
        0.18,
        greatest(0.002, ((max_lat - min_lat) / 2.0) * 1.08)
      ) as half_lat,
      least(
        0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
        greatest(
          0.002 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
          ((max_lon - min_lon) / 2.0) * 1.08
        )
      ) as half_lon
    from bbox_raw
    where min_lon < max_lon and min_lat < max_lat
  ),
  bbox as (
    select
      id,
      greatest(-180.0, center_lon - half_lon) as min_lon,
      greatest(-90.0, center_lat - half_lat) as min_lat,
      least(180.0, center_lon + half_lon) as max_lon,
      least(90.0, center_lat + half_lat) as max_lat
    from bbox_padded
  )
  select
    d.id as lake_id,
    d.canonical_name as name,
    d.state_code as state,
    d.county_name as county,
    d.waterbody_type,
    d.surface_area_acres,
    ST_Y(d.centroid) as centroid_lat,
    ST_X(d.centroid) as centroid_lon,
    b.min_lon as preview_bbox_min_lon,
    b.min_lat as preview_bbox_min_lat,
    b.max_lon as preview_bbox_max_lon,
    b.max_lat as preview_bbox_max_lat,
    'polygon_only'::text as data_tier,
    false as aerial_available,
    false as depth_available,
    'unavailable'::text as depth_usability_status,
    'limited'::text as availability,
    'limited'::text as source_status,
    null::text as best_available_mode,
    'low'::text as confidence,
    case
      when not d.geom_valid then 'not_supported'
      when d.surface_area_acres is not null and d.surface_area_acres < 20 then 'limited'
      when d.poly_components > 1 or d.poly_pts > 25000 then 'limited'
      else 'supported'
    end as water_reader_support_status,
    case
      when not d.geom_valid then 'Stored polygon failed validity checks.'
      when d.poly_components > 1 then 'Multipart polygon; Water Reader can open the primary geometry with limited-read caution.'
      when d.poly_pts > 25000 then 'High-complexity polygon; Water Reader can open it with limited-read caution.'
      when d.surface_area_acres is not null and d.surface_area_acres < 20 then 'Small waterbody; structure read may be limited.'
      else 'Valid hydrography polygon meets baseline V1 checks.'
    end as water_reader_support_reason,
    d.geom_valid as has_polygon_geometry,
    d.surface_area_acres::double precision as polygon_area_acres,
    array_remove(array[
      case when not d.geom_valid then 'invalid_geometry' end,
      case when d.poly_components > 1 then 'multipart_geometry' end,
      case when d.surface_area_acres is not null and d.surface_area_acres >= 0.5 and d.surface_area_acres < 20 then 'small_waterbody' end,
      case when d.poly_pts > 25000 then 'high_vertex_count' end
    ], null) as polygon_qa_flags
  from limited d
  left join bbox b on b.id = d.id
  order by
    d.search_priority,
    d.surface_area_acres desc nulls last,
    d.canonical_name,
    d.state_code,
    coalesce(d.county_name, '');
$$;


ALTER FUNCTION "public"."browse_waterbodies_by_state"("state_filter" "text", "waterbody_type_filter" "text", "result_limit" integer) OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."water_reader_generation_jobs" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "lake_id" "uuid" NOT NULL,
    "season_context_key" "text" NOT NULL,
    "map_width" integer NOT NULL,
    "engine_version" "text" NOT NULL,
    "status" "text" DEFAULT 'queued'::"text" NOT NULL,
    "priority" integer DEFAULT 0 NOT NULL,
    "attempts" integer DEFAULT 0 NOT NULL,
    "max_attempts" integer DEFAULT 3 NOT NULL,
    "requested_by" "uuid",
    "locked_by" "text",
    "locked_at" timestamp with time zone,
    "next_attempt_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "started_at" timestamp with time zone,
    "completed_at" timestamp with time zone,
    "failed_at" timestamp with time zone,
    "last_error" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "water_reader_generation_jobs_status_check" CHECK (("status" = ANY (ARRAY['queued'::"text", 'processing'::"text", 'complete'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."water_reader_generation_jobs" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text" DEFAULT 'Water Reader generation was cancelled.'::"text") RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
begin
  update public.water_reader_generation_jobs jobs
  set
    attempts = jobs.max_attempts,
    status = 'failed',
    failed_at = now(),
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(in_error, 'Water Reader generation was cancelled.'), 4000)
  where jobs.id = in_job_id
  returning * into job;

  update public.water_reader_user_history
  set status = 'failed'
  where generation_job_id = in_job_id;

  delete from public.water_reader_user_active_generation_requests
  where generation_job_id = in_job_id;

  return job;
end;
$$;


ALTER FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval DEFAULT '00:03:00'::interval) RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
begin
  with candidate as (
    select id
    from public.water_reader_generation_jobs
    where (
        status = 'queued'
        and attempts < max_attempts
        and next_attempt_at <= now()
      )
      or (
        status = 'processing'
        and locked_at < now() - in_lock_timeout
        and attempts < max_attempts
      )
    order by priority desc, next_attempt_at asc, created_at asc
    for update skip locked
    limit 1
  )
  update public.water_reader_generation_jobs jobs
  set
    status = 'processing',
    locked_by = in_worker_id,
    locked_at = now(),
    started_at = coalesce(jobs.started_at, now()),
    last_error = null
  from candidate
  where jobs.id = candidate.id
  returning jobs.* into job;

  return job;
end;
$$;


ALTER FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid" DEFAULT NULL::"uuid", "in_generation_job_id" "uuid" DEFAULT NULL::"uuid", "in_lake_id" "uuid" DEFAULT NULL::"uuid", "in_season_context_key" "text" DEFAULT NULL::"text", "in_map_width" integer DEFAULT NULL::integer, "in_engine_version" "text" DEFAULT NULL::"text") RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  deleted_count integer := 0;
begin
  delete from public.water_reader_user_active_generation_requests active_requests
  where (in_user_id is null or active_requests.user_id = in_user_id)
    and (in_generation_job_id is null or active_requests.generation_job_id = in_generation_job_id)
    and (in_lake_id is null or active_requests.lake_id = in_lake_id)
    and (in_season_context_key is null or active_requests.season_context_key = in_season_context_key)
    and (in_map_width is null or active_requests.map_width = in_map_width)
    and (in_engine_version is null or active_requests.engine_version = in_engine_version);

  get diagnostics deleted_count = row_count;
  return deleted_count;
end;
$$;


ALTER FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid", "in_generation_job_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone DEFAULT "now"()) RETURNS TABLE("allowed" boolean, "feature" "text", "window_seconds" integer, "max_requests" integer, "request_count" integer, "remaining" integer, "reset_at" timestamp with time zone, "retry_after_seconds" integer)
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
#variable_conflict use_column
declare
  normalized_feature text := left(nullif(btrim(in_feature), ''), 80);
  normalized_window integer := greatest(coalesce(in_window_seconds, 60), 1);
  normalized_max integer := greatest(coalesce(in_max_requests, 1), 1);
  bucket_start timestamptz;
  bucket_reset_at timestamptz;
  new_count integer;
begin
  if in_user_id is null or normalized_feature is null then
    return query
    select false, coalesce(normalized_feature, 'unknown'), normalized_window,
      normalized_max, 0, 0, in_now + make_interval(secs => normalized_window),
      normalized_window;
    return;
  end if;

  bucket_start := to_timestamp(
    floor(extract(epoch from in_now) / normalized_window) * normalized_window
  );
  bucket_reset_at := bucket_start + make_interval(secs => normalized_window);

  insert into public.app_feature_rate_limit_buckets (
    user_id,
    feature,
    window_seconds,
    window_start,
    request_count,
    updated_at
  )
  values (
    in_user_id,
    normalized_feature,
    normalized_window,
    bucket_start,
    1,
    timezone('utc', now())
  )
  on conflict on constraint app_feature_rate_limit_buckets_pkey
  do update set
    request_count = public.app_feature_rate_limit_buckets.request_count + 1,
    updated_at = timezone('utc', now())
  returning public.app_feature_rate_limit_buckets.request_count into new_count;

  if random() < 0.02 then
    delete from public.app_feature_rate_limit_buckets
    where window_start < in_now - interval '3 days';
  end if;

  return query
  select
    new_count <= normalized_max,
    normalized_feature,
    normalized_window,
    normalized_max,
    new_count,
    greatest(normalized_max - new_count, 0),
    bucket_reset_at,
    case
      when new_count <= normalized_max then 0
      else greatest(1, ceiling(extract(epoch from (bucket_reset_at - in_now)))::integer)
    end;
end;
$$;


ALTER FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid" DEFAULT NULL::"uuid", "in_priority" integer DEFAULT 0) RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
begin
  insert into public.water_reader_generation_jobs (
    lake_id,
    season_context_key,
    map_width,
    engine_version,
    priority,
    requested_by
  )
  values (
    in_lake_id,
    in_season_context_key,
    in_map_width,
    in_engine_version,
    coalesce(in_priority, 0),
    in_requested_by
  )
  on conflict (lake_id, season_context_key, map_width, engine_version)
  do update set
    priority = greatest(public.water_reader_generation_jobs.priority, excluded.priority),
    requested_by = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then excluded.requested_by
      else coalesce(public.water_reader_generation_jobs.requested_by, excluded.requested_by)
    end,
    status = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then 'queued'
      else public.water_reader_generation_jobs.status
    end,
    locked_by = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then null
      else public.water_reader_generation_jobs.locked_by
    end,
    locked_at = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then null
      else public.water_reader_generation_jobs.locked_at
    end,
    next_attempt_at = case
      when public.water_reader_generation_jobs.status in ('failed', 'complete')
        and public.water_reader_generation_jobs.attempts < public.water_reader_generation_jobs.max_attempts
        then now()
      else public.water_reader_generation_jobs.next_attempt_at
    end,
    completed_at = case
      when public.water_reader_generation_jobs.status = 'complete' then null
      else public.water_reader_generation_jobs.completed_at
    end
  returning * into job;

  return job;
end;
$$;


ALTER FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid", "in_priority" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "centroid_lat" double precision, "centroid_lon" double precision, "bbox_min_lon" double precision, "bbox_min_lat" double precision, "bbox_max_lon" double precision, "bbox_max_lat" double precision, "area_sq_m" double precision, "area_acres" double precision, "perimeter_m" double precision, "geojson" "jsonb", "source_dataset" "text", "source_feature_id" "text", "source_summary" "jsonb", "geometry_is_valid" boolean, "geometry_validity_detail" "text", "component_count" integer, "interior_ring_count" integer, "water_reader_support_status" "text", "water_reader_support_reason" "text", "polygon_qa_flags" "text"[])
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    AS $$
declare
  wb record;
  policy record;
  g geometry;
  ga geography;
  env geometry;
  vdetail text;
  sqm double precision;
  per_m double precision;
  min_lon double precision;
  min_lat double precision;
  max_lon double precision;
  max_lat double precision;
  gj jsonb;
begin
  select
    wi.id,
    wi.canonical_name,
    wi.state_code,
    wi.county_name,
    wi.waterbody_type,
    wi.centroid,
    wi.geometry,
    wi.external_source,
    wi.external_id,
    wi.source_summary
  into wb
  from public.waterbody_index wi
  where wi.id = in_lake_id;

  if not found then
    return;
  end if;

  g := wb.geometry;
  select * into policy
  from public.water_reader_polygon_support_policy(wb.waterbody_type, g);

  if not policy.type_ok or not policy.has_geom_raw or not policy.geom_valid then
    return query select
      wb.id,
      wb.canonical_name,
      wb.state_code,
      wb.county_name,
      wb.waterbody_type,
      ST_Y(wb.centroid)::double precision,
      ST_X(wb.centroid)::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::jsonb,
      wb.external_source,
      wb.external_id,
      wb.source_summary,
      false,
      case
        when not policy.type_ok then 'Unsupported waterbody type for V1.'
        when not policy.has_geom_raw then 'Empty or null geometry.'
        else ST_IsValidReason(g)
      end::text,
      0,
      0,
      policy.water_reader_support_status,
      policy.water_reader_support_reason,
      policy.polygon_qa_flags;
    return;
  end if;

  vdetail := 'Valid Geometry';
  ga := g::geography;
  sqm := ST_Area(ga);
  per_m := ST_Perimeter(ga);
  env := ST_Envelope(g);
  min_lon := ST_XMin(env);
  min_lat := ST_YMin(env);
  max_lon := ST_XMax(env);
  max_lat := ST_YMax(env);
  gj := ST_AsGeoJSON(g)::jsonb;

  return query select
    wb.id,
    wb.canonical_name,
    wb.state_code,
    wb.county_name,
    wb.waterbody_type,
    ST_Y(wb.centroid)::double precision,
    ST_X(wb.centroid)::double precision,
    min_lon,
    min_lat,
    max_lon,
    max_lat,
    sqm,
    policy.poly_acres,
    per_m,
    gj,
    wb.external_source,
    wb.external_id,
    wb.source_summary,
    true,
    vdetail,
    policy.poly_components,
    policy.poly_rings,
    policy.water_reader_support_status,
    policy.water_reader_support_reason,
    policy.polygon_qa_flags;
end;
$$;


ALTER FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") IS 'Water Reader V1: GeoJSON polygon + Brandon openable support metadata from waterbody_index (read-only).';



CREATE OR REPLACE FUNCTION "public"."get_waterbody_polygon_runtime_for_reader"("in_lake_id" "uuid") RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "centroid_lat" double precision, "centroid_lon" double precision, "bbox_min_lon" double precision, "bbox_min_lat" double precision, "bbox_max_lon" double precision, "bbox_max_lat" double precision, "area_sq_m" double precision, "area_acres" double precision, "perimeter_m" double precision, "geojson" "jsonb", "source_dataset" "text", "source_feature_id" "text", "source_summary" "jsonb", "geometry_is_valid" boolean, "geometry_validity_detail" "text", "component_count" integer, "interior_ring_count" integer, "water_reader_support_status" "text", "water_reader_support_reason" "text", "polygon_qa_flags" "text"[], "original_vertex_count" integer, "runtime_vertex_count" integer, "runtime_component_count" integer, "runtime_interior_ring_count" integer, "runtime_simplified" boolean, "runtime_simplification_tolerance" double precision)
    LANGUAGE "plpgsql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public', 'extensions'
    SET "statement_timeout" TO '30s'
    AS $$
declare
  wb record;
  g geometry;
  runtime_g geometry;
  candidate_g geometry;
  env geometry;
  vdetail text;
  sqm double precision;
  acres double precision;
  per_m double precision;
  min_lon double precision;
  min_lat double precision;
  max_lon double precision;
  max_lat double precision;
  policy record;
  original_pts integer := 0;
  runtime_pts integer := 0;
  runtime_components integer := 0;
  runtime_rings integer := 0;
  tolerance double precision := 0.0;
  simplified boolean := false;
begin
  select
    wi.id,
    wi.canonical_name,
    wi.state_code,
    wi.county_name,
    wi.waterbody_type,
    wi.centroid,
    wi.geometry,
    wi.external_source,
    wi.external_id,
    wi.source_summary
  into wb
  from public.waterbody_index wi
  where wi.id = in_lake_id;

  if not found then
    return;
  end if;

  g := wb.geometry;
  select *
  into policy
  from public.water_reader_polygon_support_policy(wb.waterbody_type, g);

  if g is null or ST_IsEmpty(g) or not coalesce(policy.geom_valid, false) then
    return query select
      wb.id,
      wb.canonical_name,
      wb.state_code,
      wb.county_name,
      wb.waterbody_type,
      ST_Y(wb.centroid)::double precision,
      ST_X(wb.centroid)::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::double precision,
      null::jsonb,
      wb.external_source,
      wb.external_id,
      wb.source_summary,
      false,
      case
        when g is null or ST_IsEmpty(g) then 'Empty or null geometry.'
        else ST_IsValidReason(g)
      end,
      0,
      0,
      coalesce(policy.water_reader_support_status, 'not_supported')::text,
      coalesce(policy.water_reader_support_reason, 'No usable polygon geometry.')::text,
      coalesce(policy.polygon_qa_flags, array[]::text[]),
      0,
      0,
      0,
      0,
      false,
      0.0::double precision;
    return;
  end if;

  original_pts := coalesce(policy.poly_pts, ST_NPoints(g));
  runtime_g := g;

  if original_pts > 50000 then
    tolerance := 0.00015;
  elsif original_pts > 25000 then
    tolerance := 0.00008;
  end if;

  if tolerance > 0 then
    candidate_g := ST_SimplifyPreserveTopology(g, tolerance);
    if candidate_g is not null
      and not ST_IsEmpty(candidate_g)
      and ST_IsValid(candidate_g)
      and ST_NPoints(candidate_g) < original_pts
    then
      runtime_g := candidate_g;
      simplified := true;
    else
      tolerance := 0.0;
    end if;
  end if;

  sqm := ST_Area(g::geography);
  acres := sqm / 4046.8564224;
  per_m := ST_Perimeter(g::geography);
  env := ST_Envelope(g);
  min_lon := ST_XMin(env);
  min_lat := ST_YMin(env);
  max_lon := ST_XMax(env);
  max_lat := ST_YMax(env);
  vdetail := 'Valid Geometry';
  runtime_pts := ST_NPoints(runtime_g);
  runtime_components := ST_NumGeometries(runtime_g);
  select coalesce(sum(ST_NumInteriorRings(t.geom)), 0)::integer
  into runtime_rings
  from (
    select (ST_Dump(runtime_g)).geom as geom
  ) as t;

  return query select
    wb.id,
    wb.canonical_name,
    wb.state_code,
    wb.county_name,
    wb.waterbody_type,
    ST_Y(wb.centroid)::double precision,
    ST_X(wb.centroid)::double precision,
    min_lon,
    min_lat,
    max_lon,
    max_lat,
    sqm,
    acres,
    per_m,
    case
      when policy.water_reader_support_status = 'not_supported' then null::jsonb
      else ST_AsGeoJSON(runtime_g)::jsonb
    end,
    wb.external_source,
    wb.external_id,
    wb.source_summary,
    true,
    vdetail,
    policy.poly_components,
    policy.poly_rings,
    policy.water_reader_support_status,
    policy.water_reader_support_reason,
    policy.polygon_qa_flags,
    original_pts,
    runtime_pts,
    runtime_components,
    runtime_rings,
    simplified,
    tolerance;
end;
$$;


ALTER FUNCTION "public"."get_waterbody_polygon_runtime_for_reader"("in_lake_id" "uuid") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."get_waterbody_polygon_runtime_for_reader"("in_lake_id" "uuid") IS 'Water Reader service-role-only runtime payload RPC. May return topology-preserving simplified GeoJSON for generation only; original support labels and QA flags remain authoritative.';



CREATE OR REPLACE FUNCTION "public"."handle_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
begin
  new.updated_at = now();
  return new;
end;
$$;


ALTER FUNCTION "public"."handle_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
begin
  update public.water_reader_generation_jobs
  set
    status = 'complete',
    completed_at = now(),
    failed_at = null,
    locked_by = null,
    locked_at = null,
    last_error = null
  where id = in_job_id
  returning * into job;

  update public.water_reader_user_history
  set status = 'ready'
  where generation_job_id = in_job_id;

  delete from public.water_reader_user_active_generation_requests
  where generation_job_id = in_job_id;

  return job;
end;
$$;


ALTER FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer DEFAULT 60) RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
  retryable boolean := public.water_reader_generation_error_is_retryable(in_error);
begin
  update public.water_reader_generation_jobs jobs
  set
    attempts = jobs.attempts + 1,
    max_attempts = case
      when retryable then greatest(jobs.max_attempts, jobs.attempts + 2, 10)
      else jobs.max_attempts
    end,
    status = case
      when retryable then 'queued'
      when jobs.attempts + 1 >= jobs.max_attempts then 'failed'
      else 'queued'
    end,
    failed_at = case
      when retryable then null
      when jobs.attempts + 1 >= jobs.max_attempts then now()
      else jobs.failed_at
    end,
    locked_by = null,
    locked_at = null,
    next_attempt_at = case
      when retryable or jobs.attempts + 1 < jobs.max_attempts
        then now() + make_interval(secs => greatest(coalesce(in_retry_after_seconds, 60), 1))
      else now()
    end,
    last_error = left(coalesce(in_error, 'Water Reader generation failed.'), 4000)
  where jobs.id = in_job_id
  returning * into job;

  if job.status = 'failed' then
    update public.water_reader_user_history
    set status = 'failed'
    where generation_job_id = in_job_id;

    delete from public.water_reader_user_active_generation_requests
    where generation_job_id = in_job_id;
  else
    update public.water_reader_user_history
    set status = 'preparing'
    where generation_job_id = in_job_id;
  end if;

  return job;
end;
$$;


ALTER FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."normalize_waterbody_name"("raw_name" "text") RETURNS "text"
    LANGUAGE "sql" IMMUTABLE
    AS $$
  select trim(
    regexp_replace(
      regexp_replace(
        lower(coalesce(raw_name, '')),
        '[^a-z0-9]+',
        ' ',
        'g'
      ),
      '\s+',
      ' ',
      'g'
    )
  );
$$;


ALTER FUNCTION "public"."normalize_waterbody_name"("raw_name" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval DEFAULT '00:03:00'::interval) RETURNS integer
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  updated_count integer := 0;
begin
  update public.water_reader_generation_jobs jobs
  set
    status = 'queued',
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(jobs.last_error, 'Requeued stale Water Reader generation.'), 4000)
  where jobs.status = 'processing'
    and jobs.locked_at is not null
    and jobs.locked_at < now() - in_lock_timeout
    and jobs.attempts < jobs.max_attempts;

  get diagnostics updated_count = row_count;
  return updated_count;
end;
$$;


ALTER FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text" DEFAULT 'Retrying Water Reader generation.'::"text") RETURNS "public"."water_reader_generation_jobs"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
declare
  job public.water_reader_generation_jobs;
begin
  update public.water_reader_generation_jobs jobs
  set
    status = 'queued',
    attempts = least(jobs.attempts, greatest(jobs.max_attempts - 1, 0)),
    max_attempts = greatest(jobs.max_attempts, 10),
    failed_at = null,
    locked_by = null,
    locked_at = null,
    next_attempt_at = now(),
    last_error = left(coalesce(in_reason, jobs.last_error, 'Retrying Water Reader generation.'), 4000)
  where jobs.id = in_job_id
    and jobs.status = 'failed'
    and public.water_reader_generation_error_is_retryable(jobs.last_error)
  returning * into job;

  if job.id is not null then
    update public.water_reader_user_history
    set status = 'preparing'
    where generation_job_id = in_job_id;
  end if;

  return job;
end;
$$;


ALTER FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_waterbodies"("query_text" "text", "state_filter" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 10) RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "surface_area_acres" numeric, "centroid_lat" double precision, "centroid_lon" double precision, "preview_bbox_min_lon" double precision, "preview_bbox_min_lat" double precision, "preview_bbox_max_lon" double precision, "preview_bbox_max_lat" double precision, "data_tier" "text", "aerial_available" boolean, "depth_available" boolean, "depth_usability_status" "text", "availability" "text", "source_status" "text", "best_available_mode" "text", "confidence" "text", "water_reader_support_status" "text", "water_reader_support_reason" "text", "has_polygon_geometry" boolean, "polygon_area_acres" double precision, "polygon_qa_flags" "text"[])
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
declare
  norm_q text := public.normalize_waterbody_name(query_text);
  state_q text := upper(nullif(trim(state_filter), ''));
  row_limit int := greatest(1, least(coalesce(result_limit, 10), 25));
  specific_tokens text[] := array[]::text[];
  local_tokens text[] := array[]::text[];
  single_token_generic boolean := false;
  short_generic_prefix boolean := false;
  long_tok text := null;
  specific_phrase text := '';
begin
  with tokens as (
    select lower(btrim(tk)) as token
    from unnest(string_to_array(norm_q, ' ')) as u(tk)
    where length(btrim(tk)) > 0
  ),
  specific as (
    select distinct token
    from tokens
    where token not in (
      'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
      'the', 'a', 'an', 'of', 'and', 'or', 'county', 'parish', 'borough',
      'municipality', 'township'
    )
  ),
  local_context as (
    select distinct token
    from tokens
    where token not in (
      'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
      'the', 'a', 'an', 'of', 'and', 'or', 'county', 'parish', 'borough',
      'municipality', 'township'
    )
      and length(token) >= 3
  )
  select
    coalesce(array_agg(s.token order by s.token), array[]::text[]),
    coalesce(
      (select array_agg(l.token order by l.token) from local_context l),
      array[]::text[]
    ),
    (
      (select count(*) from tokens) = 1
      and exists (
        select 1
        from tokens
        where token in ('lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res')
      )
    ),
    exists (
      select 1
      from tokens
      where token in ('lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res')
    )
    and (select count(*) from specific) = 1
    and (select max(length(token)) from specific) = 1,
    (select token from specific order by char_length(token) desc nulls last, token limit 1),
    coalesce((select string_agg(s2.token, ' ' order by s2.token) from specific s2), '')
  into specific_tokens, local_tokens, single_token_generic, short_generic_prefix, long_tok, specific_phrase
  from specific s;

  if short_generic_prefix then
    return query
    with candidate_matches as (
      select * from (
        select
          w.id,
          w.canonical_name,
          w.state_code,
          w.county_name,
          w.waterbody_type,
          w.surface_area_acres,
          w.centroid,
          w.geometry,
          case
            when w.normalized_name = norm_q then 0
            when w.normalized_name like norm_q || '%' then 10
            else 100
          end + w.search_priority as rank_score
        from public.waterbody_index w
        where
          norm_q <> ''
          and w.is_named = true
          and w.is_searchable = true
          and w.waterbody_type in ('lake', 'pond', 'reservoir')
          and (state_q is null or w.state_code = state_q)
          and w.normalized_name like norm_q || '%'
        order by w.search_priority, w.canonical_name, w.state_code, coalesce(w.county_name, '')
        limit 50
      ) phrase

      union all

      select * from (
        select
          w.id,
          w.canonical_name,
          w.state_code,
          w.county_name,
          w.waterbody_type,
          w.surface_area_acres,
          w.centroid,
          w.geometry,
          case
            when a.normalized_alias_name = norm_q then 2
            when a.normalized_alias_name like norm_q || '%' then 12
            else 100
          end + w.search_priority as rank_score
        from public.waterbody_aliases a
        join public.waterbody_index w on w.id = a.waterbody_id
        where
          norm_q <> ''
          and w.is_named = true
          and w.is_searchable = true
          and w.waterbody_type in ('lake', 'pond', 'reservoir')
          and (state_q is null or w.state_code = state_q)
          and a.normalized_alias_name like norm_q || '%'
        order by w.search_priority, w.canonical_name, w.state_code, coalesce(w.county_name, '')
        limit 50
      ) alias_phrase
    ),
    deduped as (
      select
        c.*,
        row_number() over (
          partition by c.id
          order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
        ) as rn
      from candidate_matches c
    ),
    limited as materialized (
      select *
      from deduped d
      where d.rn = 1
      order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
      limit row_limit
    )
    select e.*
    from limited d
    cross join lateral public.search_waterbodies_enrich_row(
      d.id,
      d.canonical_name,
      d.state_code,
      d.county_name,
      d.waterbody_type,
      d.surface_area_acres,
      d.centroid,
      d.geometry
    ) e
    order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '');
    return;
  end if;

  return query
  with candidate_matches as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when w.normalized_name = norm_q then 0
        when w.normalized_name like norm_q || '%' then 10
        when (not single_token_generic) and w.normalized_name like '%' || norm_q || '%' then 20
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (not single_token_generic)
      and w.normalized_name like '%' || norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when w.normalized_name = norm_q then 0
        when w.normalized_name like norm_q || '%' then 10
        when (not single_token_generic) and w.normalized_name like '%' || norm_q || '%' then 20
        when coalesce(array_length(specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(specific_tokens) as q(tok)
            where w.normalized_name not like '%' || q.tok || '%'
              and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q.tok || '%'
          )
        then 24
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q2(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q2.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and coalesce(array_length(specific_tokens, 1), 0) >= 1
      and long_tok is not null
      and (
        w.normalized_name like '%' || long_tok || '%'
        or public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || long_tok || '%'
      )
      and not exists (
        select 1
        from unnest(specific_tokens) as q3(tok)
        where w.normalized_name not like '%' || q3.tok || '%'
          and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q3.tok || '%'
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when a.normalized_alias_name = norm_q then 2
        when a.normalized_alias_name like norm_q || '%' then 12
        when (not single_token_generic) and a.normalized_alias_name like '%' || norm_q || '%' then 22
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q4(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q4.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (not single_token_generic)
      and a.normalized_alias_name like '%' || norm_q || '%'

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      case
        when a.normalized_alias_name = norm_q then 2
        when a.normalized_alias_name like norm_q || '%' then 12
        when (not single_token_generic) and a.normalized_alias_name like '%' || norm_q || '%' then 22
        when coalesce(array_length(specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(specific_tokens) as q5(tok)
            where a.normalized_alias_name not like '%' || q5.tok || '%'
              and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q5.tok || '%'
          )
        then 26
        else 100
      end
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q6(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q6.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and coalesce(array_length(specific_tokens, 1), 0) >= 1
      and long_tok is not null
      and (
        a.normalized_alias_name like '%' || long_tok || '%'
        or public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || long_tok || '%'
      )
      and not exists (
        select 1
        from unnest(specific_tokens) as q7(tok)
        where a.normalized_alias_name not like '%' || q7.tok || '%'
          and public.normalize_waterbody_name(coalesce(w.county_name, '')) not like '%' || q7.tok || '%'
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      350
      - least(80, greatest(
          similarity(w.normalized_name, norm_q),
          similarity(w.normalized_name, specific_phrase),
          word_similarity(norm_q, w.normalized_name),
          word_similarity(specific_phrase, w.normalized_name)
        ) * 80)::integer
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q8(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q8.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_index w
    where
      norm_q <> ''
      and char_length(norm_q) >= 4
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (
        w.normalized_name % norm_q
        or (specific_phrase <> '' and w.normalized_name % specific_phrase)
        or word_similarity(norm_q, w.normalized_name) >= 0.52
        or (specific_phrase <> '' and word_similarity(specific_phrase, w.normalized_name) >= 0.52)
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      w.geometry,
      335
      - least(80, greatest(
          similarity(a.normalized_alias_name, norm_q),
          similarity(a.normalized_alias_name, specific_phrase),
          word_similarity(norm_q, a.normalized_alias_name),
          word_similarity(specific_phrase, a.normalized_alias_name)
        ) * 80)::integer
      + case
          when coalesce(array_length(local_tokens, 1), 0) >= 1
            and exists (
              select 1
              from unnest(local_tokens) as q9(tok)
              where public.normalize_waterbody_name(coalesce(w.county_name, '')) like '%' || q9.tok || '%'
            )
          then -35
          else 0
        end
      + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    where
      norm_q <> ''
      and char_length(norm_q) >= 4
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (state_q is null or w.state_code = state_q)
      and (
        a.normalized_alias_name % norm_q
        or (specific_phrase <> '' and a.normalized_alias_name % specific_phrase)
        or word_similarity(norm_q, a.normalized_alias_name) >= 0.52
        or (specific_phrase <> '' and word_similarity(specific_phrase, a.normalized_alias_name) >= 0.52)
      )
  ),
  deduped as (
    select
      c.*,
      row_number() over (
        partition by c.id
        order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
      ) as rn
    from candidate_matches c
  ),
  limited as materialized (
    select *
    from deduped d
    where d.rn = 1
    order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
    limit row_limit
  )
  select e.*
  from limited d
  cross join lateral public.search_waterbodies_enrich_row(
    d.id,
    d.canonical_name,
    d.state_code,
    d.county_name,
    d.waterbody_type,
    d.surface_area_acres,
    d.centroid,
    d.geometry
  ) e
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '');
end;
$$;


ALTER FUNCTION "public"."search_waterbodies"("query_text" "text", "state_filter" "text", "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_waterbodies_enrich_row"("in_id" "uuid", "in_canonical_name" "text", "in_state_code" "text", "in_county_name" "text", "in_waterbody_type" "text", "in_surface_area_acres" numeric, "in_centroid" "extensions"."geometry", "in_geometry" "extensions"."geometry") RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "surface_area_acres" numeric, "centroid_lat" double precision, "centroid_lon" double precision, "preview_bbox_min_lon" double precision, "preview_bbox_min_lat" double precision, "preview_bbox_max_lon" double precision, "preview_bbox_max_lat" double precision, "data_tier" "text", "aerial_available" boolean, "depth_available" boolean, "depth_usability_status" "text", "availability" "text", "source_status" "text", "best_available_mode" "text", "confidence" "text", "water_reader_support_status" "text", "water_reader_support_reason" "text", "has_polygon_geometry" boolean, "polygon_area_acres" double precision, "polygon_qa_flags" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
  with v1status as (
    select *
    from public.water_reader_polygon_support_policy(in_waterbody_type, in_geometry)
  ),
  lm as (
    select
      coalesce(bool_or(l.source_mode = 'aerial' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.usability_status = 'usable'), false) as aerial_from_links,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'machine_readable' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_machine_readable_available,
      coalesce(bool_or(l.source_mode = 'depth' and l.depth_source_kind = 'chart_image' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and l.lake_match_status = 'matched' and l.usability_status = 'usable'), false) as depth_chart_image_available,
      coalesce(bool_or(l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'unvalidated'), false) as has_pending,
      coalesce(bool_or(l.approval_status = 'approved' and (s.review_status <> 'allowed' or s.can_fetch = false or l.fetch_validation_status in ('blocked', 'unreachable') or l.lake_match_status = 'mismatched' or l.usability_status = 'not_usable')), false) as has_blocked_candidate,
      coalesce(bool_or(l.source_mode = 'depth' and l.approval_status = 'approved' and s.review_status = 'allowed' and s.can_fetch = true and l.fetch_validation_status = 'reachable' and l.coverage_status not in ('blocked', 'unavailable') and (l.lake_match_status <> 'matched' or l.usability_status <> 'usable')), false) as has_depth_pending_match_or_usability
    from public.waterbody_source_links l
    join public.source_registry s on s.id = l.source_id
    where l.waterbody_id = in_id
  ),
  pm as (
    select exists (
      select 1
      from public.water_reader_aerial_provider_policies p
      join public.source_registry s on s.id = p.source_id
      where p.is_enabled = true
        and p.approval_status = 'approved'
        and s.review_status = 'allowed'
        and s.can_fetch = true
        and s.source_type = 'aerial_imagery'
        and p.provider_health_status = 'reachable'
        and not (coalesce(p.coverage -> 'exclude_state_codes', '[]'::jsonb) @> to_jsonb(in_state_code))
    ) as aerial_from_policy
  ),
  bbox_raw as (
    select
      ST_XMin(env)::double precision as min_lon,
      ST_YMin(env)::double precision as min_lat,
      ST_XMax(env)::double precision as max_lon,
      ST_YMax(env)::double precision as max_lat
    from (
      select ST_Envelope(in_geometry) as env
      where in_geometry is not null and not ST_IsEmpty(in_geometry)
    ) e
  ),
  bbox_padded as (
    select
      (min_lon + max_lon) / 2.0 as center_lon,
      (min_lat + max_lat) / 2.0 as center_lat,
      least(
        0.18,
        greatest(0.002, ((max_lat - min_lat) / 2.0) * 1.08)
      ) as half_lat,
      least(
        0.18 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
        greatest(
          0.002 / greatest(0.25, abs(cos(radians((min_lat + max_lat) / 2.0)))),
          ((max_lon - min_lon) / 2.0) * 1.08
        )
      ) as half_lon
    from bbox_raw
    where min_lon < max_lon and min_lat < max_lat
  ),
  bbox as (
    select
      greatest(-180.0, center_lon - half_lon) as min_lon,
      greatest(-90.0, center_lat - half_lat) as min_lat,
      least(180.0, center_lon + half_lon) as max_lon,
      least(90.0, center_lat + half_lat) as max_lat
    from bbox_padded
  ),
  m as (
    select
      lm.aerial_from_links or pm.aerial_from_policy as aerial_available,
      lm.depth_machine_readable_available,
      lm.depth_chart_image_available,
      lm.has_pending,
      lm.has_blocked_candidate,
      lm.has_depth_pending_match_or_usability
    from lm cross join pm
  )
  select
    in_id as lake_id,
    in_canonical_name as name,
    in_state_code as state,
    in_county_name as county,
    in_waterbody_type as waterbody_type,
    in_surface_area_acres as surface_area_acres,
    ST_Y(in_centroid) as centroid_lat,
    ST_X(in_centroid) as centroid_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lon else null end as preview_bbox_min_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.min_lat else null end as preview_bbox_min_lat,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lon else null end as preview_bbox_max_lon,
    case when b.min_lon < b.max_lon and b.min_lat < b.max_lat then b.max_lat else null end as preview_bbox_max_lat,
    case
      when m.aerial_available and m.depth_machine_readable_available then 'full_depth_aerial'
      when m.depth_machine_readable_available then 'depth_only'
      when m.depth_chart_image_available then 'chart_aligned_depth'
      when m.aerial_available then 'aerial_only'
      else 'polygon_only'
    end as data_tier,
    m.aerial_available,
    m.depth_machine_readable_available or m.depth_chart_image_available as depth_available,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'usable' when m.has_depth_pending_match_or_usability then 'needs_review' else 'unavailable' end as depth_usability_status,
    case when m.aerial_available and (m.depth_machine_readable_available or m.depth_chart_image_available) then 'both_available' when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth_available' when m.aerial_available then 'aerial_available' when m.has_blocked_candidate then 'blocked' else 'limited' end as availability,
    case when m.aerial_available or m.depth_machine_readable_available or m.depth_chart_image_available then 'ready' when m.has_pending or m.has_depth_pending_match_or_usability then 'partial' when m.has_blocked_candidate then 'blocked' else 'limited' end as source_status,
    case when m.depth_machine_readable_available or m.depth_chart_image_available then 'depth' when m.aerial_available then 'aerial' else null end as best_available_mode,
    case when m.depth_machine_readable_available then 'high' when m.aerial_available or m.depth_chart_image_available then 'medium' else 'low' end as confidence,
    vs.water_reader_support_status,
    vs.water_reader_support_reason,
    vs.has_polygon_geometry,
    vs.poly_acres,
    vs.polygon_qa_flags
  from m
  cross join v1status vs
  left join bbox b on true;
$$;


ALTER FUNCTION "public"."search_waterbodies_enrich_row"("in_id" "uuid", "in_canonical_name" "text", "in_state_code" "text", "in_county_name" "text", "in_waterbody_type" "text", "in_surface_area_acres" numeric, "in_centroid" "extensions"."geometry", "in_geometry" "extensions"."geometry") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."search_waterbodies_impl_20260427"("query_text" "text", "state_filter" "text" DEFAULT NULL::"text", "result_limit" integer DEFAULT 10) RETURNS TABLE("lake_id" "uuid", "name" "text", "state" "text", "county" "text", "waterbody_type" "text", "surface_area_acres" numeric, "centroid_lat" double precision, "centroid_lon" double precision, "data_tier" "text", "aerial_available" boolean, "depth_available" boolean, "depth_usability_status" "text", "availability" "text", "source_status" "text", "best_available_mode" "text", "confidence" "text")
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
  with
  p0 as (
    select
      public.normalize_waterbody_name(query_text) as norm_q,
      upper(nullif(trim(state_filter), '')) as state_q,
      greatest(1, least(coalesce(result_limit, 10), 25)) as row_limit
  ),
  p as (
    select
      p0.norm_q,
      p0.state_q,
      p0.row_limit,
      coalesce(st.specific_tokens, array[]::text[]) as specific_tokens,
      st.single_token_generic
    from p0
    cross join lateral (
      select
        coalesce((
          select array_agg(s.x order by s.x)
          from (
            select distinct lower(btrim(tk)) as x
            from unnest(string_to_array(p0.norm_q, ' ')) as u(tk)
            where length(btrim(tk)) > 0
              and lower(btrim(tk)) not in (
                'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res',
                'the', 'a', 'an', 'of', 'and', 'or', '&'
              )
          ) s
        ), array[]::text[]) as specific_tokens,
        (
          (select count(*)::int
           from unnest(string_to_array(p0.norm_q, ' ')) as u1(t1)
           where length(btrim(t1)) > 0) = 1
          and exists (
            select 1
            from unnest(string_to_array(p0.norm_q, ' ')) as u2(t2)
            where length(btrim(t2)) > 0
              and lower(btrim(t2)) in (
                'lake', 'lakes', 'pond', 'ponds', 'reservoir', 'reservoirs', 'res'
              )
          )
        ) as single_token_generic
    ) st
  ),
  drv as (
    select
      (
        select t
        from unnest(p.specific_tokens) as u(t)
        order by char_length(t) desc nulls last
        limit 1
      ) as long_tok
    from p
  ),
  candidate_matches as (
    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when w.normalized_name = p.norm_q then 0
        when w.normalized_name like p.norm_q || '%' then 10
        when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    cross join p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (not p.single_token_generic)
      and w.normalized_name like '%' || p.norm_q || '%'
      and (
        case
          when w.normalized_name = p.norm_q then 0
          when w.normalized_name like p.norm_q || '%' then 10
          when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
          else 100
        end
        < 100
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when w.normalized_name = p.norm_q then 0
        when w.normalized_name like p.norm_q || '%' then 10
        when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
        when
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q(tok)
            where w.normalized_name not like '%' || q.tok || '%'
          )
        then 24
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_index w
    cross join p
    cross join drv
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and coalesce(array_length(p.specific_tokens, 1), 0) >= 1
      and drv.long_tok is not null
      and w.normalized_name like '%' || drv.long_tok || '%'
      and not exists (
        select 1
        from unnest(p.specific_tokens) as q2(tok)
        where w.normalized_name not like '%' || q2.tok || '%'
      )
      and (
        case
          when w.normalized_name = p.norm_q then 0
          when w.normalized_name like p.norm_q || '%' then 10
          when (not p.single_token_generic) and w.normalized_name like '%' || p.norm_q || '%' then 20
          when
            coalesce(array_length(p.specific_tokens, 1), 0) >= 1
            and not exists (
              select 1
              from unnest(p.specific_tokens) as q3(tok)
              where w.normalized_name not like '%' || q3.tok || '%'
            )
          then 24
          else 100
        end
        < 100
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when a.normalized_alias_name = p.norm_q then 2
        when a.normalized_alias_name like p.norm_q || '%' then 12
        when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    cross join p
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and (not p.single_token_generic)
      and a.normalized_alias_name like '%' || p.norm_q || '%'
      and (
        case
          when a.normalized_alias_name = p.norm_q then 2
          when a.normalized_alias_name like p.norm_q || '%' then 12
          when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
          else 100
        end
        < 100
      )

    union all

    select
      w.id,
      w.canonical_name,
      w.state_code,
      w.county_name,
      w.waterbody_type,
      w.surface_area_acres,
      w.centroid,
      case
        when a.normalized_alias_name = p.norm_q then 2
        when a.normalized_alias_name like p.norm_q || '%' then 12
        when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
        when
          coalesce(array_length(p.specific_tokens, 1), 0) >= 1
          and not exists (
            select 1
            from unnest(p.specific_tokens) as q4(tok)
            where a.normalized_alias_name not like '%' || q4.tok || '%'
          )
        then 26
        else 100
      end + w.search_priority as rank_score
    from public.waterbody_aliases a
    join public.waterbody_index w on w.id = a.waterbody_id
    cross join p
    cross join drv
    where
      p.norm_q <> ''
      and w.is_named = true
      and w.is_searchable = true
      and w.waterbody_type in ('lake', 'pond', 'reservoir')
      and (p.state_q is null or w.state_code = p.state_q)
      and coalesce(array_length(p.specific_tokens, 1), 0) >= 1
      and drv.long_tok is not null
      and a.normalized_alias_name like '%' || drv.long_tok || '%'
      and not exists (
        select 1
        from unnest(p.specific_tokens) as q5(tok)
        where a.normalized_alias_name not like '%' || q5.tok || '%'
      )
      and (
        case
          when a.normalized_alias_name = p.norm_q then 2
          when a.normalized_alias_name like p.norm_q || '%' then 12
          when (not p.single_token_generic) and a.normalized_alias_name like '%' || p.norm_q || '%' then 22
          when
            coalesce(array_length(p.specific_tokens, 1), 0) >= 1
            and not exists (
              select 1
              from unnest(p.specific_tokens) as q6(tok)
              where a.normalized_alias_name not like '%' || q6.tok || '%'
            )
          then 26
          else 100
        end
        < 100
      )
  ),
  deduped as (
    select
      c.*,
      row_number() over (
        partition by c.id
        order by c.rank_score, c.canonical_name, c.state_code, coalesce(c.county_name, '')
      ) as rn
    from candidate_matches c
  )
  select
    d.id as lake_id,
    d.canonical_name as name,
    d.state_code as state,
    d.county_name as county,
    d.waterbody_type,
    d.surface_area_acres,
    ST_Y(d.centroid) as centroid_lat,
    ST_X(d.centroid) as centroid_lon,
    coalesce(snap.data_tier, 'polygon_only') as data_tier,
    coalesce(snap.aerial_available, false) as aerial_available,
    coalesce(snap.depth_machine_readable_available, false) or
      coalesce(snap.depth_chart_image_available, false) as depth_available,
    coalesce(snap.depth_usability_status, 'unavailable') as depth_usability_status,
    coalesce(snap.availability, 'limited') as availability,
    coalesce(snap.source_status, 'limited') as source_status,
    snap.best_available_mode,
    coalesce(snap.confidence, 'low') as confidence
  from deduped d
  left join public.waterbody_availability_snapshot snap on snap.lake_id = d.id
  cross join p
  where d.rn = 1
  order by d.rank_score, d.canonical_name, d.state_code, coalesce(d.county_name, '')
  limit (select row_limit from p);
$$;


ALTER FUNCTION "public"."search_waterbodies_impl_20260427"("query_text" "text", "state_filter" "text", "result_limit" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_environment_snapshots_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."set_environment_snapshots_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."set_generic_updated_at"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;


ALTER FUNCTION "public"."set_generic_updated_at"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") RETURNS boolean
    LANGUAGE "sql" IMMUTABLE
    AS $$
  select case
    when in_error is null or btrim(in_error) = '' then true
    when lower(in_error) like '%does not have polygon geometry%' then false
    when lower(in_error) like '%needs geometry cleanup%' then false
    when lower(in_error) like '%not supported%' then false
    when lower(in_error) like '%not_found%' then false
    when lower(in_error) like '%invalid_lake_id%' then false
    when lower(in_error) like '%invalid_map_width%' then false
    when lower(in_error) like '%invalid_engine_version%' then false
    else true
  end;
$$;


ALTER FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") RETURNS TABLE("type_ok" boolean, "has_geom_raw" boolean, "geom_valid" boolean, "poly_acres" double precision, "poly_components" integer, "poly_pts" integer, "poly_rings" integer, "has_polygon_geometry" boolean, "water_reader_support_status" "text", "water_reader_support_reason" "text", "polygon_qa_flags" "text"[])
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public', 'extensions'
    AS $$
  with v1poly as (
    select
      (in_waterbody_type in ('lake', 'pond', 'reservoir')) as type_ok,
      (in_geometry is not null and not ST_IsEmpty(in_geometry)) as has_geom_raw,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then false
        else coalesce(ST_IsValid(in_geometry), false)
      end as geom_valid,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then null::double precision
        when not ST_IsValid(in_geometry) then null::double precision
        else (ST_Area(in_geometry::geography) / 4046.8564224)::double precision
      end as poly_acres,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then 0
        when not ST_IsValid(in_geometry) then 0
        else ST_NumGeometries(in_geometry)
      end as poly_components,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) then 0
        when not ST_IsValid(in_geometry) then 0
        else ST_NPoints(in_geometry)
      end as poly_pts,
      case
        when in_geometry is null or ST_IsEmpty(in_geometry) or not ST_IsValid(in_geometry) then 0
        else (
          select coalesce(sum(ST_NumInteriorRings(t.geom)), 0)::integer
          from (
            select (ST_Dump(in_geometry)).geom as geom
          ) as t
        )
      end as poly_rings
  ),
  v1flags as (
    select
      vp.*,
      array_remove(array[
        case when not vp.type_ok then 'wrong_waterbody_type' end,
        case when not vp.has_geom_raw then 'no_geometry' end,
        case when vp.has_geom_raw and not vp.geom_valid then 'invalid_geometry' end,
        case when vp.poly_acres is not null and vp.poly_acres < 0.5 then 'below_minimum_area' end,
        case when vp.poly_components > 1 then 'multipart_geometry' end,
        case when vp.poly_rings > 0 then 'has_interior_rings' end,
        case when vp.poly_acres is not null and vp.poly_acres >= 0.5 and vp.poly_acres < 20 then 'small_waterbody' end,
        case when vp.poly_pts > 25000 then 'high_vertex_count' end
      ], null) as polygon_qa_flags
    from v1poly vp
  )
  select
    vf.type_ok,
    vf.has_geom_raw,
    vf.geom_valid,
    vf.poly_acres,
    vf.poly_components,
    vf.poly_pts,
    vf.poly_rings,
    (vf.type_ok and vf.has_geom_raw and vf.geom_valid) as has_polygon_geometry,
    case
      when not vf.type_ok then 'not_supported'
      when not vf.has_geom_raw or not vf.geom_valid then 'not_supported'
      when vf.poly_acres is not null and vf.poly_acres < 20 then 'limited'
      when vf.poly_components > 1 or vf.poly_pts > 25000 then 'limited'
      else 'supported'
    end as water_reader_support_status,
    case
      when not vf.type_ok then 'Water Reader V1 only includes lakes, ponds, and reservoirs.'
      when not vf.has_geom_raw then 'No stored polygon for this waterbody.'
      when not vf.geom_valid then 'Stored polygon failed validity checks.'
      when vf.poly_acres is not null and vf.poly_acres < 0.5 then 'Very small waterbody; Water Reader can open the polygon with limited-read caution.'
      when vf.poly_components > 1 then 'Multipart polygon; Water Reader can open the primary geometry with limited-read caution.'
      when vf.poly_pts > 25000 then 'High-complexity polygon; Water Reader can open it with limited-read caution.'
      when vf.poly_acres is not null and vf.poly_acres < 20 then 'Small waterbody; structure read may be limited.'
      else 'Valid hydrography polygon meets baseline V1 checks.'
    end as water_reader_support_reason,
    vf.polygon_qa_flags
  from v1flags vf;
$$;


ALTER FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") OWNER TO "postgres";


COMMENT ON FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") IS 'Water Reader V1 support policy: only wrong type or missing/invalid geometry is not_supported; valid polygons are supported or limited with QA flags.';



CREATE TABLE IF NOT EXISTS "public"."ai_sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "session_type" "text" NOT NULL,
    "input_payload" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "response_payload" "jsonb",
    "token_cost_usd" numeric(8,6) DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "ai_sessions_session_type_check" CHECK (("session_type" = ANY (ARRAY['recommendation'::"text", 'water_reader'::"text", 'fishing_now'::"text"])))
);


ALTER TABLE "public"."ai_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."app_feature_rate_limit_buckets" (
    "user_id" "uuid" NOT NULL,
    "feature" "text" NOT NULL,
    "window_seconds" integer NOT NULL,
    "window_start" timestamp with time zone NOT NULL,
    "request_count" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "app_feature_rate_limit_buckets_count_check" CHECK (("request_count" >= 0)),
    CONSTRAINT "app_feature_rate_limit_buckets_feature_check" CHECK ((("char_length"("feature") >= 1) AND ("char_length"("feature") <= 80))),
    CONSTRAINT "app_feature_rate_limit_buckets_window_check" CHECK ((("window_seconds" >= 1) AND ("window_seconds" <= 2678400)))
);


ALTER TABLE "public"."app_feature_rate_limit_buckets" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."catches" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "session_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "species" "text" NOT NULL,
    "length_in" numeric(6,2),
    "weight_lbs" numeric(6,3),
    "quantity" integer DEFAULT 1 NOT NULL,
    "release_status" "text" DEFAULT 'released'::"text" NOT NULL,
    "caught_at" timestamp with time zone,
    "lure_name" "text",
    "lure_color" "text",
    "lure_size" "text",
    "lure_type" "text",
    "retrieval_method" "text",
    "depth_ft" numeric(6,1),
    "photo_url" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "catches_release_status_check" CHECK (("release_status" = ANY (ARRAY['released'::"text", 'kept'::"text", 'unknown'::"text"])))
);


ALTER TABLE "public"."catches" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."environment_snapshots" (
    "snapshot_key" "text" NOT NULL,
    "latitude_bucket" numeric(6,2) NOT NULL,
    "longitude_bucket" numeric(7,2) NOT NULL,
    "units" "text" NOT NULL,
    "local_date" "date" NOT NULL,
    "payload" "jsonb" NOT NULL,
    "captured_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "has_hourly_weather" boolean DEFAULT false NOT NULL,
    "weather_available" boolean DEFAULT false NOT NULL,
    "tides_available" boolean DEFAULT false NOT NULL,
    "water_temp_available" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "environment_snapshots_units_check" CHECK (("units" = ANY (ARRAY['imperial'::"text", 'metric'::"text"])))
);


ALTER TABLE "public"."environment_snapshots" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "display_name" "text",
    "home_region" "text",
    "home_state" "text",
    "home_city" "text",
    "fishing_mode" "text" DEFAULT 'both'::"text" NOT NULL,
    "preferred_units" "text" DEFAULT 'imperial'::"text" NOT NULL,
    "target_species" "text"[] DEFAULT '{}'::"text"[] NOT NULL,
    "subscription_tier" "text" DEFAULT 'free'::"text" NOT NULL,
    "onboarding_complete" boolean DEFAULT false NOT NULL,
    "avatar_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "profiles_fishing_mode_check" CHECK (("fishing_mode" = ANY (ARRAY['conventional'::"text", 'fly'::"text", 'both'::"text"]))),
    CONSTRAINT "profiles_preferred_units_check" CHECK (("preferred_units" = ANY (ARRAY['imperial'::"text", 'metric'::"text"]))),
    CONSTRAINT "profiles_subscription_tier_check" CHECK (("subscription_tier" = ANY (ARRAY['free'::"text", 'angler'::"text", 'master_angler'::"text"])))
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recommender_daily_sessions" (
    "user_id" "uuid" NOT NULL,
    "local_date" "date" NOT NULL,
    "lat_key" "text" NOT NULL,
    "lon_key" "text" NOT NULL,
    "state_code" "text" NOT NULL,
    "region_key" "text" NOT NULL,
    "species" "text" NOT NULL,
    "water_type" "text" NOT NULL,
    "water_clarity" "text" NOT NULL,
    "engine_version" "text" NOT NULL,
    "active_variant" "text" NOT NULL,
    "refreshes_used" integer DEFAULT 0 NOT NULL,
    "variant_a_response" "jsonb" NOT NULL,
    "variant_b_response" "jsonb",
    "cache_expires_at" timestamp with time zone NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "recommendation_goal" "text" DEFAULT 'all_purpose'::"text" NOT NULL,
    CONSTRAINT "recommender_daily_sessions_active_variant_check" CHECK (("active_variant" = ANY (ARRAY['A'::"text", 'B'::"text"]))),
    CONSTRAINT "recommender_daily_sessions_recommendation_goal_check" CHECK (("recommendation_goal" = ANY (ARRAY['all_purpose'::"text", 'big_fish'::"text"]))),
    CONSTRAINT "recommender_daily_sessions_refreshes_used_check" CHECK ((("refreshes_used" >= 0) AND ("refreshes_used" <= 1)))
);


ALTER TABLE "public"."recommender_daily_sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."recommender_recent_history" (
    "user_id" "uuid" NOT NULL,
    "local_date" "date" NOT NULL,
    "species" "text" NOT NULL,
    "region_key" "text" NOT NULL,
    "water_type" "text" NOT NULL,
    "gear_mode" "text" NOT NULL,
    "archetype_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "recommender_recent_history_gear_mode_check" CHECK (("gear_mode" = ANY (ARRAY['lure'::"text", 'fly'::"text"])))
);


ALTER TABLE "public"."recommender_recent_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."sessions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "date" "date" NOT NULL,
    "start_time" timestamp with time zone,
    "end_time" timestamp with time zone,
    "location" "extensions"."geography"(Point,4326),
    "region_name" "text",
    "body_of_water" "text",
    "water_type" "text",
    "body_of_water_type" "text",
    "privacy_level" "text" DEFAULT 'regional'::"text" NOT NULL,
    "air_temp_f" numeric(5,1),
    "water_temp_f" numeric(5,1),
    "wind_speed_mph" numeric(5,1),
    "wind_direction" "text",
    "barometric_pressure" numeric(6,2),
    "cloud_cover_pct" integer,
    "precipitation" "text",
    "tide_phase" "text",
    "tide_time" timestamp with time zone,
    "moon_phase" "text",
    "solunar_period" "text",
    "water_clarity" "text",
    "bottom_composition" "text",
    "ai_session_id" "uuid",
    "shared_to_feed" boolean DEFAULT false NOT NULL,
    "notes" "text",
    "voice_transcript" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "sessions_body_of_water_type_check" CHECK (("body_of_water_type" = ANY (ARRAY['river'::"text", 'lake'::"text", 'pond'::"text", 'surf_beach'::"text", 'inshore_flats'::"text", 'offshore'::"text", 'creek'::"text", 'reservoir'::"text", 'other'::"text"]))),
    CONSTRAINT "sessions_cloud_cover_pct_check" CHECK ((("cloud_cover_pct" >= 0) AND ("cloud_cover_pct" <= 100))),
    CONSTRAINT "sessions_privacy_level_check" CHECK (("privacy_level" = ANY (ARRAY['exact'::"text", 'regional'::"text", 'hidden'::"text"]))),
    CONSTRAINT "sessions_water_clarity_check" CHECK (("water_clarity" = ANY (ARRAY['clear'::"text", 'stained'::"text", 'murky'::"text", 'muddy'::"text"]))),
    CONSTRAINT "sessions_water_type_check" CHECK (("water_type" = ANY (ARRAY['freshwater'::"text", 'saltwater'::"text", 'brackish'::"text"])))
);


ALTER TABLE "public"."sessions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."source_registry" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "provider_key" "text" NOT NULL,
    "provider_name" "text" NOT NULL,
    "state_code" "text",
    "source_type" "text" NOT NULL,
    "source_format" "text" NOT NULL,
    "review_status" "text" DEFAULT 'unreviewed'::"text" NOT NULL,
    "can_fetch" boolean DEFAULT false NOT NULL,
    "can_store_original" boolean DEFAULT false NOT NULL,
    "can_store_normalized" boolean DEFAULT false NOT NULL,
    "can_store_derived_features" boolean DEFAULT false NOT NULL,
    "can_cache_rendered_output" boolean DEFAULT false NOT NULL,
    "attribution_required" boolean DEFAULT false NOT NULL,
    "attribution_text" "text",
    "license_url" "text",
    "provider_health_check_url" "text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "source_registry_review_status_check" CHECK (("review_status" = ANY (ARRAY['unreviewed'::"text", 'allowed'::"text", 'restricted'::"text", 'blocked'::"text"]))),
    CONSTRAINT "source_registry_source_format_check" CHECK (("source_format" = ANY (ARRAY['arcgis_feature_server'::"text", 'arcgis_image_server'::"text", 'geojson'::"text", 'pdf'::"text", 'image'::"text", 'html'::"text"]))),
    CONSTRAINT "source_registry_source_type_check" CHECK (("source_type" = ANY (ARRAY['national_hydrography'::"text", 'aerial_imagery'::"text", 'bathymetry_vector'::"text", 'bathymetry_dem'::"text", 'bathymetry_pdf'::"text", 'bathymetry_image'::"text"])))
);


ALTER TABLE "public"."source_registry" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."usage_tracking" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "billing_period" "text" NOT NULL,
    "total_cost_usd" numeric(10,6) DEFAULT 0 NOT NULL,
    "call_count" integer DEFAULT 0 NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."usage_tracking" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."water_reader_aerial_provider_policies" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "source_id" "uuid" NOT NULL,
    "policy_key" "text" NOT NULL,
    "display_name" "text" NOT NULL,
    "is_enabled" boolean DEFAULT false NOT NULL,
    "approval_status" "text" DEFAULT 'pending_review'::"text" NOT NULL,
    "provider_health_status" "text" DEFAULT 'unvalidated'::"text" NOT NULL,
    "provider_health_method" "text" DEFAULT 'head'::"text" NOT NULL,
    "provider_health_target_url" "text",
    "provider_health_checked_at" timestamp with time zone,
    "provider_health_http_status" integer,
    "provider_health_error" "text",
    "coverage" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "water_reader_aerial_provider_polic_provider_health_method_check" CHECK (("provider_health_method" = ANY (ARRAY['head'::"text", 'get'::"text"]))),
    CONSTRAINT "water_reader_aerial_provider_polic_provider_health_status_check" CHECK (("provider_health_status" = ANY (ARRAY['unvalidated'::"text", 'reachable'::"text", 'unreachable'::"text", 'unsupported'::"text", 'blocked'::"text"]))),
    CONSTRAINT "water_reader_aerial_provider_policies_approval_status_check" CHECK (("approval_status" = ANY (ARRAY['pending_review'::"text", 'approved'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."water_reader_aerial_provider_policies" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."water_reader_engine_read_cache" (
    "lake_id" "uuid" NOT NULL,
    "season_context_key" "text" NOT NULL,
    "map_width" integer NOT NULL,
    "engine_version" "text" NOT NULL,
    "read_response" "jsonb" NOT NULL,
    "generated_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "source_updated_at" timestamp with time zone,
    "timings" "jsonb",
    "qa_flags" "text"[] DEFAULT '{}'::"text"[] NOT NULL
);


ALTER TABLE "public"."water_reader_engine_read_cache" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."water_reader_user_active_generation_requests" (
    "user_id" "uuid" NOT NULL,
    "lake_id" "uuid" NOT NULL,
    "season_context_key" "text" NOT NULL,
    "map_width" integer NOT NULL,
    "engine_version" "text" NOT NULL,
    "generation_job_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."water_reader_user_active_generation_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."water_reader_user_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "lake_id" "uuid" NOT NULL,
    "season_context_key" "text" NOT NULL,
    "map_width" integer NOT NULL,
    "engine_version" "text" NOT NULL,
    "generation_job_id" "uuid",
    "status" "text" DEFAULT 'preparing'::"text" NOT NULL,
    "is_pinned" boolean DEFAULT false NOT NULL,
    "first_requested_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "last_viewed_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "water_reader_user_history_status_check" CHECK (("status" = ANY (ARRAY['preparing'::"text", 'ready'::"text", 'failed'::"text"])))
);


ALTER TABLE "public"."water_reader_user_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waterbody_aliases" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "waterbody_id" "uuid" NOT NULL,
    "alias_name" "text" NOT NULL,
    "normalized_alias_name" "text" GENERATED ALWAYS AS ("public"."normalize_waterbody_name"("alias_name")) STORED,
    "alias_source" "text" DEFAULT 'manual'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."waterbody_aliases" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waterbody_index" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "external_source" "text" NOT NULL,
    "external_id" "text",
    "canonical_name" "text" NOT NULL,
    "normalized_name" "text" GENERATED ALWAYS AS ("public"."normalize_waterbody_name"("canonical_name")) STORED,
    "state_code" "text" NOT NULL,
    "county_name" "text",
    "waterbody_type" "text" NOT NULL,
    "is_named" boolean DEFAULT true NOT NULL,
    "is_searchable" boolean DEFAULT true NOT NULL,
    "region_key" "text",
    "centroid" "extensions"."geometry"(Point,4326) NOT NULL,
    "geometry" "extensions"."geometry"(MultiPolygon,4326) NOT NULL,
    "surface_area_acres" numeric,
    "search_priority" integer DEFAULT 1000 NOT NULL,
    "source_summary" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "waterbody_index_state_code_check" CHECK (("state_code" ~ '^[A-Z]{2}$'::"text")),
    CONSTRAINT "waterbody_index_waterbody_type_check" CHECK (("waterbody_type" = ANY (ARRAY['lake'::"text", 'pond'::"text", 'reservoir'::"text", 'river'::"text", 'stream'::"text", 'canal'::"text"])))
);


ALTER TABLE "public"."waterbody_index" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waterbody_source_links" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "waterbody_id" "uuid" NOT NULL,
    "source_id" "uuid" NOT NULL,
    "source_mode" "text" NOT NULL,
    "depth_source_kind" "text" DEFAULT 'none'::"text" NOT NULL,
    "approval_status" "text" DEFAULT 'pending_review'::"text" NOT NULL,
    "coverage_status" "text" DEFAULT 'available'::"text" NOT NULL,
    "source_path" "text" NOT NULL,
    "source_path_type" "text" DEFAULT 'service_root'::"text" NOT NULL,
    "fetch_validation_status" "text" DEFAULT 'unvalidated'::"text" NOT NULL,
    "fetch_validation_method" "text" DEFAULT 'head'::"text" NOT NULL,
    "source_path_validation_target_url" "text",
    "fetch_validation_checked_at" timestamp with time zone,
    "fetch_validation_http_status" integer,
    "fetch_validation_error" "text",
    "lake_match_status" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "usability_status" "text" DEFAULT 'unknown'::"text" NOT NULL,
    "metadata" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    "provider_health_status" "text" DEFAULT 'unvalidated'::"text" NOT NULL,
    "provider_health_method" "text" DEFAULT 'head'::"text" NOT NULL,
    "provider_health_target_url" "text",
    "provider_health_checked_at" timestamp with time zone,
    "provider_health_http_status" integer,
    "provider_health_error" "text",
    CONSTRAINT "waterbody_source_links_approval_status_check" CHECK (("approval_status" = ANY (ARRAY['approved'::"text", 'pending_review'::"text", 'rejected'::"text"]))),
    CONSTRAINT "waterbody_source_links_coverage_status_check" CHECK (("coverage_status" = ANY (ARRAY['available'::"text", 'limited'::"text", 'blocked'::"text", 'unavailable'::"text"]))),
    CONSTRAINT "waterbody_source_links_depth_source_kind_check" CHECK (("depth_source_kind" = ANY (ARRAY['machine_readable'::"text", 'chart_image'::"text", 'none'::"text"]))),
    CONSTRAINT "waterbody_source_links_fetch_validation_method_check" CHECK (("fetch_validation_method" = ANY (ARRAY['head'::"text", 'get'::"text"]))),
    CONSTRAINT "waterbody_source_links_fetch_validation_status_check" CHECK (("fetch_validation_status" = ANY (ARRAY['unvalidated'::"text", 'reachable'::"text", 'unreachable'::"text", 'unsupported'::"text", 'blocked'::"text"]))),
    CONSTRAINT "waterbody_source_links_lake_match_status_check" CHECK (("lake_match_status" = ANY (ARRAY['unknown'::"text", 'matched'::"text", 'ambiguous'::"text", 'mismatched'::"text"]))),
    CONSTRAINT "waterbody_source_links_provider_health_method_check" CHECK (("provider_health_method" = ANY (ARRAY['head'::"text", 'get'::"text"]))),
    CONSTRAINT "waterbody_source_links_provider_health_status_check" CHECK (("provider_health_status" = ANY (ARRAY['unvalidated'::"text", 'reachable'::"text", 'unreachable'::"text", 'unsupported'::"text", 'blocked'::"text"]))),
    CONSTRAINT "waterbody_source_links_source_mode_check" CHECK (("source_mode" = ANY (ARRAY['aerial'::"text", 'depth'::"text"]))),
    CONSTRAINT "waterbody_source_links_source_path_type_check" CHECK (("source_path_type" = ANY (ARRAY['service_root'::"text", 'feature_query'::"text", 'download'::"text", 'document'::"text", 'image'::"text"]))),
    CONSTRAINT "waterbody_source_links_usability_status_check" CHECK (("usability_status" = ANY (ARRAY['unknown'::"text", 'usable'::"text", 'needs_review'::"text", 'not_usable'::"text"])))
);


ALTER TABLE "public"."waterbody_source_links" OWNER TO "postgres";


CREATE OR REPLACE VIEW "public"."waterbody_availability_snapshot" WITH ("security_invoker"='true') AS
 WITH "link_eval" AS (
         SELECT "l"."waterbody_id" AS "lake_id",
            "l"."source_mode",
            "l"."depth_source_kind",
            "l"."approval_status",
            "l"."coverage_status",
            "l"."fetch_validation_status",
            "l"."lake_match_status",
            "l"."usability_status",
            "s"."review_status",
            "s"."can_fetch",
            (("l"."approval_status" = 'approved'::"text") AND ("s"."review_status" = 'allowed'::"text") AND ("s"."can_fetch" = true) AND ("l"."fetch_validation_status" = 'reachable'::"text") AND ("l"."coverage_status" <> ALL (ARRAY['blocked'::"text", 'unavailable'::"text"]))) AS "is_fetch_ready",
            (("l"."approval_status" = 'approved'::"text") AND ("s"."review_status" = 'allowed'::"text") AND ("s"."can_fetch" = true) AND ("l"."fetch_validation_status" = 'unvalidated'::"text")) AS "is_pending",
            (("l"."approval_status" = 'approved'::"text") AND (("s"."review_status" <> 'allowed'::"text") OR ("s"."can_fetch" = false) OR ("l"."fetch_validation_status" = ANY (ARRAY['blocked'::"text", 'unreachable'::"text"])) OR ("l"."lake_match_status" = 'mismatched'::"text") OR ("l"."usability_status" = 'not_usable'::"text"))) AS "is_blocked_candidate"
           FROM ("public"."waterbody_source_links" "l"
             JOIN "public"."source_registry" "s" ON (("s"."id" = "l"."source_id")))
        ), "link_metrics" AS (
         SELECT "w"."id" AS "lake_id",
            COALESCE("bool_or"((("le"."source_mode" = 'aerial'::"text") AND "le"."is_fetch_ready" AND ("le"."usability_status" = 'usable'::"text"))), false) AS "aerial_from_links",
            COALESCE("bool_or"((("le"."source_mode" = 'depth'::"text") AND ("le"."depth_source_kind" = 'machine_readable'::"text") AND "le"."is_fetch_ready" AND ("le"."lake_match_status" = 'matched'::"text") AND ("le"."usability_status" = 'usable'::"text"))), false) AS "depth_machine_readable_available",
            COALESCE("bool_or"((("le"."source_mode" = 'depth'::"text") AND ("le"."depth_source_kind" = 'chart_image'::"text") AND "le"."is_fetch_ready" AND ("le"."lake_match_status" = 'matched'::"text") AND ("le"."usability_status" = 'usable'::"text"))), false) AS "depth_chart_image_available",
            COALESCE("bool_or"("le"."is_pending"), false) AS "has_pending",
            COALESCE("bool_or"("le"."is_blocked_candidate"), false) AS "has_blocked_candidate",
            COALESCE("bool_or"((("le"."source_mode" = 'depth'::"text") AND "le"."is_fetch_ready" AND (("le"."lake_match_status" <> 'matched'::"text") OR ("le"."usability_status" <> 'usable'::"text")))), false) AS "has_depth_pending_match_or_usability"
           FROM ("public"."waterbody_index" "w"
             LEFT JOIN "link_eval" "le" ON (("le"."lake_id" = "w"."id")))
          GROUP BY "w"."id"
        ), "policy_metrics" AS (
         SELECT "w"."id" AS "lake_id",
            (EXISTS ( SELECT 1
                   FROM ("public"."water_reader_aerial_provider_policies" "p"
                     JOIN "public"."source_registry" "s" ON (("s"."id" = "p"."source_id")))
                  WHERE (("p"."is_enabled" = true) AND ("p"."approval_status" = 'approved'::"text") AND ("s"."review_status" = 'allowed'::"text") AND ("s"."can_fetch" = true) AND ("s"."source_type" = 'aerial_imagery'::"text") AND ("p"."provider_health_status" = 'reachable'::"text") AND (NOT (COALESCE(("p"."coverage" -> 'exclude_state_codes'::"text"), '[]'::"jsonb") @> "to_jsonb"("w"."state_code")))))) AS "aerial_from_policy"
           FROM "public"."waterbody_index" "w"
        ), "metrics" AS (
         SELECT "lm"."lake_id",
            ("lm"."aerial_from_links" OR "pm"."aerial_from_policy") AS "aerial_available",
            "lm"."depth_machine_readable_available",
            "lm"."depth_chart_image_available",
            "lm"."has_pending",
            "lm"."has_blocked_candidate",
            "lm"."has_depth_pending_match_or_usability"
           FROM ("link_metrics" "lm"
             JOIN "policy_metrics" "pm" ON (("pm"."lake_id" = "lm"."lake_id")))
        )
 SELECT "lake_id",
    "aerial_available",
    "depth_machine_readable_available",
    "depth_chart_image_available",
        CASE
            WHEN ("aerial_available" AND "depth_machine_readable_available") THEN 'full_depth_aerial'::"text"
            WHEN "depth_machine_readable_available" THEN 'depth_only'::"text"
            WHEN "depth_chart_image_available" THEN 'chart_aligned_depth'::"text"
            WHEN "aerial_available" THEN 'aerial_only'::"text"
            ELSE 'polygon_only'::"text"
        END AS "data_tier",
        CASE
            WHEN ("depth_machine_readable_available" OR "depth_chart_image_available") THEN 'depth'::"text"
            WHEN "aerial_available" THEN 'aerial'::"text"
            ELSE NULL::"text"
        END AS "best_available_mode",
        CASE
            WHEN ("depth_machine_readable_available" OR "depth_chart_image_available") THEN 'usable'::"text"
            WHEN "has_depth_pending_match_or_usability" THEN 'needs_review'::"text"
            ELSE 'unavailable'::"text"
        END AS "depth_usability_status",
        CASE
            WHEN ("aerial_available" OR "depth_machine_readable_available" OR "depth_chart_image_available") THEN 'ready'::"text"
            WHEN ("has_pending" OR "has_depth_pending_match_or_usability") THEN 'partial'::"text"
            WHEN "has_blocked_candidate" THEN 'blocked'::"text"
            ELSE 'limited'::"text"
        END AS "source_status",
        CASE
            WHEN ("aerial_available" AND ("depth_machine_readable_available" OR "depth_chart_image_available")) THEN 'both_available'::"text"
            WHEN ("depth_machine_readable_available" OR "depth_chart_image_available") THEN 'depth_available'::"text"
            WHEN "aerial_available" THEN 'aerial_available'::"text"
            WHEN "has_blocked_candidate" THEN 'blocked'::"text"
            ELSE 'limited'::"text"
        END AS "availability",
        CASE
            WHEN "depth_machine_readable_available" THEN 'high'::"text"
            WHEN ("aerial_available" OR "depth_chart_image_available") THEN 'medium'::"text"
            ELSE 'low'::"text"
        END AS "confidence"
   FROM "metrics" "m";


ALTER VIEW "public"."waterbody_availability_snapshot" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waterbody_search_miss_events" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "query_text" "text" NOT NULL,
    "normalized_query" "text" NOT NULL,
    "state_filter" "text",
    "result_count" integer DEFAULT 0 NOT NULL,
    "fallback_attempted" boolean DEFAULT false NOT NULL,
    "fallback_indexed_count" integer DEFAULT 0 NOT NULL,
    "top_result_name" "text",
    "top_result_state" "text",
    "top_result_county" "text",
    "user_id" "uuid",
    "request_context" "jsonb" DEFAULT '{}'::"jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL
);


ALTER TABLE "public"."waterbody_search_miss_events" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."waterbody_shared_states" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "waterbody_id" "uuid" NOT NULL,
    "search_state_code" "text" NOT NULL,
    "display_state_code" "text" NOT NULL,
    "reason" "text" DEFAULT 'shared_border_waterbody'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "timezone"('utc'::"text", "now"()) NOT NULL,
    CONSTRAINT "waterbody_shared_states_display_state_code_check" CHECK (("display_state_code" ~ '^[A-Z]{2}$'::"text")),
    CONSTRAINT "waterbody_shared_states_search_state_code_check" CHECK (("search_state_code" ~ '^[A-Z]{2}$'::"text"))
);


ALTER TABLE "public"."waterbody_shared_states" OWNER TO "postgres";


ALTER TABLE ONLY "public"."ai_sessions"
    ADD CONSTRAINT "ai_sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."app_feature_rate_limit_buckets"
    ADD CONSTRAINT "app_feature_rate_limit_buckets_pkey" PRIMARY KEY ("user_id", "feature", "window_seconds", "window_start");



ALTER TABLE ONLY "public"."catches"
    ADD CONSTRAINT "catches_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."environment_snapshots"
    ADD CONSTRAINT "environment_snapshots_pkey" PRIMARY KEY ("snapshot_key");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."recommender_daily_sessions"
    ADD CONSTRAINT "recommender_daily_sessions_pkey" PRIMARY KEY ("user_id", "local_date", "lat_key", "lon_key", "state_code", "species", "region_key", "water_type", "water_clarity", "recommendation_goal", "engine_version");



ALTER TABLE ONLY "public"."recommender_recent_history"
    ADD CONSTRAINT "recommender_recent_history_pkey" PRIMARY KEY ("user_id", "local_date", "species", "region_key", "water_type", "gear_mode", "archetype_id");



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."source_registry"
    ADD CONSTRAINT "source_registry_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."source_registry"
    ADD CONSTRAINT "source_registry_provider_key_key" UNIQUE ("provider_key");



ALTER TABLE ONLY "public"."usage_tracking"
    ADD CONSTRAINT "usage_tracking_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."usage_tracking"
    ADD CONSTRAINT "usage_tracking_user_id_billing_period_key" UNIQUE ("user_id", "billing_period");



ALTER TABLE ONLY "public"."water_reader_aerial_provider_policies"
    ADD CONSTRAINT "water_reader_aerial_provider_policies_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."water_reader_aerial_provider_policies"
    ADD CONSTRAINT "water_reader_aerial_provider_policies_policy_key_key" UNIQUE ("policy_key");



ALTER TABLE ONLY "public"."water_reader_engine_read_cache"
    ADD CONSTRAINT "water_reader_engine_read_cache_pkey" PRIMARY KEY ("lake_id", "season_context_key", "map_width", "engine_version");



ALTER TABLE ONLY "public"."water_reader_generation_jobs"
    ADD CONSTRAINT "water_reader_generation_jobs_cache_key_unique" UNIQUE ("lake_id", "season_context_key", "map_width", "engine_version");



ALTER TABLE ONLY "public"."water_reader_generation_jobs"
    ADD CONSTRAINT "water_reader_generation_jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."water_reader_user_active_generation_requests"
    ADD CONSTRAINT "water_reader_user_active_generation_requests_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."water_reader_user_history"
    ADD CONSTRAINT "water_reader_user_history_cache_key_unique" UNIQUE ("user_id", "lake_id", "season_context_key", "map_width", "engine_version");



ALTER TABLE ONLY "public"."water_reader_user_history"
    ADD CONSTRAINT "water_reader_user_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_aliases"
    ADD CONSTRAINT "waterbody_aliases_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_aliases"
    ADD CONSTRAINT "waterbody_aliases_waterbody_id_normalized_alias_name_key" UNIQUE ("waterbody_id", "normalized_alias_name");



ALTER TABLE ONLY "public"."waterbody_index"
    ADD CONSTRAINT "waterbody_index_external_source_external_id_key" UNIQUE ("external_source", "external_id");



ALTER TABLE ONLY "public"."waterbody_index"
    ADD CONSTRAINT "waterbody_index_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_search_miss_events"
    ADD CONSTRAINT "waterbody_search_miss_events_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_shared_states"
    ADD CONSTRAINT "waterbody_shared_states_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_shared_states"
    ADD CONSTRAINT "waterbody_shared_states_waterbody_id_search_state_code_key" UNIQUE ("waterbody_id", "search_state_code");



ALTER TABLE ONLY "public"."waterbody_source_links"
    ADD CONSTRAINT "waterbody_source_links_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."waterbody_source_links"
    ADD CONSTRAINT "waterbody_source_links_waterbody_id_source_id_source_mode_s_key" UNIQUE ("waterbody_id", "source_id", "source_mode", "source_path");



CREATE INDEX "ai_sessions_created_at_idx" ON "public"."ai_sessions" USING "btree" ("created_at" DESC);



CREATE INDEX "ai_sessions_type_idx" ON "public"."ai_sessions" USING "btree" ("session_type");



CREATE INDEX "ai_sessions_user_id_idx" ON "public"."ai_sessions" USING "btree" ("user_id");



CREATE INDEX "app_feature_rate_limit_buckets_window_start_idx" ON "public"."app_feature_rate_limit_buckets" USING "btree" ("window_start");



CREATE INDEX "catches_session_id_idx" ON "public"."catches" USING "btree" ("session_id");



CREATE INDEX "catches_species_idx" ON "public"."catches" USING "btree" ("species");



CREATE INDEX "catches_user_id_idx" ON "public"."catches" USING "btree" ("user_id");



CREATE INDEX "environment_snapshots_geo_idx" ON "public"."environment_snapshots" USING "btree" ("latitude_bucket", "longitude_bucket", "local_date");



CREATE INDEX "environment_snapshots_local_date_idx" ON "public"."environment_snapshots" USING "btree" ("local_date", "captured_at" DESC);



CREATE INDEX "recommender_daily_sessions_user_lookup_idx" ON "public"."recommender_daily_sessions" USING "btree" ("user_id", "local_date" DESC, "species", "region_key", "water_type");



CREATE INDEX "recommender_recent_history_lookup_idx" ON "public"."recommender_recent_history" USING "btree" ("user_id", "species", "region_key", "water_type", "local_date" DESC);



CREATE INDEX "sessions_date_idx" ON "public"."sessions" USING "btree" ("date" DESC);



CREATE INDEX "sessions_location_idx" ON "public"."sessions" USING "gist" ("location");



CREATE INDEX "sessions_user_id_idx" ON "public"."sessions" USING "btree" ("user_id");



CREATE INDEX "usage_tracking_user_billing_idx" ON "public"."usage_tracking" USING "btree" ("user_id", "billing_period");



CREATE INDEX "water_reader_aerial_provider_policies_enabled_idx" ON "public"."water_reader_aerial_provider_policies" USING "btree" ("is_enabled", "approval_status") WHERE ("is_enabled" = true);



CREATE INDEX "water_reader_aerial_provider_policies_source_idx" ON "public"."water_reader_aerial_provider_policies" USING "btree" ("source_id");



CREATE INDEX "water_reader_engine_read_cache_generated_at_idx" ON "public"."water_reader_engine_read_cache" USING "btree" ("generated_at" DESC);



CREATE INDEX "water_reader_engine_read_cache_lookup_idx" ON "public"."water_reader_engine_read_cache" USING "btree" ("lake_id", "season_context_key", "map_width", "engine_version");



CREATE INDEX "water_reader_generation_jobs_cache_key_idx" ON "public"."water_reader_generation_jobs" USING "btree" ("lake_id", "season_context_key", "map_width", "engine_version");



CREATE INDEX "water_reader_generation_jobs_status_next_attempt_idx" ON "public"."water_reader_generation_jobs" USING "btree" ("status", "next_attempt_at", "priority" DESC, "created_at");



CREATE INDEX "water_reader_user_active_generation_requests_cache_key_idx" ON "public"."water_reader_user_active_generation_requests" USING "btree" ("lake_id", "season_context_key", "map_width", "engine_version");



CREATE INDEX "water_reader_user_active_generation_requests_job_idx" ON "public"."water_reader_user_active_generation_requests" USING "btree" ("generation_job_id") WHERE ("generation_job_id" IS NOT NULL);



CREATE INDEX "water_reader_user_history_cache_key_idx" ON "public"."water_reader_user_history" USING "btree" ("lake_id", "season_context_key", "map_width", "engine_version");



CREATE INDEX "water_reader_user_history_job_idx" ON "public"."water_reader_user_history" USING "btree" ("generation_job_id") WHERE ("generation_job_id" IS NOT NULL);



CREATE INDEX "water_reader_user_history_user_recent_idx" ON "public"."water_reader_user_history" USING "btree" ("user_id", "last_viewed_at" DESC);



CREATE INDEX "waterbody_aliases_normalized_name_trgm_idx" ON "public"."waterbody_aliases" USING "gin" ("normalized_alias_name" "public"."gin_trgm_ops");



CREATE INDEX "waterbody_index_browse_state_type_idx" ON "public"."waterbody_index" USING "btree" ("state_code", "waterbody_type", "search_priority", "surface_area_acres" DESC, "canonical_name", "county_name") WHERE (("is_named" = true) AND ("is_searchable" = true) AND ("county_name" IS NOT NULL) AND ("waterbody_type" = ANY (ARRAY['lake'::"text", 'pond'::"text", 'reservoir'::"text"])));



CREATE INDEX "waterbody_index_centroid_idx" ON "public"."waterbody_index" USING "gist" ("centroid");



CREATE INDEX "waterbody_index_geometry_idx" ON "public"."waterbody_index" USING "gist" ("geometry");



CREATE INDEX "waterbody_index_normalized_county_name_trgm_idx" ON "public"."waterbody_index" USING "gin" ("public"."normalize_waterbody_name"(COALESCE("county_name", ''::"text")) "public"."gin_trgm_ops");



CREATE INDEX "waterbody_index_normalized_name_trgm_idx" ON "public"."waterbody_index" USING "gin" ("normalized_name" "public"."gin_trgm_ops");



CREATE INDEX "waterbody_index_searchable_idx" ON "public"."waterbody_index" USING "btree" ("is_searchable", "is_named", "search_priority");



CREATE INDEX "waterbody_index_searchable_name_trgm_partial" ON "public"."waterbody_index" USING "gin" ("normalized_name" "public"."gin_trgm_ops") WHERE (("is_named" = true) AND ("is_searchable" = true) AND ("waterbody_type" = ANY (ARRAY['lake'::"text", 'pond'::"text", 'reservoir'::"text"])));



CREATE INDEX "waterbody_index_searchable_state_name_prefix" ON "public"."waterbody_index" USING "btree" ("state_code", "normalized_name" "text_pattern_ops", "search_priority", "canonical_name") WHERE (("is_named" = true) AND ("is_searchable" = true) AND ("waterbody_type" = ANY (ARRAY['lake'::"text", 'pond'::"text", 'reservoir'::"text"])));



CREATE INDEX "waterbody_index_type_state_idx" ON "public"."waterbody_index" USING "btree" ("waterbody_type", "state_code", "county_name");



CREATE INDEX "waterbody_search_miss_events_created_at_idx" ON "public"."waterbody_search_miss_events" USING "btree" ("created_at" DESC);



CREATE INDEX "waterbody_search_miss_events_state_query_idx" ON "public"."waterbody_search_miss_events" USING "btree" ("state_filter", "normalized_query", "created_at" DESC);



CREATE INDEX "waterbody_shared_states_lookup_idx" ON "public"."waterbody_shared_states" USING "btree" ("search_state_code", "waterbody_id");



CREATE INDEX "waterbody_source_links_match_usability_idx" ON "public"."waterbody_source_links" USING "btree" ("lake_match_status", "usability_status", "source_mode");



CREATE INDEX "waterbody_source_links_provider_health_idx" ON "public"."waterbody_source_links" USING "btree" ("provider_health_status", "source_mode");



CREATE INDEX "waterbody_source_links_validation_idx" ON "public"."waterbody_source_links" USING "btree" ("fetch_validation_status", "approval_status");



CREATE INDEX "waterbody_source_links_waterbody_idx" ON "public"."waterbody_source_links" USING "btree" ("waterbody_id", "source_mode");



CREATE OR REPLACE TRIGGER "catches_updated_at" BEFORE UPDATE ON "public"."catches" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "environment_snapshots_set_updated_at" BEFORE UPDATE ON "public"."environment_snapshots" FOR EACH ROW EXECUTE FUNCTION "public"."set_environment_snapshots_updated_at"();



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "sessions_updated_at" BEFORE UPDATE ON "public"."sessions" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "source_registry_set_updated_at" BEFORE UPDATE ON "public"."source_registry" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "usage_tracking_updated_at" BEFORE UPDATE ON "public"."usage_tracking" FOR EACH ROW EXECUTE FUNCTION "public"."handle_updated_at"();



CREATE OR REPLACE TRIGGER "water_reader_aerial_provider_policies_set_updated_at" BEFORE UPDATE ON "public"."water_reader_aerial_provider_policies" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "water_reader_generation_jobs_set_updated_at" BEFORE UPDATE ON "public"."water_reader_generation_jobs" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "water_reader_user_active_generation_requests_set_updated_at" BEFORE UPDATE ON "public"."water_reader_user_active_generation_requests" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "water_reader_user_history_set_updated_at" BEFORE UPDATE ON "public"."water_reader_user_history" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "waterbody_index_set_updated_at" BEFORE UPDATE ON "public"."waterbody_index" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



CREATE OR REPLACE TRIGGER "waterbody_source_links_set_updated_at" BEFORE UPDATE ON "public"."waterbody_source_links" FOR EACH ROW EXECUTE FUNCTION "public"."set_generic_updated_at"();



ALTER TABLE ONLY "public"."ai_sessions"
    ADD CONSTRAINT "ai_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."catches"
    ADD CONSTRAINT "catches_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."catches"
    ADD CONSTRAINT "catches_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recommender_daily_sessions"
    ADD CONSTRAINT "recommender_daily_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."recommender_recent_history"
    ADD CONSTRAINT "recommender_recent_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_ai_session_fk" FOREIGN KEY ("ai_session_id") REFERENCES "public"."ai_sessions"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."sessions"
    ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."usage_tracking"
    ADD CONSTRAINT "usage_tracking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."water_reader_aerial_provider_policies"
    ADD CONSTRAINT "water_reader_aerial_provider_policies_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."source_registry"("id") ON DELETE RESTRICT;



ALTER TABLE ONLY "public"."water_reader_user_active_generation_requests"
    ADD CONSTRAINT "water_reader_user_active_generation_requ_generation_job_id_fkey" FOREIGN KEY ("generation_job_id") REFERENCES "public"."water_reader_generation_jobs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."water_reader_user_history"
    ADD CONSTRAINT "water_reader_user_history_generation_job_id_fkey" FOREIGN KEY ("generation_job_id") REFERENCES "public"."water_reader_generation_jobs"("id");



ALTER TABLE ONLY "public"."waterbody_aliases"
    ADD CONSTRAINT "waterbody_aliases_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "public"."waterbody_index"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waterbody_shared_states"
    ADD CONSTRAINT "waterbody_shared_states_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "public"."waterbody_index"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waterbody_source_links"
    ADD CONSTRAINT "waterbody_source_links_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "public"."source_registry"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."waterbody_source_links"
    ADD CONSTRAINT "waterbody_source_links_waterbody_id_fkey" FOREIGN KEY ("waterbody_id") REFERENCES "public"."waterbody_index"("id") ON DELETE CASCADE;



ALTER TABLE "public"."ai_sessions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "ai_sessions_insert_own" ON "public"."ai_sessions" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "ai_sessions_select_own" ON "public"."ai_sessions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."app_feature_rate_limit_buckets" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "app_feature_rate_limit_buckets_service_role_all" ON "public"."app_feature_rate_limit_buckets" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."catches" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "catches_delete_own" ON "public"."catches" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "catches_insert_own" ON "public"."catches" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "catches_select_own" ON "public"."catches" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "catches_update_own" ON "public"."catches" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."environment_snapshots" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_delete_own" ON "public"."profiles" FOR DELETE TO "authenticated" USING (("id" = "auth"."uid"()));



CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT TO "authenticated" WITH CHECK (("id" = "auth"."uid"()));



CREATE POLICY "profiles_select_own" ON "public"."profiles" FOR SELECT TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "id"));



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE TO "authenticated" USING (("id" = "auth"."uid"())) WITH CHECK (("id" = "auth"."uid"()));



ALTER TABLE "public"."recommender_daily_sessions" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."recommender_recent_history" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."sessions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "sessions_delete_own" ON "public"."sessions" FOR DELETE TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "sessions_insert_own" ON "public"."sessions" FOR INSERT TO "authenticated" WITH CHECK (("user_id" = "auth"."uid"()));



CREATE POLICY "sessions_select_own" ON "public"."sessions" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



CREATE POLICY "sessions_update_own" ON "public"."sessions" FOR UPDATE TO "authenticated" USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."source_registry" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."usage_tracking" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "usage_tracking_select_own" ON "public"."usage_tracking" FOR SELECT TO "authenticated" USING (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."water_reader_aerial_provider_policies" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."water_reader_engine_read_cache" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "water_reader_engine_read_cache_service_role_all" ON "public"."water_reader_engine_read_cache" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."water_reader_generation_jobs" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "water_reader_generation_jobs_service_role_all" ON "public"."water_reader_generation_jobs" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."water_reader_user_active_generation_requests" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "water_reader_user_active_generation_requests_service_role_all" ON "public"."water_reader_user_active_generation_requests" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."water_reader_user_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "water_reader_user_history_service_role_all" ON "public"."water_reader_user_history" TO "service_role" USING (true) WITH CHECK (true);



ALTER TABLE "public"."waterbody_aliases" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waterbody_index" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waterbody_search_miss_events" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waterbody_shared_states" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."waterbody_source_links" ENABLE ROW LEVEL SECURITY;


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



REVOKE ALL ON FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer, "in_max_attempts" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer, "in_max_attempts" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer, "in_max_attempts" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."begin_water_reader_generation_request"("in_user_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_priority" integer, "in_max_attempts" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."browse_waterbodies_by_state"("state_filter" "text", "waterbody_type_filter" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."browse_waterbodies_by_state"("state_filter" "text", "waterbody_type_filter" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."browse_waterbodies_by_state"("state_filter" "text", "waterbody_type_filter" "text", "result_limit" integer) TO "service_role";



GRANT ALL ON TABLE "public"."water_reader_generation_jobs" TO "anon";
GRANT ALL ON TABLE "public"."water_reader_generation_jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."water_reader_generation_jobs" TO "service_role";



REVOKE ALL ON FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."cancel_water_reader_generation_job"("in_job_id" "uuid", "in_error" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval) TO "anon";
GRANT ALL ON FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval) TO "authenticated";
GRANT ALL ON FUNCTION "public"."claim_water_reader_generation_job"("in_worker_id" "text", "in_lock_timeout" interval) TO "service_role";



REVOKE ALL ON FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid", "in_generation_job_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid", "in_generation_job_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid", "in_generation_job_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."clear_water_reader_user_active_generation_request"("in_user_id" "uuid", "in_generation_job_id" "uuid", "in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone) TO "anon";
GRANT ALL ON FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone) TO "authenticated";
GRANT ALL ON FUNCTION "public"."consume_app_feature_rate_limit"("in_user_id" "uuid", "in_feature" "text", "in_window_seconds" integer, "in_max_requests" integer, "in_now" timestamp with time zone) TO "service_role";



REVOKE ALL ON FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid", "in_priority" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid", "in_priority" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid", "in_priority" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."ensure_water_reader_generation_job"("in_lake_id" "uuid", "in_season_context_key" "text", "in_map_width" integer, "in_engine_version" "text", "in_requested_by" "uuid", "in_priority" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_waterbody_polygon_for_reader"("in_lake_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."get_waterbody_polygon_runtime_for_reader"("in_lake_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."get_waterbody_polygon_runtime_for_reader"("in_lake_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_complete"("in_job_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."mark_water_reader_generation_job_failed"("in_job_id" "uuid", "in_error" "text", "in_retry_after_seconds" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."normalize_waterbody_name"("raw_name" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."normalize_waterbody_name"("raw_name" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."normalize_waterbody_name"("raw_name" "text") TO "service_role";



REVOKE ALL ON FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval) FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval) TO "anon";
GRANT ALL ON FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval) TO "authenticated";
GRANT ALL ON FUNCTION "public"."requeue_stale_water_reader_generation_jobs"("in_lock_timeout" interval) TO "service_role";



REVOKE ALL ON FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."requeue_water_reader_generation_job"("in_job_id" "uuid", "in_reason" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_waterbodies"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_waterbodies"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_waterbodies"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."search_waterbodies_enrich_row"("in_id" "uuid", "in_canonical_name" "text", "in_state_code" "text", "in_county_name" "text", "in_waterbody_type" "text", "in_surface_area_acres" numeric, "in_centroid" "extensions"."geometry", "in_geometry" "extensions"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."search_waterbodies_enrich_row"("in_id" "uuid", "in_canonical_name" "text", "in_state_code" "text", "in_county_name" "text", "in_waterbody_type" "text", "in_surface_area_acres" numeric, "in_centroid" "extensions"."geometry", "in_geometry" "extensions"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_waterbodies_enrich_row"("in_id" "uuid", "in_canonical_name" "text", "in_state_code" "text", "in_county_name" "text", "in_waterbody_type" "text", "in_surface_area_acres" numeric, "in_centroid" "extensions"."geometry", "in_geometry" "extensions"."geometry") TO "service_role";



GRANT ALL ON FUNCTION "public"."search_waterbodies_impl_20260427"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."search_waterbodies_impl_20260427"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."search_waterbodies_impl_20260427"("query_text" "text", "state_filter" "text", "result_limit" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."set_environment_snapshots_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_environment_snapshots_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_environment_snapshots_updated_at"() TO "service_role";



GRANT ALL ON FUNCTION "public"."set_generic_updated_at"() TO "anon";
GRANT ALL ON FUNCTION "public"."set_generic_updated_at"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."set_generic_updated_at"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") TO "anon";
GRANT ALL ON FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") TO "authenticated";
GRANT ALL ON FUNCTION "public"."water_reader_generation_error_is_retryable"("in_error" "text") TO "service_role";



GRANT ALL ON FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") TO "anon";
GRANT ALL ON FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") TO "authenticated";
GRANT ALL ON FUNCTION "public"."water_reader_polygon_support_policy"("in_waterbody_type" "text", "in_geometry" "extensions"."geometry") TO "service_role";



GRANT ALL ON TABLE "public"."ai_sessions" TO "anon";
GRANT ALL ON TABLE "public"."ai_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."ai_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."app_feature_rate_limit_buckets" TO "service_role";



GRANT ALL ON TABLE "public"."catches" TO "anon";
GRANT ALL ON TABLE "public"."catches" TO "authenticated";
GRANT ALL ON TABLE "public"."catches" TO "service_role";



GRANT ALL ON TABLE "public"."environment_snapshots" TO "anon";
GRANT ALL ON TABLE "public"."environment_snapshots" TO "authenticated";
GRANT ALL ON TABLE "public"."environment_snapshots" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."recommender_daily_sessions" TO "anon";
GRANT ALL ON TABLE "public"."recommender_daily_sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."recommender_daily_sessions" TO "service_role";



GRANT ALL ON TABLE "public"."recommender_recent_history" TO "anon";
GRANT ALL ON TABLE "public"."recommender_recent_history" TO "authenticated";
GRANT ALL ON TABLE "public"."recommender_recent_history" TO "service_role";



GRANT ALL ON TABLE "public"."sessions" TO "anon";
GRANT ALL ON TABLE "public"."sessions" TO "authenticated";
GRANT ALL ON TABLE "public"."sessions" TO "service_role";



GRANT ALL ON TABLE "public"."source_registry" TO "anon";
GRANT ALL ON TABLE "public"."source_registry" TO "authenticated";
GRANT ALL ON TABLE "public"."source_registry" TO "service_role";



GRANT ALL ON TABLE "public"."usage_tracking" TO "anon";
GRANT ALL ON TABLE "public"."usage_tracking" TO "authenticated";
GRANT ALL ON TABLE "public"."usage_tracking" TO "service_role";



GRANT ALL ON TABLE "public"."water_reader_aerial_provider_policies" TO "anon";
GRANT ALL ON TABLE "public"."water_reader_aerial_provider_policies" TO "authenticated";
GRANT ALL ON TABLE "public"."water_reader_aerial_provider_policies" TO "service_role";



GRANT ALL ON TABLE "public"."water_reader_engine_read_cache" TO "anon";
GRANT ALL ON TABLE "public"."water_reader_engine_read_cache" TO "authenticated";
GRANT ALL ON TABLE "public"."water_reader_engine_read_cache" TO "service_role";



GRANT ALL ON TABLE "public"."water_reader_user_active_generation_requests" TO "anon";
GRANT ALL ON TABLE "public"."water_reader_user_active_generation_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."water_reader_user_active_generation_requests" TO "service_role";



GRANT ALL ON TABLE "public"."water_reader_user_history" TO "anon";
GRANT ALL ON TABLE "public"."water_reader_user_history" TO "authenticated";
GRANT ALL ON TABLE "public"."water_reader_user_history" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_aliases" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_aliases" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_aliases" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_index" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_index" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_index" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_source_links" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_source_links" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_source_links" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_availability_snapshot" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_availability_snapshot" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_availability_snapshot" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_search_miss_events" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_search_miss_events" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_search_miss_events" TO "service_role";



GRANT ALL ON TABLE "public"."waterbody_shared_states" TO "anon";
GRANT ALL ON TABLE "public"."waterbody_shared_states" TO "authenticated";
GRANT ALL ON TABLE "public"."waterbody_shared_states" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";
