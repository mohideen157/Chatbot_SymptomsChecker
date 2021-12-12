const path = require('path');
const express = require('express');
const layout = require('express-layout');
const bodyParser = require('body-parser');
const cors = require('cors');

const routes = require('./routes');
const i18n = require('./i18n');
const app = express();

const logger = require('./logger/logger');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(i18n);
app.options('*', cors())

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin); // update to match the domain you will make the request from
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
 // var lang=req.body!=undefined&&req.body.lang_model!=undefined&&req.body.lang_model!=null&&req.body.lang_model!=''?
 //   req.body.lang_model.replace('infermedica-',''):'en';
 //   console.log(req);
 // res.setLocale(lang);
  next();
});

const middlewares = [
  layout(),
   express.static(path.join(__dirname, 'public')),
  bodyParser.urlencoded({ extended: true }),
];
app.use(middlewares);


  // use when response required in json format
//  app.use(bodyParser.urlencoded({ extended: true }));
//  app.use(bodyParser.json());

app.use('/', routes);

app.use((req, res, next) => {
  logger.log(req.url);
  logger.log("Sorry can't find that!");
  res.status(404).send("Sorry can't find that!");
});

app.use((err, req, res, next) => {
  logger.log(req.url);
  logger.log(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(9081, () => {
  logger.log('App running at http://localhost:9081');
});
