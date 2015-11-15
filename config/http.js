var config = module.exports = {
  port: process.env.PORT || 3062
, concurrency: require('os').cpus().length
, host: 'localhost'
, protocol: 'http'
, baseUrl: function(){
    return ('protocol://host' + (config.port === 80 ? '' : ':port'))
      .replace( 'protocol', config.protocol )
      .replace( 'host', config.host )
      .replace( 'port', config.port );
  }

, session: {
    secret:  process.env.POLLY_SESSION_SECRET || 'blah'
  , cookie: { maxAge: 14 * 24 * 60 * 60 * 1000 }
  , resave: true
  , saveUninitialized: true
  }
};

if ( process.env['NODE_ENV'] === 'test' ){
  config.port = 3063;
}

if ( process.env['NODE_ENV'] === 'production' ){
  config.host = 'polly.j0.hn';
}