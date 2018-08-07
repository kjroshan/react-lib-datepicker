/* eslint-disable import/no-extraneous-dependencies, global-require*/
import path from 'path';

export default function factory($, env) {
    return function task(done) {
        require('bless')
        .chunkFile(path.join(env.paths.output.styles.dir, env.paths.output.styles.bundle))
        .then((v) => {
            if (v.totalSelectorCount > env.thresholds.css) {
                $.util.log($.util.colors.red(`Number of CSS selectors (${v.totalSelectorCount}) exceed the threshold limit of ${env.thresholds.css}.`));
                done(`Number of CSS selectors (${v.totalSelectorCount}) exceed the threshold limit of ${env.thresholds.css}.`);
            } else {
                $.util.log($.util.colors.green(`Number of CSS selectors (${v.totalSelectorCount})`));
                done();
            }
        })
        .catch((err) => {
            done(err);
        });
    };
}
