require('babel/register');

// process.env.NODE_ENV = 'test';

var fs        = require('fs');
var path      = require('path');
var gulp      = require('gulp');
var config    = require('./config');
var utils     = require('./lib/utils');
gulp.util     = require('gulp-util');

var logger    = require('./lib/logger').create('Gulpfile');

var scripts = {
  public: ['./client/*.js', './client/**/*.js', './components/*.js', './components/**/*.js']
};

module.exports = gulp;

require('./stores/poll').setLogger( logger );

scripts.lint = scripts.public.concat([
  '*.js', 'test/*.js', 'config/*.js'
, 'lib/*.js', 'lib/**/*.js'
, 'db/*.js', 'db/**/*.js'
, 'models/*.js', 'models/**/*.js'
, 'server/*.js', 'server/**/*.js'
, 'client/*.js', 'client/**/*.js'
]);

gulp.task( 'compile-frontend-js', ['alias-modules'], function(){
  var b = require('browserify')( './client/app.js', utils.extend(
      require('browserify-incremental').args, { debug: true }
    ))
    .transform( require('babelify') );

  require('browserify-incremental')( b, { cacheFile: './browserify-cache.json' } );

  try {
    fs.mkdirSync('./public/dist');
  } catch ( e ){
    
  }

  return b
    .bundle()
    .pipe( fs.createWriteStream('./public/dist/app.js') );
});

gulp.task( 'less', function(){
  return gulp.src('less/app.less')
    .pipe( require('gulp-less')() )
    .pipe( gulp.dest('public/dist') );
});

gulp.task( 'watch', function(){
  gulp.watch( scripts.public, ['compile-frontend-js'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
  gulp.watch( ['db/scripts/functions.sql'], ['db:scripts'] );
});

gulp.task( 'server', ['alias-modules'], function( done ){
  require('./server')
    ({ logger: logger })
    .listen( config.http.port, function( error ){
      if ( error ){
        return done( error );
      }

      gulp.util.log( 'Server started on port ' + gulp.util.colors.blue( config.http.port ) );

      done();
    });
});

gulp.task( 'alias-modules', function(){
  require('alias-module')( 'config', path.join( __dirname, '/config/index.js' ) );
});

gulp.task( 'db:create', function( done ){
  require('pg-destroy-create-db')
    ( config.db.connectionStr )
    .create( done );
});

gulp.task( 'db:destroy', function( done ){
  require('pg-destroy-create-db')
    ( config.db.connectionStr )
    .destroy( done );
});

gulp.task( 'db:tables', ['db:types'], function( done ){
  require('./db').dirac.createTables( done );
});

gulp.task( 'db:types', ['db:extensions'], function( done ){
  require('pg-type')( done )
    .connString( config.db.connectionStr )
    .types( require('./db/types') )
    .create( done );
});

gulp.task( 'db:extensions', ['db:create'], function( done ){
  require('pg-create-extensions')
    ( config.db.connectionStr )
    ( config.db.extensions )
    ( done );
});

gulp.task( 'db:fixtures', ['db:scripts'], function( done ){
  require('./db').query(
    fs.readFileSync( config.db.fixturesPath ).toString()
  , done
  );
});

gulp.task( 'db:scripts', ['db:tables'], function( done ){
  require('./db').query(
    fs.readFileSync( path.join( __dirname, '/db/scripts/functions.sql' ) ).toString()
  , done
  );
});

gulp.task( 'db:deltas', ['db:tables'], function( done ){
  require('pg-delta')
    .run({
      connectionParameters: config.db.connectionStr
    , deltasDir: path.join( __dirname, '/db/deltas' )
    }, done );
});

gulp.task( 'db:setup', [
  'db:create', 'db:extensions', 'db:types'
, 'db:tables', 'db:scripts', 'db:fixtures'
]);

gulp.task( 'db:changes', [
  'db:extensions', 'db:types', 'db:tables', 'db:scripts', 'db:deltas'
]);

// gulp.task( 'db:reload', ['db:destroy'], ['db:create']);

gulp.task( 'build', [
  'less', 'compile-frontend-js'
]);

gulp.task( 'default', [ 'build', 'db:changes', 'server', 'watch' ] );