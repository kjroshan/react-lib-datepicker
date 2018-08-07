import format from '../../tools/gulp-format-json';

export default function factory($, env) {
    return function task() {
        return $.gulp.src(env.paths.input.scripts.schema)
        .pipe($.jsonminify())
        .pipe(format())
        .pipe($.gulp.dest((file) => {
            return file.base;
        }));
    };
}
