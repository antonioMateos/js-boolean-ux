'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var prefix = require('gulp-autoprefixer');

var browserSync = require('browser-sync').create();
var reload = browserSync.reload;

// nodemon solution from -> https://gist.github.com/sogko mixed with -> https://gist.github.com/dstroot
var nodemon = require('gulp-nodemon');

// I/O
var scssI = 'app/scss/custom.scss';
var scssO = 'app/css';

// SASS ERRORS
var sassOptions = {
  errLogToConsole: true,
  outputStyle: 'expanded'
};

gulp.task('sass', function() {
    console.log("- - - - CSS change");
    return gulp
        .src(scssI) 
        .pipe(sass(sassOptions).on('error', sass.logError))
        .pipe(gulp.dest(scssO))
        .pipe(reload({stream: true}))
});


gulp.task('js', function() {
    console.log("- - - - JS change");
    return gulp
        .src('app/js/*.js')
        .pipe(reload({stream: true}))
});

// NOT AUTOMATED FOR PROTOTYPE
gulp.task('js-concat', function() {
    console.log("- - - - JS change");
    return gulp
        .src(['app/js/00_fibInit.js', 'app/js/01_routerFront.js', 'app/js/02_UI.js', 'app/js/login.js'])
        .pipe(concat('app.js'))
        .pipe(gulp.dest('app/'))
});

gulp.task('html', function() {
    console.log("- - - - HTML change");
    return gulp
        .src('app/*.html')
        .pipe(reload({stream: true}))
});

gulp.task('serve', ['nodemon'], function() {
  
    console.info("- - - - GULP WORKING - - - -");

    browserSync.init(null, {
        proxy: "http://localhost:3000",
        //files: ["app/**/*.*"],
        //browser: "google chrome",
        port: 5000, // Use a different one than the proxy
        notify: true
    });

    // WATCH for scss changes
    gulp.watch('app/scss/*.scss', ['sass']);
    // WATCH for js changes
    gulp.watch('app/js/*.js', ['js']);
    gulp.watch('app/js/*.js', ['js-concat']);
    // WATCH for html changes
    gulp.watch('app/**/*.html', ['html']);

});

gulp.task('nodemon', function (cb) {
    
    var started = false;
    
    return nodemon({
        script: 'server.js',
        ignore: [
          'gulpfile.js',
          'node_modules/'
        ]
    }).on('start', function () {
        // to avoid nodemon being started multiple times
        // thanks @matthisk
        if (!started) {
            cb();
            started = true; 
        } 
    });
});

gulp.task('default',['serve']);

