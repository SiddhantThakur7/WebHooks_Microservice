

exports.getLoginPage = (req, res, next) => {
    res.render('access');
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const con_password = req.body.con_password;
    console.log(username, password, con_password);
};