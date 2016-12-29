var gulp = require('gulp'),
		webmake = require('gulp-webmake');
		// notify = require("gulp-notify");
 
gulp.task('templates', function(){
  gulp.src([
  	'entry.js',
  	'model.js',
  	'view.js',
    'router.js',
    'controller.js'
  ])
  .pipe(webmake())
  .pipe(gulp.dest('app/'));
});

// gulp.task('notice', function(){
// 	gulp.src("*.js")
//   .pipe(notify("script change!"));
// });

gulp.task('default', ['templates']);

gulp.task('watch', function(){
	gulp.watch('*.js', ['default']);
});