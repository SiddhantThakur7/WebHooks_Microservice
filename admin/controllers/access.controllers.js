const User = require('../Models/users.models');
const bcrypt = require('bcrypt');


const saltRounds = parseInt(process.env.SALT, 10);

exports.getLoginPage = (req, res, next) => {
    if(req.session.user){
        res.redirect('/admin');
    }
    res.render('access');
};

exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
            username: username
        })
        .then((user) => {
            if (!user) {
                req.flash("error", "Invalid email or password.");
                return res.redirect("/");
            }
            bcrypt
                .compare(password, user.password)
                .then((doMatch) => {
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            if (err) {
                                console.log(err);
                            }
                            res.redirect("/admin");
                        });
                    }
                    req.flash("error", "Invalid email or password.");
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/");
                });
        })
        .catch((err) => console.log(err));
};

exports.postSignup = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    const con_password = req.body.con_password;
    if (con_password != password) {
        res.redirect('/');
    }
    User.findOne({
            'username': username
        })
        .then((found) => {
            if (found) {
                console.log('Found', found);
                return res.redirect('/');
            }
            return bcrypt.hash(password, saltRounds)
        })
        .then((hash) => {
            const new_user = User({
                username: username,
                password: hash
            });
            return new_user.save()
        })
        .then((user) => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
                if (err) {
                    console.log(err);
                    return res.redirect('/');
                }
                return res.redirect("/admin");
            });
        })
        .catch((err) => {
            console.log(err)
            // res.redirect('/');
        });
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
      });
};