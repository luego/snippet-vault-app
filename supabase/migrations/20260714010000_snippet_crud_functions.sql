alter table public.snippets
add constraint snippets_language_allowlist check (
  language in (
    'plaintext', 'typescript', 'javascript', 'tsx', 'jsx', 'csharp',
    'python', 'java', 'go', 'rust', 'sql', 'bash', 'powershell', 'json',
    'yaml', 'html', 'css', 'markdown', 'dockerfile'
  )
);

create or replace function public.create_snippet_with_tags(
  p_title text,
  p_description text,
  p_code text,
  p_language text,
  p_visibility public.snippet_visibility,
  p_tags text[] default '{}'
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_snippet_id uuid;
  v_tag_name text;
  v_tag_id uuid;
begin
  if v_owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if cardinality(p_tags) > 10 then
    raise exception 'Too many tags' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(p_tags) as supplied_tag
    where supplied_tag is null
      or char_length(supplied_tag) not between 1 and 30
      or supplied_tag <> lower(btrim(regexp_replace(supplied_tag, '\s+', ' ', 'g')))
  ) then
    raise exception 'Tags must be normalized' using errcode = '22023';
  end if;

  insert into public.snippets (
    owner_id,
    title,
    description,
    code,
    language,
    visibility
  )
  values (
    v_owner_id,
    p_title,
    p_description,
    p_code,
    p_language,
    p_visibility
  )
  returning id into v_snippet_id;

  foreach v_tag_name in array p_tags loop
    insert into public.tags (owner_id, name, normalized_name)
    values (v_owner_id, v_tag_name, v_tag_name)
    on conflict (owner_id, normalized_name)
    do update set name = excluded.name
    returning id into v_tag_id;

    insert into public.snippet_tags (snippet_id, tag_id)
    values (v_snippet_id, v_tag_id)
    on conflict do nothing;
  end loop;

  return v_snippet_id;
end;
$$;

create or replace function public.update_snippet_with_tags(
  p_snippet_id uuid,
  p_title text,
  p_description text,
  p_code text,
  p_language text,
  p_visibility public.snippet_visibility,
  p_tags text[] default '{}'
)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_updated_id uuid;
  v_tag_name text;
  v_tag_id uuid;
begin
  if v_owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if cardinality(p_tags) > 10 then
    raise exception 'Too many tags' using errcode = '22023';
  end if;

  if exists (
    select 1
    from unnest(p_tags) as supplied_tag
    where supplied_tag is null
      or char_length(supplied_tag) not between 1 and 30
      or supplied_tag <> lower(btrim(regexp_replace(supplied_tag, '\s+', ' ', 'g')))
  ) then
    raise exception 'Tags must be normalized' using errcode = '22023';
  end if;

  update public.snippets
  set
    title = p_title,
    description = p_description,
    code = p_code,
    language = p_language,
    visibility = p_visibility
  where id = p_snippet_id
    and owner_id = v_owner_id
  returning id into v_updated_id;

  if v_updated_id is null then
    raise exception 'Snippet not found' using errcode = 'P0002';
  end if;

  delete from public.snippet_tags
  where snippet_id = v_updated_id;

  foreach v_tag_name in array p_tags loop
    insert into public.tags (owner_id, name, normalized_name)
    values (v_owner_id, v_tag_name, v_tag_name)
    on conflict (owner_id, normalized_name)
    do update set name = excluded.name
    returning id into v_tag_id;

    insert into public.snippet_tags (snippet_id, tag_id)
    values (v_updated_id, v_tag_id)
    on conflict do nothing;
  end loop;

  return v_updated_id;
end;
$$;

create or replace function public.duplicate_snippet(p_snippet_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_duplicate_id uuid;
begin
  if v_owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  insert into public.snippets (
    owner_id,
    title,
    description,
    code,
    language,
    visibility,
    is_favorite
  )
  select
    v_owner_id,
    left(title || ' (copy)', 120),
    description,
    code,
    language,
    'private'::public.snippet_visibility,
    false
  from public.snippets
  where id = p_snippet_id
    and owner_id = v_owner_id
  returning id into v_duplicate_id;

  if v_duplicate_id is null then
    raise exception 'Snippet not found' using errcode = 'P0002';
  end if;

  insert into public.snippet_tags (snippet_id, tag_id)
  select v_duplicate_id, snippet_tags.tag_id
  from public.snippet_tags
  join public.tags on tags.id = snippet_tags.tag_id
  where snippet_tags.snippet_id = p_snippet_id
    and tags.owner_id = v_owner_id;

  return v_duplicate_id;
end;
$$;

create or replace function public.increment_snippet_copy_count(p_snippet_id uuid)
returns void
language sql
security invoker
set search_path = ''
as $$
  update public.snippets
  set copy_count = copy_count + 1
  where id = p_snippet_id
    and owner_id = (select auth.uid());
$$;

revoke all on function public.create_snippet_with_tags(text, text, text, text, public.snippet_visibility, text[]) from public, anon;
revoke all on function public.update_snippet_with_tags(uuid, text, text, text, text, public.snippet_visibility, text[]) from public, anon;
revoke all on function public.duplicate_snippet(uuid) from public, anon;
revoke all on function public.increment_snippet_copy_count(uuid) from public, anon;

grant execute on function public.create_snippet_with_tags(text, text, text, text, public.snippet_visibility, text[]) to authenticated;
grant execute on function public.update_snippet_with_tags(uuid, text, text, text, text, public.snippet_visibility, text[]) to authenticated;
grant execute on function public.duplicate_snippet(uuid) to authenticated;
grant execute on function public.increment_snippet_copy_count(uuid) to authenticated;
