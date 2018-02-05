var gulp         = require('gulp');
var prefix       = require('gulp-autoprefixer'); // Autoprefixing magic
var minifycss    = require('gulp-uglifycss'); // Minifies CSS files
var uglify       = require("gulp-uglify");
var jshint       = require("gulp-jshint");
var sass         = require('gulp-sass'); //
var rename       = require('gulp-rename'); // Renames files E.g. style.css -> style.min.css
var sourcemaps   = require('gulp-sourcemaps'); // Maps code in a compressed file (E.g. style.css) back to it’s original position in a source file (E.g. structure.scss, which was later combined with other css files to generate style.css)


/* ----------------------------- CSS tasks ----------------------------- */
gulp.task('sass', function () {

    gulp.src('./assets/sass/stylesheet.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(prefix({
            browsers: ['last 2 versions', 'chrome 28']
        }))
        .pipe(sourcemaps.write('../maps'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss({
            maxLineLen: 100
        }))
        .pipe(gulp.dest('./assets/dist'));


});

/* ----------------------------- JS tasks ----------------------------- */
gulp.task('js', function () {

    gulp.src('./assets/scripts/app.js')
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write('../maps'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('./assets/dist'));


});


gulp.task('watch', function() {

    gulp.watch('./assets/sass/stylesheet.scss', ['sass']);
    gulp.watch('./assets/scripts/app.js', ['js']);

});

gulp.task('default', ['sass','js']);