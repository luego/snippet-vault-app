create extension if not exists pg_trgm;

create type public.snippet_visibility as enum ('private', 'public');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  preferred_theme text not null default 'system'
    check (preferred_theme in ('light', 'dark', 'system')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint profiles_display_name_length check (
    display_name is null or char_length(display_name) <= 80
  )
);

create table public.snippets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  public_id uuid not null default gen_random_uuid() unique,
  title text not null,
  description text,
  code text not null,
  language text not null default 'plaintext',
  visibility public.snippet_visibility not null default 'private',
  is_favorite boolean not null default false,
  copy_count bigint not null default 0 check (copy_count >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint snippets_title_length check (char_length(title) between 1 and 120),
  constraint snippets_description_length check (
    description is null or char_length(description) <= 500
  ),
  constraint snippets_code_length check (char_length(code) between 1 and 50000),
  constraint snippets_language_length check (char_length(language) between 1 and 50)
);

create table public.tags (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  normalized_name text not null,
  created_at timestamptz not null default now(),

  constraint tags_name_length check (char_length(name) between 1 and 30),
  constraint tags_normalized_length check (
    char_length(normalized_name) between 1 and 30
  ),
  unique (owner_id, normalized_name)
);

create table public.snippet_tags (
  snippet_id uuid not null references public.snippets(id) on delete cascade,
  tag_id uuid not null references public.tags(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (snippet_id, tag_id)
);

create index snippets_owner_updated_idx
  on public.snippets (owner_id, updated_at desc);
create index snippets_owner_created_idx
  on public.snippets (owner_id, created_at desc);
create index snippets_owner_language_idx
  on public.snippets (owner_id, language);
create index snippets_owner_favorite_idx
  on public.snippets (owner_id, is_favorite)
  where is_favorite = true;
create index snippets_public_id_public_idx
  on public.snippets (public_id)
  where visibility = 'public';
create index snippets_title_trgm_idx
  on public.snippets using gin (title gin_trgm_ops);
create index snippets_description_trgm_idx
  on public.snippets using gin (description gin_trgm_ops);
create index tags_owner_name_idx
  on public.tags (owner_id, normalized_name);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

create trigger snippets_set_updated_at
before update on public.snippets
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    nullif(left(coalesce(new.raw_user_meta_data ->> 'display_name', ''), 80), '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.snippets enable row level security;
alter table public.tags enable row level security;
alter table public.snippet_tags enable row level security;

create policy "Users can read their own profile"
on public.profiles for select
to authenticated
using (id = (select auth.uid()));

create policy "Users can update their own profile"
on public.profiles for update
to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy "Owners can read their snippets"
on public.snippets for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "Anyone can read public snippets"
on public.snippets for select
to anon, authenticated
using (visibility = 'public');

create policy "Users can create their own snippets"
on public.snippets for insert
to authenticated
with check (owner_id = (select auth.uid()));

create policy "Owners can update their snippets"
on public.snippets for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Owners can delete their snippets"
on public.snippets for delete
to authenticated
using (owner_id = (select auth.uid()));

create policy "Users can read their tags"
on public.tags for select
to authenticated
using (owner_id = (select auth.uid()));

create policy "Users can create their tags"
on public.tags for insert
to authenticated
with check (owner_id = (select auth.uid()));

create policy "Users can update their tags"
on public.tags for update
to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy "Users can delete their tags"
on public.tags for delete
to authenticated
using (owner_id = (select auth.uid()));

create policy "Users can read owned snippet tag links"
on public.snippet_tags for select
to authenticated
using (
  exists (
    select 1 from public.snippets
    where snippets.id = snippet_tags.snippet_id
      and snippets.owner_id = (select auth.uid())
  )
  and exists (
    select 1 from public.tags
    where tags.id = snippet_tags.tag_id
      and tags.owner_id = (select auth.uid())
  )
);

create policy "Users can create owned snippet tag links"
on public.snippet_tags for insert
to authenticated
with check (
  exists (
    select 1 from public.snippets
    where snippets.id = snippet_tags.snippet_id
      and snippets.owner_id = (select auth.uid())
  )
  and exists (
    select 1 from public.tags
    where tags.id = snippet_tags.tag_id
      and tags.owner_id = (select auth.uid())
  )
);

create policy "Users can delete owned snippet tag links"
on public.snippet_tags for delete
to authenticated
using (
  exists (
    select 1 from public.snippets
    where snippets.id = snippet_tags.snippet_id
      and snippets.owner_id = (select auth.uid())
  )
  and exists (
    select 1 from public.tags
    where tags.id = snippet_tags.tag_id
      and tags.owner_id = (select auth.uid())
  )
);

grant usage on schema public to anon, authenticated;
grant select on public.snippets to anon;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.snippets to authenticated;
grant select, insert, update, delete on public.tags to authenticated;
grant select, insert, delete on public.snippet_tags to authenticated;

revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.set_updated_at() from public, anon, authenticated;
