module.exports = {
  name: 'poll_responses'
, schema: {
    id:             { type: 'serial', primaryKey: true }
  , poll_choice_id: { type: 'int', references: { table: 'poll_choices', column: 'id' } }
  , created_at:     { type: 'timestamp', notNull: true, default: 'now()' }
  }
};