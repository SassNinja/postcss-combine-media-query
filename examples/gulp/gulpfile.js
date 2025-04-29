
const gulp = require('gulp');
const del = require('del');
const postcss = require('gulp-postcss');
const combineMediaQuery = require('postcss-combine-media-query');

function clean() {
    return del(['dist/**']);
}

function css() {
    return gulp.src('./src/*.css')
        .pipe(postcss([
            combineMediaQuery()
        ]))
        .pipe(gulp.dest('./dist'));
}

function watch(done) {
    if (process.argv.includes('--watch')) {
        gulp.watch('./src/*.css').on('change', css);
    }
    done();
}

gulp.task('default', gulp.series(
    clean,
    css,
    watch
));