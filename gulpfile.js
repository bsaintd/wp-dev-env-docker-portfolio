//--------------//
// load plugins //
//--------------//
const autoprefixer = require('autoprefixer');
const babel = require('gulp-babel');
const browsersync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
const srcmaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const { runWebpack } = require('./webpack-script.js');
//----------------//
// file locations //
//----------------//
const SASS_SOURCE_FOLDER = './wordpress/wp-content/themes/storefront-child-theme-master/assets/sass/**/*.scss';
const JS_DEST_FOLDER = './wordpress/wp-content/themes/storefront-child-theme-master/js';
const JS_SRC_FOLDER = './wordpress/wp-content/themes/storefront-child-theme-master/src/js/*.js';
const TS_SRC_FOLDER = './wordpress/wp-content/themes/storefront-child-theme-master/src/ts/**/*.ts';
//--------------------//
// transpiler configs //
//--------------------//
// js - es6
const babelconfig = {
  presets: ['@babel/preset-env']
};

//------------------//
// browsersync init //
//------------------//
function browserSync(done) {
  browsersync.init({
    notify: false, // in-line notifications in browser window
    open: false, // set to false if you don't like the browser window opening automatically
    port: 3333, // port number for the live version of the site; default: 3000
    proxy: 'localhost:3000', // use a proxy instead of the built-in server because wordpress has to do some server-side rendering for the theme to work
    watchOptions: {
      debounceDelay: 2000 // this introduces a small delay when watching for file change events to avoid triggering too many reloads
    }
  });
  done();
}
//--------------------//
// browsersync reload //
//--------------------//
function browserSyncReload(done) {
  browsersync.reload();
  done();
}

//-------------------//
// process .js files //
//-------------------//
function compileJS() {
  return gulp
    .src(JS_SRC_FOLDER) // source folder
    .pipe(srcmaps.init()) // source map before checkpoint
    .pipe(jshint('.jshintrc')) // js linting
    .pipe(jshint.reporter('default')) // js linting reporter
    .pipe(babel(babelconfig)) // transpile js-es6 -> js-es5
    .pipe(uglify()) // minify js output
    .pipe(srcmaps.write()) // source map after checkpoint
    .pipe(gulp.dest(JS_DEST_FOLDER)) // js destination folder
    .pipe(browsersync.stream()); // stream to browsersync
}
//------------------------------------//
// get dependencies from node_modules //
//------------------------------------//
// hamburger menu animations
function getHamburgers() {
  return gulp
    .src('./node_modules/hamburgers/_sass/hamburgers/**/*')
    .pipe(gulp.dest('./wordpress/wp-content/themes/storefront-child-theme-master/lib/hamburgers'));
}
// slick carousel
// adding more? include in getDependencies below also!
const getDependencies = gulp.parallel(
  getHamburgers,
  // next dependency gulp function here
);

//------------------------------//
// prepare for git pull request //
//------------------------------//
function deleteCompiledFiles() {
  return del([
    // match everything inside the `css` folder
    './wordpress/wp-content/themes/storefront-child-theme-master/style.css',
    // match everything inside the `js/dist` folder
    './wordpress/wp-content/themes/storefront-child-theme-master/js/**/*'
  ]);
}
//-------------//
// watch files //
//-------------//
function watchFiles() {
  gulp.watch(SASS_SOURCE_FOLDER, gulp.series(runWebpack));
  gulp.watch(JS_SRC_FOLDER, gulp.series(runWebpack));
}

//----------------------//
// define complex tasks //
//----------------------//
const build = gulp.series(
  getDependencies,
  runWebpack
);
const start = gulp.series(
  gulp.series(
    getDependencies,
    runWebpack
  ),
  gulp.parallel(watchFiles)
);
const pr = gulp.series(deleteCompiledFiles);
//--------------------------//
// export gulp cli commands //
//--------------------------//
exports.build = build;
exports.default = start;
exports.pr = pr;
