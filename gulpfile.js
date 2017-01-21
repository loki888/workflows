var gulp = require("gulp");
var gutil = require("gulp-util");
var coffee = require("gulp-coffee");
var browserify = require("gulp-browserify");
var compass = require("gulp-compass");
var connect = require("gulp-connect");
var gulpif  = require("gulp-if");
var uglify = require("gulp-uglify");
var minifyHTML = require("gulp-minify-html");
var jsonminify = require("gulp-jsonminify");
var concat = require("gulp-concat");

var env,
    coffeeSourses,
    jsSourses,
    sassSourses,
    htmlSourses,
    jsonSourses,
    outputDir,
    sassStyle;
    
env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    outputDir   = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir   = 'builds/prodaction/';
    sassStyle = 'compressed';
}

coffeeSourses = ['components/coffee/tagline.coffee'];

jsSourses = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
    ];
    
sassSourses = [
     'components/sass/style.scss'
    ];
    
htmlSourses = [outputDir + '*.html'];
jsonSourses = [outputDir + 'js/*.json'];  


gulp.task('coffee', function(){
    gulp.src(coffeeSourses)
    .pipe(coffee({bare:true})
        .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});

gulp.task('js', [], function(){ // [] -- dependensis
    gulp.src(jsSourses)
        .pipe(concat('script.js')) // final file name
        .pipe(browserify())
        .pipe(gulpif(env === 'prodaction', uglify()))
        .pipe(gulp.dest(outputDir + '/js'))
        .pipe(connect.reload());
});

gulp.task('compass', function(){
    gulp.src(sassSourses)
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'images',
            style: sassStyle
        })) // final file name
            .on('error', gutil.log)
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload());
});

gulp.task('watch', function(){
    gulp.watch(coffeeSourses, ['coffee']);
    gulp.watch(jsSourses, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
});

gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    })
});

gulp.task('html', function(){
    gulp.src('builds/development/*.html')
    .pipe(gulpif(env === 'prodaction' , minifyHTML()))
    .pipe(gulpif(env === 'prodaction' , gulp.dest(outputDir)))
    .pipe(connect.reload());
});

gulp.task('json', function(){
    gulp.src('builds/development/js/*.json')
    .pipe(gulpif(env === 'prodaction' , jsonminify()))
    .pipe(gulpif(env === 'prodaction' , gulp.dest('builds/prodaction/js')))
    .pipe(connect.reload());
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);

