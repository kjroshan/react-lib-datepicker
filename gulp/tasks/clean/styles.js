import path from 'path';

export default function factory($, env) {
    return function task(done) {
        return $.delete(path.join(env.paths.output.styles.dir, env.paths.output.styles.bundle), done);
    };
}
