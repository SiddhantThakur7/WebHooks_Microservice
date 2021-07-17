const User = require('../Models/users.models');
const bcrypt = require('bcrypt');

//Extracting the saltrounds value which is used for hashing from the environment variables (.env file)
const saltRounds = parseInt(process.env.SALT, 10);

// ********** GET http://localhost:3000/
exports.getLoginPage = (req, res, next) => {
    if(req.session.user){
        res.redirect('/admin');
    }
    res.render('access');
};

// ********** POST http://localhost:3000/access/login
// Extracts the user input for the username and password. The user document with the username is queried and passwords are compared.
// If the passwords match, a new session document is saved with session.user = user, session.isLoggedIn = True.
exports.postLogin = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({
            username: username
        })
        .then((user) => {
            if (!user) {
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
                    res.redirect("/");
                })
                .catch((err) => {
                    console.log(err);
                    res.redirect("/");
                });
        })
        .catch((err) => console.log(err));
};


// ********** POST http://localhost:3000/access/signup
// Extracts the user input for the username and password. The user document with the username is queried to check if the user already exists.
// The password is encrypted before storage, a new session document is saved and the user is granted access to the admin route.
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

// ********** POST http://localhost:3000/logout
// The session object is destroyed and the '/' route is re-rendered.  
exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect("/");
      });
};