export default function factory($, env) {
    function bundleAnalysis(json) {
        const appList = $.lodash.chain(json.children)
                .reject({ name: 'node_modules' })
                .map(v => $.lodash.pick(v, ['name', 'size']))
                .value();
        const nodeModuleList = $.lodash.chain(json.children)
                .find({ name: 'node_modules' })
                .pick('children')
                .flatMap()
                .map(v => $.lodash.pick(v, ['name', 'size']))
                .orderBy('name', 'asc')
                .value();
        const totalList = $.lodash.concat(appList, nodeModuleList);
        return $.lodash.orderBy(totalList, 'size', 'desc');
    }
    return function task() {
        return $.browserify({
            entries: env.paths.input.scripts.main,
            debug: false,
            fullPaths: true
        })
        .transform('babelify')
        .bundle()
        .pipe($.vinylSourceStream('stub'))
        .pipe($.vinylBuffer())
        .pipe($.uglify())
        .once('data', (data) => {
            $.disc.json([data.contents], (error, json) => {
                const size = $.lodash.floor(json.size / 1000);
                if (size > env.thresholds.js) {
                    $.util.log($.util.colors.red(`Bundle Size (${size} kb) exceeds the threshold limit of ${env.thresholds.js} kb.`));
                    $.util.log('\n', bundleAnalysis(json), '\n');
                    process.exit(1);
                } else {
                    $.util.log($.util.colors.green(`Bundle Size (${size} kb).`));
                }
            });
        });
    };
}
