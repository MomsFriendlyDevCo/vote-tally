var _ = require('lodash');
var annotate = require('gulp-ng-annotate');
var babel = require('gulp-babel');
var cleanCSS = require('gulp-clean-css');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var fs = require('fs');
var lodash = require('lodash');
var rename = require('gulp-rename');
var replace = require('gulp-replace');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var rimraf = require('rimraf');
var watch = require('gulp-watch');

gulp.task('default', ['build']);
gulp.task('build', ['js', 'js:min', 'css', 'css:min']);


gulp.task('serve', ['build'], function() {
	var monitor = nodemon({
		script: './demo/server.js',
		ext: 'js css',
		ignore: ['**/*.js', '**/.css'], // Ignore everything else as its watched seperately
	})
		.on('start', function() {
			console.log('Server started');
		})
		.on('restart', function() {
			console.log('Server restarted');
		});

	watch(['./index.js', 'demo/**/*.js', 'src/**/*.js'], function() {
		console.log('Rebuild client-side JS files...');
		gulp.start('js');
	});

	watch(['demo/**/*.css', 'src/**/*.css'], function() {
		console.log('Rebuild client-side CSS files...');
		gulp.start('css');
	});
});


var mainLib;
gulp.task('compile:lib', function() {
	mainLib = _(
		fs.readFileSync('./index.js', 'utf-8')
			.replace(/^.*module\.exports = .*$/gm, '')
			.replace(/^/mg, '\t\t') // Indent all
			.split('\n')
	)
		.dropWhile(i => !_.trim(i))
		.dropRightWhile(i => !_.trim(i)) // Remove all empty lines at end of file
		.slice(0, -1) // Remove last brace (as its the closing of the `module.exports = {}` section)
		.join('\n')
});

gulp.task('js', ['compile:lib'], function () {
	gulp.src('./src/vote-tally.js')
		.pipe(rename('vote-tally.js'))
		.pipe(replace('// INSERT MAIN LIBRARY //', mainLib))
		.pipe(babel({presets: ['es2015']}))
		.pipe(annotate())
		.pipe(gulp.dest('./dist'));
});

gulp.task('js:min', ['compile:lib'], function () {
	gulp.src('./src/vote-tally.js')
		.pipe(rename('vote-tally.min.js'))
		.pipe(replace('// INSERT MAIN LIBRARY //', mainLib))
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


gulp.task('gh-pages', ['build'], function() {
	rimraf.sync('./gh-pages');

	return gulp.src([
		'./LICENSE',
		'./demo/_config.yml',
		'./demo/app.js',
		'./demo/index.html',
		'./dist/**/*',
		'./node_modules/angular/angular.min.js',
		'./node_modules/@momsfriendlydevco/angular-bs-tooltip/dist/angular-bs-tooltip.min.js',
		'./node_modules/bootstrap/dist/css/bootstrap.min.css',
		'./node_modules/bootstrap/dist/js/bootstrap.min.js',
		'./node_modules/font-awesome/css/font-awesome.min.css',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.ttf',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff',
		'./node_modules/font-awesome/fonts/fontawesome-webfont.woff2',
		'./node_modules/jquery/dist/jquery.min.js',
		'./node_modules/tether/dist/js/tether.min.js',
	], {base: __dirname})
		.pipe(rename(function(path) {
			if (path.dirname == 'demo') { // Move all demo files into root
				path.dirname = '.';
			}
			return path;
		}))
		.pipe(ghPages({
			cacheDir: 'gh-pages',
			push: true, // Change to false for dryrun (files dumped to cacheDir)
			// force: true, // Required to include node_modules files even though they are in .gitignore
		}))
});
