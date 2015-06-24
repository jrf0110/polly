require('babel/register');

var fs        = require('fs');
var gulp      = require('gulp');
var pkg       = require('./package.json');
var config    = require('./config');
gulp.util     = require('gulp-util');

var scripts = {
  public: ['./client/js/*.js', './client/js/**/*.js']
};

module.exports = gulp;

scripts.lint = scripts.public.concat([
  '*.js', 'test/*.js', 'config/*.js'
, 'lib/*.js', 'lib/**/*.js'
, 'db/*.js', 'db/**/*.js'
, 'models/*.js', 'models/**/*.js'
, 'server/*.js', 'server/**/*.js'
, 'client/*.js', 'client/**/*.js'
]);

gulp.task( 'compile-frontend-js', function(){
  return require('browserify')({
      debug: true
    })
    .add('./client/app.js')
    .transform( require('babelify') )
    .bundle()
    .pipe( fs.createWriteStream('./public/dist/app.js') );
});

gulp.task( 'less', function(){
  return gulp.src('less/app.less')
    .pipe( require('gulp-less')() )
    .pipe( gulp.dest('public/dist') );
});

gulp.task( 'lint', function(){
  return gulp.src( scripts.lint )
    .pipe( require('gulp-react')() )
    .pipe( require('gulp-jshint')( pkg.jshint || {} ) )
    .pipe( require('gulp-jshint').reporter('jshint-stylish') );
});

gulp.task( 'watch', function(){
  gulp.watch( scripts.lint, ['lint'] );
  gulp.watch( scripts.public, ['compile-frontend-js'] );
  gulp.watch( ['less/*.less', 'less/**/*.less'], ['less'] );
});

gulp.task( 'server', function( done ){
  require('./server')
    ({ logger: require('./lib/logger').create('Gulpfile') })
    .listen( config.http.port, function( error ){
      if ( error ) return done( error );

      gulp.util.log( 'Server started on port ' + gulp.util.colors.blue( config.http.port ) );

      done();
    });
});

gulp.task( 'create-database', function( done ){
  require('pg-destroy-create-db')
    ( config.db.connectionStr )
    .create( done );
});

gulp.task( 'destroy-database', function( done ){
  require('pg-destroy-create-db')
    ( config.db.connectionStr )
    .destroy( done );
});

gulp.task( 'create-tables', ['create-types'], function( done ){
  require('./db').dirac.createTables( done );
});

gulp.task( 'create-types', ['create-extensions'], function( done ){
  require('pg-type')( done )
    .connString( config.db.connectionStr )
    .types( require('./db/types') )
    .create( done );
});

gulp.task( 'create-extensions', ['create-database'], function( done ){
  require('pg-create-extensions')
    ( config.db.connectionStr )
    ( config.db.extensions )
    ( done );
});

gulp.task( 'insert-fixtures', ['create-tables'], function( done ){
  require('./db').query(
    fs.readFileSync( config.db.fixturesPath ).toString()
  , done
  );
});

gulp.task( 'run-deltas', ['create-tables'], function( done ){
  require('pg-delta')
    .run({
      connectionParameters: config.db.connectionStr
    , deltasDir: __dirname + '/db/deltas'
    }, done );
});

gulp.task( 'setup-db', [
  'create-database', 'create-extensions', 'create-types'
, 'create-tables', 'insert-fixtures'
]);

gulp.task( 'apply-db-changes', [
  'create-extensions', 'create-types', 'create-tables', 'run-deltas'
]);

gulp.task( 'build', [
  'lint', 'less', 'compile-frontend-js'
]);

gulp.task( 'default', [ 'build', 'apply-db-changes', 'server', 'watch' ] );