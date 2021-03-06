var gulp = require('gulp');
var concat = require('gulp-concat');
var fs = require('fs');

var package = fs.readFileSync('./package.json');
var version = JSON.parse(package.toString("utf8")).version;

gulp.task('default', function () {
	// 将你的默认的任务代码放在这
	return gulp.src([
		'./src/base.css',
		'./src/font.css',
		'./src/layout.css',
		'./src/button.css',
		'./src/radio.css',
		'./src/checkbox.css',
		'./src/input.css',
		'./src/textarea.css',
		'./src/switch.css',
		'./src/select.css',
		'./src/tag.css',
		'./src/badge.css',
		'./src/breadcrumb.css',
		'./src/progress.css',
		'./src/loading.css',
		'./src/tabs.css',
		'./src/drawer.css',

		'./src/color.css',
	])
		.pipe(concat('ag-ui-' + version + '.css'))
		.pipe(gulp.dest('./docs'))
		.pipe(gulp.dest('./dist/'));
});

var watcher = gulp.watch('./src/**/*.css', ['default']);

watcher.on('change', function(event) {
	console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
});
