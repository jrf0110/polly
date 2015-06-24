-- Fixtures

DO $$
begin
  raise notice '## Running Test Fixtures ##';

  insert into polls( id, title ) values ( 1, 'Test Poll 1' );
  alter sequence polls_id_seq increment by 1;

  insert into polls( id, title ) values ( 2, 'Test Poll 2' );
  alter sequence polls_id_seq increment by 1;

  insert into polls( id, title ) values ( 3, 'Test Poll 2' );
  alter sequence polls_id_seq increment by 1;

end$$;