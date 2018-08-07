export default function factory($, env) {
    return function task() {
        return $.gulp.src(env.paths.input.scripts.src)
        .pipe($.sourcemaps.init())
        .pipe($.babel())
        .pipe($.sourcemaps.write())
        .pipe($.gulp.dest(env.paths.output.scripts));
    };
}
