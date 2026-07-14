create index snippets_owner_visibility_updated_idx
  on public.snippets (owner_id, visibility, updated_at desc, id desc);

create index snippets_owner_title_idx
  on public.snippets (owner_id, lower(title), id);

create index snippets_owner_copies_idx
  on public.snippets (owner_id, copy_count desc, id desc);

create index snippet_tags_tag_snippet_idx
  on public.snippet_tags (tag_id, snippet_id);

create or replace function public.search_snippets(
  p_query text default null,
  p_language text default null,
  p_tag text default null,
  p_favorite boolean default null,
  p_visibility public.snippet_visibility default null,
  p_sort text default 'updated-desc',
  p_offset integer default 0,
  p_limit integer default 20
)
returns table (
  id uuid,
  title text,
  description text,
  language text,
  visibility public.snippet_visibility,
  is_favorite boolean,
  copy_count bigint,
  created_at timestamptz,
  updated_at timestamptz,
  tags jsonb,
  total_count bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
  v_query text := nullif(btrim(p_query), '');
  v_pattern text;
begin
  if v_owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if char_length(coalesce(v_query, '')) > 100
    or char_length(coalesce(p_language, '')) > 50
    or char_length(coalesce(p_tag, '')) > 30
    or p_offset < 0
    or p_limit not between 1 and 50
    or p_sort not in ('updated-desc', 'created-desc', 'title-asc', 'copies-desc') then
    raise exception 'Invalid search parameters' using errcode = '22023';
  end if;

  v_pattern := '%' || replace(
    replace(
      replace(v_query, chr(92), chr(92) || chr(92)),
      '%',
      chr(92) || '%'
    ),
    '_',
    chr(92) || '_'
  ) || '%';

  return query
  select
    s.id,
    s.title,
    s.description,
    s.language,
    s.visibility,
    s.is_favorite,
    s.copy_count,
    s.created_at,
    s.updated_at,
    coalesce(
      (
        select jsonb_agg(
          jsonb_build_object(
            'id', t.id,
            'name', t.name,
            'normalized_name', t.normalized_name
          )
          order by t.normalized_name
        )
        from public.snippet_tags st
        join public.tags t on t.id = st.tag_id
        where st.snippet_id = s.id
          and t.owner_id = v_owner_id
      ),
      '[]'::jsonb
    ) as tags,
    count(*) over() as total_count
  from public.snippets s
  where s.owner_id = v_owner_id
    and (p_language is null or s.language = p_language)
    and (p_favorite is null or s.is_favorite = p_favorite)
    and (p_visibility is null or s.visibility = p_visibility)
    and (
      p_tag is null
      or exists (
        select 1
        from public.snippet_tags tag_link
        join public.tags exact_tag on exact_tag.id = tag_link.tag_id
        where tag_link.snippet_id = s.id
          and exact_tag.owner_id = v_owner_id
          and exact_tag.normalized_name = p_tag
      )
    )
    and (
      v_query is null
      or s.title ilike v_pattern escape E'\\'
      or coalesce(s.description, '') ilike v_pattern escape E'\\'
      or exists (
        select 1
        from public.snippet_tags search_link
        join public.tags search_tag on search_tag.id = search_link.tag_id
        where search_link.snippet_id = s.id
          and search_tag.owner_id = v_owner_id
          and search_tag.normalized_name ilike v_pattern escape E'\\'
      )
    )
  order by
    case when p_sort = 'updated-desc' then s.updated_at end desc,
    case when p_sort = 'created-desc' then s.created_at end desc,
    case when p_sort = 'title-asc' then lower(s.title) end asc,
    case when p_sort = 'copies-desc' then s.copy_count end desc,
    s.id desc
  offset p_offset
  limit p_limit;
end;
$$;

create or replace function public.list_tag_summaries(p_limit integer default 100)
returns table (
  id uuid,
  name text,
  normalized_name text,
  snippet_count bigint,
  last_used_at timestamptz
)
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_owner_id uuid := auth.uid();
begin
  if v_owner_id is null then
    raise exception 'Authentication required' using errcode = '42501';
  end if;

  if p_limit not between 1 and 200 then
    raise exception 'Invalid tag limit' using errcode = '22023';
  end if;

  return query
  select
    t.id,
    t.name,
    t.normalized_name,
    count(distinct s.id) as snippet_count,
    max(s.updated_at) as last_used_at
  from public.tags t
  join public.snippet_tags st on st.tag_id = t.id
  join public.snippets s on s.id = st.snippet_id
  where t.owner_id = v_owner_id
    and s.owner_id = v_owner_id
  group by t.id, t.name, t.normalized_name
  order by count(distinct s.id) desc, t.normalized_name asc
  limit p_limit;
end;
$$;

revoke all on function public.search_snippets(
  text, text, text, boolean, public.snippet_visibility, text, integer, integer
) from public, anon;
revoke all on function public.list_tag_summaries(integer) from public, anon;

grant execute on function public.search_snippets(
  text, text, text, boolean, public.snippet_visibility, text, integer, integer
) to authenticated;
grant execute on function public.list_tag_summaries(integer) to authenticated;
