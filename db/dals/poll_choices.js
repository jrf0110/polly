module.exports = {
  name: 'poll_choices'
, schema: {
    id:           { type: 'serial', primaryKey: true }
  , poll_id:      { type: 'int', references: { table: 'polls', column: 'id' } }
  , title:        { type: 'text', notNull: true, default: "''" }
  , body:         { type: 'text' }
  , created_at:   { type: 'timestamp', notNull: true, default: 'now()' }
  }
};