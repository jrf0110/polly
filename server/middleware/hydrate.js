module.exports = function( key, value ){
  return function( req, res, next ){
    var val = value.__isMValue ? value( req, res ) : value;

    res.write('\n<script>\n');
    res.write('window.__data[\'' + key + '\'] = ' + JSON.stringify( val ) + ';\n');
    res.write('</script>\n');

    return next();
  };
};

module.exports.init = function( options ){
  return function( req, res, next ){
    if ( (req.headers.accept || '').split(',').indexOf('text/html') === -1 ){
      return next();
    }
    
    res.write('\n<script>\n');
    res.write('window.__data = {};\n');
    res.write('</script>\n');
    return next();
  };
};