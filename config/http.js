var config = module.exports = {
  port: 3062
, concurrency: require('os').cpus().length
, host: 'localhost'
, protocol: 'http'
, baseUrl: function(){
    return ('protocol://host' + (config.port === 80 ? '' : ':port'))
      .replace( 'protocol', config.protocol )
      .replace( 'host', config.host )
      .replace( 'port', config.port );
  }
};

if ( process.env['NODE_ENV'] === 'test' ){
  config.port = 3063;
}