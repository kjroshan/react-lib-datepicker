/* eslint-disable global-require, import/no-dynamic-require */
import path from 'path';
import fs from 'fs';

export default function factory($, env) {
    return function task(done) {
        const pkg = require(path.join(env.paths.root, 'package.json'));
        if (!pkg) {
            return done();
        }

        if ($.lodash.isNil(env.registry)) {
            return done(new Error('Registry is required'));
        }

        if ($.lodash.isNil($.lodash.get(pkg, 'publishConfig.registry'))) {
            return done(new Error('publishConfig.registry is required'));
        }

        const target = $.lodash.trim(env.registry);

        return fs.writeFile(
            path.join(env.paths.root, '.npmrc'),
            `registry=${target}`,
            'utf8',
            (err) => {
                if (err) {
                    return done(err);
                }

                $.lodash.set(pkg, 'publishConfig.registry', target);

                return fs.writeFile(
                    path.join(env.paths.root, 'package.json'),
                    JSON.stringify(pkg, null, 2),
                    'utf8',
                    (err2) => {
                        if (err2) {
                            return done(err);
                        }
                        return done();
                    });
            });
    };
}
