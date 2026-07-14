create or replace function public.is_tag_on_public_snippet(p_tag_id uuid)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.snippet_tags st
    join public.snippets s on s.id = st.snippet_id
    where st.tag_id = p_tag_id
      and s.visibility = 'public'
  );
$$;

create policy "Anyone can read public snippet tag links"
on public.snippet_tags for select
to anon, authenticated
using (
  exists (
    select 1
    from public.snippets
    where snippets.id = snippet_tags.snippet_id
      and snippets.visibility = 'public'
  )
);

create policy "Anyone can read tags used by public snippets"
on public.tags for select
to anon, authenticated
using ((select public.is_tag_on_public_snippet(tags.id)));

grant select on public.tags to anon;
grant select on public.snippet_tags to anon;

revoke all on function public.is_tag_on_public_snippet(uuid) from public;
grant execute on function public.is_tag_on_public_snippet(uuid) to anon, authenticated;
