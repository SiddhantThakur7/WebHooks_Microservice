

exports.getLoginPage = (req, res, next) => {
    res.render('access');
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    
};