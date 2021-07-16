const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

const acessRoutes = require('./routes/access.routes');

app.use('/', acessRoutes);

// app.use('/admin');

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, (error) => {
    if (error) {
        console.log(error);
    }
});