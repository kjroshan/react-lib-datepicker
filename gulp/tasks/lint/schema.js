export default function factory($, env) {
    return function task() {
        return $.gulp.src(env.paths.input.scripts.schema)
        .pipe($.jsonlint())
        .pipe($.jsonlint.reporter())
        .pipe($.jsonlint.failAfterError());
    };
}
