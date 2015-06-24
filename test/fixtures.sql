-- Fixtures

DO $$
begin
  raise notice '## Running Test Fixtures ##';

  insert into polls( id, title ) values ( 1, 'Test Poll 1' );
  alter sequence polls_id_seq increment by 1;

end$$;