/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
import get from 'lodash/get';
import map from 'lodash/map';
import loadNPM from '../../tools/load-npm';

export default function factory($, env) {
    return function task(done) {
        const pkg = require(path.join(env.paths.root, 'package.json'));

        if (!pkg) {
            return done();
        }

        return loadNPM(pkg, (err, npm) => {
            if (err) {
                return done(err);
            }
            const peerDependencies = map(get(pkg, 'peerDependencies'), (v, k) => `${k}@${v}`);
            $.util.log('Installing peerDependencies...', peerDependencies);
            return npm.commands.install(peerDependencies, done);
        });
    };
}
