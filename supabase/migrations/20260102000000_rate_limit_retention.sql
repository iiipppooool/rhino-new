-- Rate limiting stores an IP address, which is personal data under UK GDPR.
-- The original table kept each row indefinitely, because the upsert only ever
-- reset the counter. That is more than the purpose needs and contradicts the
-- retention period stated in the privacy policy.
--
-- This makes the function clear out expired rows as it goes, so an IP address
-- is held only for as long as its rate-limit window is open.

create or replace function public.bump_rate_limit(
  p_bucket text,
  p_identifier text,
  p_limit integer,
  p_window interval
)
returns boolean
language plpgsql
security definer
set search_path = public, pg_catalog
as $$
declare
  v_hits integer;
begin
  -- Drop anything whose window closed. Cheap: the table stays tiny, and it
  -- means no identifier outlives the purpose it was collected for.
  delete from public.rate_limits
  where window_start < now() - greatest(p_window, interval '1 hour');

  insert into public.rate_limits as r (bucket, identifier, hits, window_start)
  values (p_bucket, p_identifier, 1, now())
  on conflict (bucket, identifier) do update
    set hits = case when r.window_start < now() - p_window then 1 else r.hits + 1 end,
        window_start = case when r.window_start < now() - p_window then now() else r.window_start end
  returning r.hits into v_hits;

  return v_hits <= p_limit;
end;
$$;

revoke execute on function public.bump_rate_limit(text, text, integer, interval) from public, anon, authenticated;

comment on table public.rate_limits is
  'Transient abuse-prevention counters. Rows are deleted once their window closes; see the privacy policy.';
