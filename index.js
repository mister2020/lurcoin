const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const app = express();

app.use(cors());
var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('private.key', 'utf8');
var certificate = fs.readFileSync('public.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

app.use(express.json());
app.use(routes);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});


app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";
    res.status(err.statusCode).json({
      message: err.message,
    });
});



httpServer.listen(7574);
httpsServer.listen(7575);
//app.listen(8083,() => console.log('Server is running'));