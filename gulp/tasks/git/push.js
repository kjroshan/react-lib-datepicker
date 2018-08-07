export default function factory($) {
    return function task(done) {
        return $.git.push('origin', null, (err) => {
            done(err);
        });
    };
}
