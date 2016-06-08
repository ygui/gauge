var gulp = require('gulp'),
		watch = require('gulp-watch'),
		sass = require('gulp-ruby-sass'),
		concat = require('gulp-concat'),
		gls = require('gulp-live-server'),
		jshint = require('gulp-jshint');

gulp.task('default', ['sass', 'scripts', 'watch', 'serve']);

gulp.task('sass', function () {
	return sass('assets/src/sass/**/*.sass')
	.pipe(concat('style.css'))
	.pipe(gulp.dest('assets/css'));
});

gulp.task('scripts', function() {
	return gulp.src('assets/src/js/**/*.js')
	.pipe(concat('script.js'))
	.pipe(gulp.dest('assets/js'));
});

gulp.task('serve', function() {
	//1. serve with default settings
	var server = gls.static('./', 8000); //equals to gls.static('public', 3000);
	server.start();

	gulp.watch(['assets/src/**/*.sass', 'assets/src/**/*.js', './*.html'], function (file) {
		server.notify.apply(server, [file]);
	});
});

gulp.task('watch', function(){
	gulp.watch('assets/src/sass/**/*.sass',['sass']);
	gulp.watch('assets/src/js/**/*.js',['scripts']);
});

gulp.task('lint', function() {
  return gulp.src('assets/src/js/**/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('stylish'));
});