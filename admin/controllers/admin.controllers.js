const axios = require("axios");

// ********** GET http://localhost:3000/admin/
// Makes a GET request to retrieve all the user's webhooks from the database through the usage of the microservice.
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

// ********** GET http://localhost:3000/admin/register
exports.getRegisterWebHooks = (req, res, next) => {
    res.render('admin-register', {bname: 'Register', hook_url: "", hook_id: ""});
};

// ********** POST http://localhost:3000/admin/
// Makes a POST request to register a new webhook through the usage of the microservice.
exports.postRegisterWebHooks = (req, res, next) => {
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

// ********** GET http://localhost:3000/admin/update
exports.getUpdateHook = (req, res, next) => {
    console.log(req.params);
    console.log(req.query);
    res.render('admin-register', {bname: 'Update', hook_url: req.query.hook_url, hook_id: req.query.hook_id});
};

// ********** POST http://localhost:3000/admin/
// Makes a PUT request to update the webhook using it's unique id through the usage of the microservice.
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

// ********** POST http://localhost:3000/admin/
// Makes a DELETE request to delete a particular webhook from the database through the usage of the microservice.
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