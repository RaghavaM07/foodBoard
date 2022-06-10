module.exports = function catchAsync(f) {
    return (req, resp, next) => {
        f(req, resp, next).catch(next)
    }
}