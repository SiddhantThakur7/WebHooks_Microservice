

exports.triggerWebHooks = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    // {Trigerring axios api call}
};