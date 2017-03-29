var annotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var gulp = require('gulp');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('default', ['build']);
gulp.task('build', ['js', 'js:min', 'css', 'css:min']);

gulp.task('js', function () {
	gulp.src('./src/vote-tally.js')
		.pipe(rename('vote-tally.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(annotate())
		.pipe(gulp.dest('./dist'));
});

gulp.task('js:min', function () {
	gulp.src('./src/vote-tally.js')
		.pipe(rename('vote-tally.min.js'))
		.pipe(babel({presets: ['es2015']}))
		.pipe(annotate())
		.pipe(uglify({mangle: false}))
		.pipe(gulp.dest('./dist'));
});

gulp.task('css', ()=>
	gulp.src('./src/vote-tally.css')
		.pipe(rename('vote-tally.css'))
		.pipe(gulp.dest('./dist'))
);

gulp.task('css:min', ()=>
	gulp.src('./src/vote-tally.css')
		.pipe(rename('vote-tally.min.css'))
		.pipe(cleanCSS())
		.pipe(gulp.dest('./dist'))
);
