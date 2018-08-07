export default function factory($, env) {
    return function task() {
        return $.gulp.src(env.paths.input.scripts.src)
        .pipe($.eslint({ fix: true }))
        .pipe($.gulp.dest((file) => {
            return file.base;
        }));
    };
}
