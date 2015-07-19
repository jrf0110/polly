module.exports = {
  name: 'poll_responses'
, schema: {
    id:             { type: 'serial', primaryKey: true }
    // Denormalize to make some poll lookups easier
  , poll_id:        { type: 'int', references: { table: 'polls', column: 'id' } }
  , poll_choice_id: { type: 'int', references: { table: 'poll_choices', column: 'id' } }
  , user_ip:        { type: 'text' }
  , session_id:     { type: 'text', notNull: true }
  , created_at:     { type: 'timestamp', notNull: true, default: 'now()' }
  }
};