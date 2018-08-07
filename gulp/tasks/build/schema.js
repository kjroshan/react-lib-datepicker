export default function factory($, env) {
    return function task() {
        return $.gulp.src(env.paths.input.scripts.schema)
        .pipe($.gulp.dest(env.paths.output.scripts));
    };
}
