/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
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
            const version = env.version || 'patch';
            npm.config.set('message', 'Bump Version to %s');
            return npm.commands.version([version], done);
        });
    };
}
