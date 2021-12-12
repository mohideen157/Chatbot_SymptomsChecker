const express = require('express');
const router = express.Router();
//var diagonosisController = require('./controllers/diagonosisController');
var symptomchecker = require('./controllers/symptomchecker');

let cookieParser = require('cookie-parser'); 
let app = express() ;
const i18n = require('./i18n');
var config = require('./config.json');
const logger = require('./logger/logger');
app.use(cookieParser()); 


//router.route('/chatbot')
  //  .get(symptomchecker.updatesymptoms);

  router.get('/chatbot', (req, res) => {
    res.render('chat');
  });

router.route('/symptoms')
    .post(symptomchecker.getsymptoms);

//route.route('/diagonosis')
  //  .post(symptomchecker.getdiagonosis);



module.exports = router;
