create or replace function on_poll()
returns trigger as $$
begin
  perform poll_stats_init( NEW.id );
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_poll on polls;
create trigger on_poll
    after insert on polls
    for each row
    execute procedure on_poll();

create or replace function on_poll_choice()
returns trigger as $$
begin
  perform poll_stats_init_response( NEW.poll_id, NEW.id );
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_poll_choice on poll_choices;
create trigger on_poll_choice
    after insert on poll_choices
    for each row
    execute procedure on_poll_choice();

create or replace function on_poll_response()
returns trigger as $$
  declare pid int;
begin
  pid := (select poll_id from poll_choices where id = NEW.poll_choice_id limit 1);
  perform poll_stats_increment_response( pid, NEW.poll_choice_id );
  return NEW;
end;
$$ language plpgsql;

drop trigger if exists on_poll_response on poll_responses;
create trigger on_poll_response
    after insert on poll_responses
    for each row
    execute procedure on_poll_response();

create or replace function poll_stats_init( pid int )
returns void as $$
begin
  insert into poll_stats ( poll_id ) values ( pid  );
end;
$$ language plpgsql;

-- http://stackoverflow.com/questions/18209625/how-do-i-modify-fields-inside-the-new-postgresql-json-datatype
create or replace function "json_object_set_key" (
  "json"          json,
  "key_to_set"    text,
  "value_to_set"  anyelement
)
  returns json
  language sql
  immutable
  strict
as $function$
select concat('{', string_agg(to_json("key") || ':' || "value", ','), '}')::json
  from (select *
          from json_each("json")
         where "key" <> "key_to_set"
         union all
        select "key_to_set", to_json("value_to_set")) as "fields"
$function$;

create or replace function poll_stats_init_response( pid int, pchoice_id int )
returns void as $$
  declare res json;
begin
  res := (
    select responses from poll_stats
      where poll_id = pid
      limit 1
      for update
  );

  update poll_stats
    set responses = json_object_set_key( res, pchoice_id::text, 0::int )
    where poll_id = pid;
end;
$$ language plpgsql;

create or replace function poll_stats_increment_response( pid int, pchoice_id int )
returns void as $$
  declare res json;
begin
  res := (
    select responses from poll_stats
      where poll_id = pid
      limit 1
      for update
  );

  update poll_stats
    set responses = json_object_set_key(
      res, pchoice_id::text, ((res->>pchoice_id::text)::int + 1)::int
    )
    where poll_id = pid;
end;
$$ language plpgsql;