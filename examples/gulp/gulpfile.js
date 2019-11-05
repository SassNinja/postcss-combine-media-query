
const gulp = require('gulp');
const argv = require('yargs').argv;
const deleteFile = require('gulp-delete-file');
const postcss = require('gulp-postcss');
const combineMediaQuery = require('postcss-combine-media-query');

function clean() {
    return gulp.src('./dist/*')
        .pipe(deleteFile({
            deleteMatch: true
        }));
}

function css() {
    return gulp.src('./src/*.css')
        .pipe(postcss([
            combineMediaQuery()
        ]))
        .pipe(gulp.dest('./dist'));
}

function watch(done) {
    if (argv.watch) {
        gulp.watch('./src/*.css').on('change', css);
    }
    done();
}

gulp.task('default', gulp.series(
    clean,
    css,
    watch
));