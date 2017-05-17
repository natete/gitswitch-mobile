const gulp = require('gulp'),
  cheerio = require('gulp-cheerio'),
  del = require('del'),
  zip = require('gulp-zip');

gulp.task('splash-resources', function () {
  return gulp.src('config.xml')
    .pipe(cheerio({
      run: function ($) {

        $('widget').attr('version', require('./package').version);
        $('platform[name = "android"] splash').each(function (index, element) {
          const densitySplit = $(element).attr('density').split('-');
          const qualifier = densitySplit[0];
          const density = densitySplit[1];

          $(element).attr('qualifier', qualifier);
          $(element).attr('density', density);
          $(element).attr('src', $(element).attr('src').replace('xxx', 'xx'));
        });
      },
      parserOptions: {
        xmlMode: true
      }
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('copy', ['copy-resources', 'copy-www', 'clean-dist', 'splash-resources']);

gulp.task('copy-resources', function () {
  return gulp.src('./resources/**/*', { base: './' })
    .pipe(gulp.dest('./dist'));
});

gulp.task('copy-www', function () {
  return gulp.src('./www/**/*')
    .pipe(gulp.dest('./dist'));
});

gulp.task('zip', ['copy'], function () {
  const time = new Date();
  return gulp.src('./dist/**/*')
    .pipe(zip(`upload-${time.getTime()}.zip`))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean-dist', function () {
  del('./dist');
});