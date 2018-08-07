export default function factory($, env) {
    return function task() {
        return $.gulp
            .src(env.paths.input.test.scripts, { read: false })
            .pipe($.mocha())
            .pipe($.istanbul.writeReports({ dir: env.paths.output.coverage }))
            .pipe($.istanbul.enforceThresholds({ thresholds: env.thresholds.coverage }))
            .once('error', () => {
                $.util.log($.util.colors.red('Unit Test coverage failed'));
                process.exit(1);
            });
    };
}
