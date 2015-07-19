module.exports = {
  name: 'poll_stats'
, schema: {
    id:             { type: 'serial', primaryKey: true }
  , poll_id:        { type: 'int', references: { table: 'polls', column: 'id' } }
  , responses:      { type: 'json', notNull: true, default: '\'{}\'' }
  , created_at:     { type: 'timestamp', notNull: true, default: 'now()' }
  }
};