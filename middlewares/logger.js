module.exports = (req, res, next) => {
    const entry = {
        timestamp: new Date().toISOString(),
        url: req.originalUrl,
        method: req.method,
        body: req.body
    };
    console.log(JSON.stringify(entry));
    next();
};
