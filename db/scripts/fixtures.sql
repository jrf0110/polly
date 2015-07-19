-- Fixtures

DO $$
begin
  raise notice '## Running Test Fixtures ##';

  insert into polls( id, title, options ) values ( 1, 'Test Poll 1', E'
    { "numberOfVotesPerPoll":   1
    , "multipleSessionsPerIp":  false
    }
  ');
  
  perform setval( 'polls_id_seq', ( select max(id) from polls ) );

  -- Poll #1
  insert into poll_choices( id, poll_id, title ) values ( 1, 1, 'Test Choice 1' );
  insert into poll_choices( id, poll_id, title ) values ( 2, 1, 'Test Choice 2' );
  insert into poll_choices( id, poll_id, title ) values ( 3, 1, 'Test Choice 3' );

  perform setval( 'poll_choices_id_seq', ( select max(id) from poll_choices ) );

end$$;