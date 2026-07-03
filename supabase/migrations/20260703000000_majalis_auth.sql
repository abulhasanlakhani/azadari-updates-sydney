-- Majalis storage with phone-OTP auth gating
--
-- Run via `supabase db push` (or paste into the Supabase SQL editor).
--
-- Access model:
--   * anyone (anon) can read the event list, but NOT contact/address —
--     those columns are withheld with column-level grants, so hiding them
--     is enforced by Postgres, not just the UI
--   * only signed-in (phone-verified) users can read contact/address
--   * only signed-in users can insert, and only as themselves (owner_id)
--   * nobody can update or delete through the API for now — no RLS policy
--     and no grant exists for it (admin edits happen in the dashboard).
--     owner_id is recorded so per-owner edit/delete can be added later.

create table if not exists public.majalis (
  id uuid primary key default gen_random_uuid(),
  -- Kept when importing from the old CloudFront API so the import is idempotent
  legacy_id text unique,
  owner_id uuid references auth.users (id) on delete set null,
  name text not null check (char_length(name) between 2 and 80),
  contact text not null check (char_length(contact) <= 20),
  date date not null,
  time text not null check (time ~ '^\d{2}:\d{2}$'),
  address text not null check (char_length(address) between 8 and 200),
  audience text not null check (audience in ('Gents', 'Ladies', 'Both')),
  speaker_notes text not null default '' check (char_length(speaker_notes) <= 500),
  created_at timestamptz not null default now()
);

create index if not exists majalis_date_idx on public.majalis (date, time);

alter table public.majalis enable row level security;

drop policy if exists "Public read access" on public.majalis;
create policy "Public read access"
  on public.majalis for select
  using (true);

drop policy if exists "Authenticated users insert their own majalis" on public.majalis;
create policy "Authenticated users insert their own majalis"
  on public.majalis for insert
  to authenticated
  with check (owner_id = auth.uid());

-- Column-level privileges. Supabase grants broad table privileges to the
-- anon/authenticated roles by default; replace them with the minimum:
--   anon           → read non-sensitive columns only
--   authenticated  → read everything, insert event fields
revoke all on table public.majalis from anon, authenticated;

grant select (id, name, date, time, audience, speaker_notes, created_at)
  on public.majalis to anon;

grant select on public.majalis to authenticated;

-- legacy_id is deliberately excluded — only the service-role import sets it
grant insert (owner_id, name, contact, date, time, address, audience, speaker_notes)
  on public.majalis to authenticated;
