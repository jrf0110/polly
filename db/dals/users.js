module.exports = {
  name: 'users'
, schema: {
    id:             { type: 'serial', primaryKey: true }
  , email:          { type: 'text' }
  , created_at:     { type: 'timestamp', notNull: true, default: 'now()' }
  }
};