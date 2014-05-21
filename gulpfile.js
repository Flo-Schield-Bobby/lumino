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
    // Styles [sass, css]
    sass         = require('gulp-ruby-sass'),
    minifycss    = require('gulp-minify-css'),
    csso         = require('gulp-csso'),
    autoprefixer = require('gulp-autoprefixer'),
    // Scripts [coffee]
    coffee         = require('gulp-coffee'),
    coffeelint    = require('gulp-coffeelint'),
    __ports      = {
        server:     1338,
        livereload: 35732
    };

// Styles
gulp.task('styles', function () {
    return gulp.src(['assets/styles/{,*/}*.scss', '!assets/styles/{,*/}*_*.scss', '!assets/styles/bourbon/*.scss'])
        .pipe(sass({
            style: 'expanded',
            quiet: true,
            trace: true,
            loadPath: ['assets/components/bootstrap-sass/vendor/assets/stylesheets/bootstrap/']
        }))
        .on('error', gutil.log)
        .pipe(autoprefixer('last 1 version'))
        .pipe(size())
        .pipe(csso())
        .on('error', gutil.log)
        .pipe(minifycss())
        .on('error', gutil.log)
        .pipe(size())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(gulp.dest('assets/styles'))
        .pipe(livereload(server));
});

gulp.task('scripts-core', function () {
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
            message: 'Scripts [Core] task completed @ <%= options.date %>',
            templateOptions: {
                date: new Date()
            }
        }));
});

gulp.task('scripts-app', function () {
    return gulp.src('app.coffee')
        .pipe(coffee({
            bare: true
        }))
        .on('error', gutil.log)
        .pipe(coffeelint())
        .on('error', gutil.log)
        .pipe(coffeelint.reporter())
        .on('error', gutil.log)
        .pipe(size())
        .pipe(gulp.dest('./'))
        .pipe(livereload(server))
        .pipe(notify({
            message: 'Scripts [App] task completed @ <%= options.date %>',
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
        gulp.watch('assets/styles/{,*/}*.scss', ['styles']);

        // Watch .scss files
        gulp.watch('core/{,*/}*.{coffee,coffee.md}', ['scripts-core']);

        // Watch .scss files
        gulp.watch('app.coffee', ['scripts-app']);
    });
});

gulp.task('assets', ['styles', 'scripts-core', 'scripts-app']);

gulp.task('serve', ['assets'], function () {
    gulp.start('connect', 'watch');
});

gulp.task('default', ['serve']);
