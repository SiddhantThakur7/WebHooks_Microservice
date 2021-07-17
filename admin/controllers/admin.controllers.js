const axios = require("axios");

exports.getWebHooks = (req, res, next) => {
    return axios({
        method: 'GET',
        url: 'http://localhost:8080/webhook/list',
        data: {
            user_id: req.session.user._id.toString(),
        }
      })
        .then(function (response) {
            console.log(response.data);
            res.render('admin', {webhooks: response.data, result: []});
        })
        .catch(err => console.log(err));
};

exports.getRegisterWebHooks = (req, res, next) => {
    res.render('admin-register', {bname: 'Register', hook_url: "", hook_id: ""});
};

exports.postRegisterWebHooks = (req, res, next) => {
    console.log('HERERERERERERERE----------------->', req.session.user);
    axios({
        method: 'POST',
        url: 'http://localhost:8080/webhook/register',
        data: {
            user_id: req.session.user._id.toString(),
            uri: req.body.target_url.toString(),
          }
      })
        .then(function (response) {
            console.log(response.data);
            res.redirect('/admin');
        })
        .catch(err => console.log(err));
};

exports.getUpdateHook = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    res.render('admin-register', {bname: 'Update', hook_url: req.query.hook_url, hook_id: req.query.hook_id});
};

exports.updateWebHooks = (req, res, next) => {
    axios({
        method: 'PUT',
        url: 'http://localhost:8080/webhook/update',
        data: {
            uri: req.body.target_url.toString(),
            id: req.body.hook_id.toString()
          }
      })
        .then(function (response) {
            console.log(response.data);
            res.redirect('/admin');
        })
        .catch(err => console.log(err));
};

exports.deleteWebHooks = (req, res, next) => {
    axios({
        method: 'DELETE',
        url: 'http://localhost:8080/webhook/delete',
        data: {
            id: req.body.hook_id.toString()
          }
      })
        .then(function (response) {
            console.log(response.data);
            res.redirect('/admin');
        })
        .catch(err => console.log(err));
};