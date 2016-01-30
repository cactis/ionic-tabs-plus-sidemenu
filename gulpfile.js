var gulp = require('gulp');
var gutil = require('gulp-util');
var bower = require('bower');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var changed = require('gulp-changed');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var sh = require('shelljs');
var watch = require('gulp-watch');
var haml = require('gulp-ruby-haml');
var coffee = require('gulp-coffee');

var paths = {
  sass: ['./scss/**/*.scss'],
  assetsSass: ['./assets/sass/**/*.sass'],
  assetsHaml: ['./assets/haml/**/*.haml'],
  assetsCoffee: ['./assets/coffee/**/*.coffee']
};

gulp.task('assets-haml', function () {
  gulp.src('./assets/haml/**/*.haml')
    .pipe(haml())
    .pipe(changed('www', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('./www'));
});

gulp.task('assets-sass', function () {
  gulp.src('./assets/sass/**/*.sass')
    .pipe(sass())
    .pipe(changed('www/css', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('./www/css'));
});

gulp.task('assets-coffee', function () {
  gulp.src('./assets/coffee/**/*.coffee')
    .pipe(coffee({bare: true}))
    .pipe(changed('www/js', {hasChanged: changed.compareSha1Digest}))
    .pipe(gulp.dest('./www/js'));
});

gulp.task('sass', function(done) {
  gulp.src('./scss/ionic.app.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(gulp.dest('./www/css/'))
    .pipe(minifyCss({
      keepSpecialComments: 0
    }))
    .pipe(rename({ extname: '.min.css' }))
    .pipe(gulp.dest('./www/css/'))
    .on('end', done);
});

gulp.task('watch', function() {
  gulp.watch(paths.sass, ['sass']);
  gulp.watch(paths.assetsSass, ['assets-sass']);
  gulp.watch(paths.assetsHaml, ['assets-haml']);
  gulp.watch(paths.assetsCoffee, ['assets-coffee']);
});

gulp.task('install', ['git-check'], function() {
  return bower.commands.install()
    .on('log', function(data) {
      gutil.log('bower', gutil.colors.cyan(data.id), data.message);
    });
});

gulp.task('git-check', function(done) {
  if (!sh.which('git')) {
    console.log(
      '  ' + gutil.colors.red('Git is not installed.'),
      '\n  Git, the version control system, is required to download Ionic.',
      '\n  Download git here:', gutil.colors.cyan('http://git-scm.com/downloads') + '.',
      '\n  Once git is installed, run \'' + gutil.colors.cyan('gulp install') + '\' again.'
    );
    process.exit(1);
  }
  done();
});

gulp.task('default', ['watch']);
