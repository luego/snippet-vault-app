begin;

create extension if not exists pgtap with schema extensions;
select plan(10);

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password,
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data,
  created_at, updated_at
) values
  (
    '11111111-1111-1111-1111-111111111111',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'user-a@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated', 'user-b@example.test', 'test',
    now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()
  );

insert into public.snippets (id, owner_id, title, code, visibility) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'User A private', 'select 1;', 'private'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    '22222222-2222-2222-2222-222222222222',
    'User B private', 'select 2;', 'private'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    '22222222-2222-2222-2222-222222222222',
    'User B public', 'select 3;', 'public'
  );

insert into public.tags (id, owner_id, name, normalized_name) values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '11111111-1111-1111-1111-111111111111', 'A tag', 'a tag'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3',
    '22222222-2222-2222-2222-222222222222', 'B tag', 'b tag'
  );

insert into public.snippet_tags (snippet_id, tag_id) values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'
  );

set local role authenticated;
set local "request.jwt.claims" = '{"sub":"11111111-1111-1111-1111-111111111111","role":"authenticated"}';

select is(
  (select count(*) from public.snippets where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'),
  0::bigint,
  'User A cannot read User B private snippet'
);

select results_eq(
  $$
    with updated as (
      update public.snippets
      set title = 'forged'
      where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'
      returning id
    ), deleted as (
      delete from public.snippets
      where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'
      returning id
    )
    select id from updated union all select id from deleted
  $$,
  array[]::uuid[],
  'User A cannot update or delete User B snippet'
);

select throws_ok(
  $$insert into public.snippet_tags (snippet_id, tag_id) values ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3')$$,
  '42501',
  null,
  'User A cannot attach User B tag'
);

select throws_ok(
  $$insert into public.snippets (owner_id, title, code) values ('22222222-2222-2222-2222-222222222222', 'Forged owner', 'nope')$$,
  '42501',
  null,
  'A forged owner ID cannot create a snippet for another user'
);

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';

select is(
  (select count(*) from public.snippets where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1'),
  0::bigint,
  'Anonymous users cannot read private snippets'
);

select is(
  (select count(*) from public.snippets where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
  1::bigint,
  'Anonymous users can read a public snippet'
);

select is(
  (select count(*) from public.snippet_tags where snippet_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
  1::bigint,
  'Anonymous users can read tag links for a public snippet'
);

select is(
  (select count(*) from public.tags where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3'),
  1::bigint,
  'Anonymous users can read tags used by a public snippet'
);

reset role;
set local role authenticated;
set local "request.jwt.claims" = '{"sub":"22222222-2222-2222-2222-222222222222","role":"authenticated"}';
update public.snippets
set visibility = 'private'
where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2';

reset role;
set local role anon;
set local "request.jwt.claims" = '{"role":"anon"}';

select is(
  (select count(*) from public.snippets where id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
  0::bigint,
  'Revoking public visibility immediately blocks anonymous access'
);

select is(
  (select count(*) from public.snippet_tags where snippet_id = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2'),
  0::bigint,
  'Revoking public visibility also hides anonymous tag links'
);

select * from finish();
rollback;
