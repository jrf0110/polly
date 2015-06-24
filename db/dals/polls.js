module.exports = {
  name: 'polls'
, schema: {
    id:         { type: 'serial', primaryKey: true }
  , title:      { type: 'text', notNull: true }
  , body:       { type: 'text' }
  , options:    { type: 'json', notNull: true, default: '\'{}\'' }
  , edit_token: { type: 'uuid', notNull: true, default: 'uuid_generate_v4()' }
  , created_at: { type: 'timestamp', notNull: true, default: 'now()' }
  }

, defaultQueryOptions: {
    many: [ { table: 'poll_choices', alias: 'choices' }
          , { table: 'poll_responses', alias: 'responses'
            , mixin: [{ table: 'poll_choices' }]
            }
          ]
  }
};