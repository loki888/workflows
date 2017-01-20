var gulp = require("gulp");
var gutil = require("gulp-util");
var coffee = require("gulp-coffee");

var coffeeSourses = ['components/coffee/tagline.coffee'];

gulp.task('coffee', function(){
    gulp.src(coffeeSourses)
    .pipe(coffee({bare:true})
        .on('error', gutil.log))
    .pipe(gulp.dest('components/scripts'));
});