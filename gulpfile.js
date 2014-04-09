// Gulp
var gulp         = require('gulp'),
    gutil        = require('gulp-util'),
    clean        = require('gulp-clean'),
    size         = require('gulp-size'),
    rename       = require('gulp-rename'),
    notify       = require('gulp-notify'),
    watch        = require('gulp-watch'),
    connect      = require('gulp-connect'),
    livereload   = require('gulp-livereload'),
    lr           = require('tiny-lr'),
    server       = lr(),
    path         = require('path'),
    // Scripts [coffee]
    coffee         = require('gulp-coffee'),
    coffeelint    = require('gulp-coffeelint'),
    __ports      = {
        server:     1338,
        livereload: 35732
    };

gulp.task('scripts', function () {
    return gulp.src('core/{,*/}*.{coffee,coffee.md}')
        .pipe(coffee({
            bare: true
        }))
        .on('error', gutil.log)
        .pipe(coffeelint())
        .on('error', gutil.log)
        .pipe(coffeelint.reporter())
        .on('error', gutil.log)
        .pipe(size())
        .pipe(gulp.dest('core'))
        .pipe(livereload(server))
        .pipe(notify({
            message: 'Scripts task completed @ <%= options.date %>',
            templateOptions: {
                date: new Date()
            }
        }));
});

// Connect & livereload
gulp.task('connect', function () {
    connect.server({
        root: __dirname,
        port: __ports.server,
        livereload: true
    });
});

// Watch
gulp.task('watch', function () {
    server.listen(__ports.livereload, function (error) {
        if (error) {
            return console.error(error);
        }

        // Gulpfile
        gulp.watch('gulpfile.js', ['assets']);

        // Watch .scss files
        gulp.watch('core/{,*/}*.{coffee,coffee.md}', ['scripts']);
    });
});

gulp.task('assets', ['scripts']);

gulp.task('serve', ['assets'], function () {
    gulp.start('connect', 'watch');
});

gulp.task('default', ['serve']);
