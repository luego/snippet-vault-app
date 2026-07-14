begin;

create extension if not exists pgtap with schema extensions;
select plan(12);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  (
    '33333333-3333-4333-8333-333333333333',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'crud-a@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'crud-b@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"33333333-3333-4333-8333-333333333333","role":"authenticated"}';

select lives_ok(
  $$select public.create_snippet_with_tags(
    'XSS sample',
    '<img src=x onerror=alert(1)>',
    '<script>alert(document.cookie)</script>',
    'html',
    'private',
    array['security', 'html']
  )$$,
  'Owner can atomically create a snippet and tags'
);

select is(
  (select count(*) from public.snippets where title = 'XSS sample'),
  1::bigint,
  'Created snippet is visible to its owner'
);

select is(
  (
    select count(*)
    from public.snippet_tags
    where snippet_id = (select id from public.snippets where title = 'XSS sample')
  ),
  2::bigint,
  'Create links every normalized tag'
);

select is(
  (select code from public.snippets where title = 'XSS sample'),
  '<script>alert(document.cookie)</script>',
  'Potential XSS is stored as inert text without mutation'
);

select throws_ok(
  $$select public.create_snippet_with_tags(
    'Too many tags', null, 'example', 'plaintext', 'private',
    array['one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven']
  )$$,
  '22023',
  'Too many tags',
  'The database rejects more than ten tags'
);

select throws_ok(
  $$select public.create_snippet_with_tags(
    'Bad tag', null, 'example', 'plaintext', 'private', array['Not Normalized']
  )$$,
  '22023',
  'Tags must be normalized',
  'The database rejects non-normalized tags'
);

select throws_ok(
  $$insert into public.snippets (owner_id, title, code, language)
    values (
      '33333333-3333-4333-8333-333333333333',
      'Unsupported language',
      'example',
      'brainfuck'
    )$$,
  '23514',
  null,
  'The database rejects unsupported languages'
);

select lives_ok(
  $$select public.update_snippet_with_tags(
    (select id from public.snippets where title = 'XSS sample'),
    'Updated sample',
    null,
    'const safe = true;',
    'javascript',
    'public',
    array['updated']
  )$$,
  'Owner can atomically update snippet fields and tags'
);

select is(
  (
    select count(*)
    from public.snippet_tags
    where snippet_id = (select id from public.snippets where title = 'Updated sample')
  ),
  1::bigint,
  'Update replaces tag links'
);

select lives_ok(
  $$select public.duplicate_snippet(
    (select id from public.snippets where title = 'Updated sample')
  )$$,
  'Owner can duplicate a snippet'
);

select is(
  (
    select visibility::text
    from public.snippets
    where title = 'Updated sample (copy)'
  ),
  'private',
  'Duplicates are private by default'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"44444444-4444-4444-8444-444444444444","role":"authenticated"}';

select throws_ok(
  $$select public.duplicate_snippet(
    (select id from public.snippets where title = 'Updated sample')
  )$$,
  'P0002',
  'Snippet not found',
  'Another user cannot duplicate an inaccessible snippet'
);

select * from finish();
rollback;
