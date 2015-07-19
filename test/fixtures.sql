-- Fixtures

DO $$
begin
  raise notice '## Running Test Fixtures ##';

  insert into polls( id, title, options ) values ( 1, 'Test Poll 1', '{"numberOfVotesPerPoll":1,"multipleSessionsPerIp":false}'::json );
  insert into polls( id, title, options ) values ( 2, 'Test Poll 2', '{"numberOfVotesPerPoll":1,"multipleSessionsPerIp":true}'::json );
  insert into polls( id, title ) values ( 3, 'Test Poll 2' );

  perform setval( 'polls_id_seq', ( select max(id) from polls ) );

  -- Poll #1
  insert into poll_choices( id, poll_id, title ) values ( 1, 1, 'Test Choice 1' );
  insert into poll_choices( id, poll_id, title ) values ( 2, 1, 'Test Choice 2' );
  insert into poll_choices( id, poll_id, title ) values ( 3, 1, 'Test Choice 3' );

  -- Poll #2
  insert into poll_choices( id, poll_id, title ) values ( 4, 2, 'Test Choice 1' );
  insert into poll_choices( id, poll_id, title ) values ( 5, 2, 'Test Choice 2' );

  perform setval( 'poll_choices_id_seq', ( select max(id) from poll_choices ) );

  insert into poll_responses( id, poll_id, poll_choice_id, session_id, user_ip ) values ( 1, 1, 1, '1', '127.0.0.1' );
  insert into poll_responses( id, poll_id, poll_choice_id, session_id, user_ip ) values ( 2, 2, 4, '2', '127.0.0.1' );

  perform setval( 'poll_responses_id_seq', ( select max(id) from poll_responses ) );
end$$;