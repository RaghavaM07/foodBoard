module.exports = function catchAsync(f) {
    return (async (req, resp, next) => {
        try {
            await f(req, resp, next)
        } catch (error) {
            next(error)
        }
    })
}