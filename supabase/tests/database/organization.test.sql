begin;

create extension if not exists pgtap with schema extensions;
select plan(11);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  (
    '55555555-5555-4555-8555-555555555555',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'organize-a@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '66666666-6666-4666-8666-666666666666',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'organize-b@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"55555555-5555-4555-8555-555555555555","role":"authenticated"}';

select public.create_snippet_with_tags(
  'Alpha 100% SQL', 'Percent signs are literal', 'select 1;', 'sql', 'public',
  array['api', 'database']
);
select public.create_snippet_with_tags(
  'Beta under_score', 'Underscores are literal', 'const value = 1;', 'typescript', 'private',
  array['api']
);
select public.create_snippet_with_tags(
  'Gamma worker', 'A background query', 'select 2;', 'sql', 'private',
  array['database']
);

update public.snippets
set is_favorite = true, copy_count = 9
where title = 'Beta under_score';

select is(
  (select count(*) from public.search_snippets(p_query => '%')),
  1::bigint,
  'Percent characters are escaped instead of becoming wildcards'
);

select is(
  (select count(*) from public.search_snippets(p_query => '_')),
  1::bigint,
  'Underscore characters are escaped instead of becoming wildcards'
);

select is(
  (select title from public.search_snippets(p_tag => 'api', p_sort => 'title-asc') limit 1),
  'Alpha 100% SQL',
  'Exact normalized tag filtering works'
);

select is(
  (select count(*) from public.search_snippets(p_language => 'sql')),
  2::bigint,
  'Language filtering happens in the database'
);

select is(
  (select title from public.search_snippets(p_favorite => true)),
  'Beta under_score',
  'Favorite filtering returns only favorites'
);

select is(
  (select count(*) from public.search_snippets(p_visibility => 'public')),
  1::bigint,
  'Visibility filtering happens in the database'
);

select is(
  (select count(*) from public.search_snippets(p_limit => 2)),
  2::bigint,
  'The database applies the requested page size'
);

select is(
  (select total_count from public.search_snippets(p_limit => 2) limit 1),
  3::bigint,
  'Each page reports the exact filtered result count'
);

select is(
  (select title from public.search_snippets(p_sort => 'copies-desc') limit 1),
  'Beta under_score',
  'Allowlisted sort branches are applied predictably'
);

select is(
  (select snippet_count from public.list_tag_summaries() where normalized_name = 'api'),
  2::bigint,
  'Tag summaries count linked snippets'
);

set local "request.jwt.claims" = '{"sub":"66666666-6666-4666-8666-666666666666","role":"authenticated"}';

select is(
  (select count(*) from public.search_snippets()),
  0::bigint,
  'Organization queries remain isolated by owner'
);

select * from finish();
rollback;
