var gulp  = require('gulp');
var fs = require('fs');

function sync() {
	fs.readdirSync('../reduxxor').filter(function(f) { return !fs.statSync('../reduxxor/' + f).isDirectory(); }).forEach(function(f) {
		gulp.src('../reduxxor/' + f)
			.pipe(gulp.dest('reduxxor'));
	});
}

gulp.task('watch', function() {
	sync();
	gulp.watch('../reduxxor/**', ['sync']);
});

gulp.task('sync', function() {
	sync();
});
