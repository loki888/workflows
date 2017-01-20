var gulp = require("gulp");
var gutil = require("gulp-util");
var coffee = require("gulp-coffee");
var browserify = require("gulp-browserify");
var compass = require("gulp-compass");
var concat = require("gulp-concat");

var coffeeSourses = ['components/coffee/tagline.coffee'];

var jsSourses = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
    ];
    
var sassSourses = [
     'components/sass/style.scss'
    ];
    
gulp.task('coffee', function(){
    gulp.src(coffeeSourses)
    .pipe(coffee({bare:true})
        .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', function(){
    gulp.src(jsSourses)
        .pipe(concat('script.js')) // final file name
        .pipe(browserify())
        .pipe(gulp.dest('builds/development/js'));
});

gulp.task('compass', function(){
    gulp.src(sassSourses)
        .pipe(compass({
            sass: 'components/sass',
            image: 'builds/development/images',
            style: 'expanded'
        })) // final file name
            .on('error', gutil.log)
        .pipe(gulp.dest('builds/development/css'));
});