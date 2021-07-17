const axios = require("axios");


// ********** GET http://localhost:3000/ip/
// Makes a request to trigger the "webhook.trigger" action which will batch the POST requests to be made by the webhooks 
// to the corresponding target urls. The concurrency is set at upto 20 requests paralellized with each other. 
// If any request fails the requests are retried for a maximuym of 5 times. (BONUS POINT #1)

// response -> Info about all the failed requests
exports.triggerWebHooks = (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    axios({
        method: 'POST',
        url: 'http://localhost:8080/webhook/trigger',
        data: {
            ip: ip,
            user_id: req.session.user._id.toString()
          },
        timeout: 0
      })
        .then((response) => {
            const hooks = response.data.errs.map(item => item.item);
            const codes = response.data.errs.map(item => item.message.split(" ").slice(-1).map(code => parseInt(code, 10))[0]);
            console.log(hooks);
            // res.send(codes);
            res.render('ip', {codes: codes, hooks: hooks});
        })
        .catch(err => console.log(err));
};