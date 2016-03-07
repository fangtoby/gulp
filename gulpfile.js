/*
* Auto Watch Scirpt/Style Change File
* Date: 2016/03/03
* Author: Fly
*
* CMD: [C:/Users/10000461/AppData/Roaming/npm/gulp styles]
*/
var gulp = require('gulp'),  
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
	through2 = require('through2'),
    livereload = require('gulp-livereload');

var conf = require('./conf.json');

gulp.task('styles', function() {  
  return sass('src/styles/**/*.scss')
    .on('error', sass.logError)
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(minifycss())
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

gulp.task('script',function(){
  return gulp.src('src/script/**/*.js')
	.pipe(jshint())
    .pipe(rename({ suffix: '.min' }))
  	.pipe(uglify())
	.pipe(gulp.dest('dist/scirpt'))
	.pipe(notify({ message: 'Script task complete'}));
});

gulp.task('images', function() {  
  return gulp.src('src/images/**/*')
    .pipe(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true }))
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('clean', function() {  
  return gulp.src(['dist/styles', 'dist/scirpt', 'dist/images'], {read: false})
    .pipe(clean());
});

gulp.task('version',function(){
  return gulp.src( conf.path.version )
  .pipe(modify(version))
  .pipe(gulp.dest('./conf'))
  .pipe(notify({ message: 'Version update task complete' }));
});

//字符串的转换
function modify(modifier) {  
  return through2.obj(function(file, encoding, done) {
    var content = modifier(String(file.contents));
    file.contents = new Buffer(content);
    this.push(file);
    done();
  });
}
//字符替换
function version(data){
	var date = new Date();
    var str = '' + date.getFullYear() + getTwo(date.getMonth() + 1) + getTwo(date.getDate()) + getTwo(date.getHours()) + getTwo(date.getMinutes());
	return data.replace(eval('/.css=\\d{10,20}/g'), '.css=' + str)
	.replace(eval('/.js=\\d{10,20}/g'), '.js=' + str);	
}
//一位数变两位数
var getTwo = function (str) {
    str = str.toString();
    return str.length == 1 ? "0" + str : str;
};

gulp.task('default', ['clean'], function() {  
    gulp.start('styles', 'script', 'images');
});


gulp.task('watch', function() {

  var styles = gulp.watch('src/styles/**/*.scss', ['styles']);

  styles.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  
  var script = gulp.watch('src/script/**/*.js', ['script']);

  script.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });
  
  var images = gulp.watch('src/images/**/*', ['images']);

  images.on('change', function(event) {
    console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
  });

});
