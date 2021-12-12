'use strict'
var rp = require('request-promise');
var config = require('../config.json');
var logger = require('../logger/logger');

exports.getsymptoms = async function(req, res, next) {
  
    let result;
    console.log('inside chatmethod');
    var symptom=req.body.symptom;
    console.log(symptom);
    
    rp({
      method: 'GET',
      uri: config.symptomUrl,
      headers: {
        'Content-Type': 'application/json',
        'App-Id': config.AppId,
        'App-Key': config.AppKey
      },
      async: true,
      json: true // Automatically stringifies the body to JSON
  }).then(function(body){
    result=body;
  }).catch(function(err){
    logger.log(config.symptomUrl+ 'error');
    logger.log(err);
  }).done(()=>{
   // logger.log(result);
   if(result.length>0)
   {
     var arr=[];
  //  var strcom;
     var symp_arr = symptom.toLowerCase().split(' ').join(',').split('and').join(',').split('or').join(',').split('=').join(',').split(':').join(',').split(';').join(',').split('-').join(',').split(',');
    
    result.forEach(res => {
      var matchflag=false;
      var x;
      var name_arr=res.name.toLowerCase().split(' ').join(',').split('and').join(',').split('or').join(',').split('=').join(',').split(':').join(',').split(';').join(',').split('-').join(',').split(',');
     
      symp_arr.forEach(value => {
        if(value!=''&&name_arr.indexOf(value)>-1){
          matchflag=true;
         }
      });

      name_arr.forEach(value => {
          if(value!=''&&symp_arr.indexOf(value)>-1){
            matchflag=true;
          }
       });

     // strcom.forEach(res => {
       // x = Buffer.compare(symp_arr, res.name);
         // console.log(x);
        
     // });
      
      if(matchflag==true)
          {
            var obj={
              "id": res.id,
              "name": res.name
            }
            arr.push(obj);
          }
    });

    res.status(200).send(arr);
    
    //res.render('chat');
   }
 }); 
};


/*exports.getdiagonosis = async function(req, res, next) {



rp({
  method: 'POST',
  uri: config.diagonosisUrl,
  headers: {
    'Content-Type': 'application/json',
    'App-Id': config.AppId,
    'App-Key': config.AppKey
  },
  body: {
      'sex' : sex,
      'age' : age,
      'evidence':evidence
  },
  async: true,
  json: true // Automatically stringifies the body to JSON
}).then(function(body){
//logger.log('parsed');
console.log(body);
result=body;

}).catch(function(err){
logger.log(config.diagonosisUrl+ 'error');
logger.log(err);
}).done(()=>{

let requestbody={
  'sex' : sex,
  'age' : age,
  'evidence':evidence
};
console.log(config.diagonosisUrl);
console.log(requestbody);
console.log('diagonise result:');
console.log(result);

if(result!=undefined&&result.question!=undefined&&result.question.items!=undefined){
   // console.log(result.question.items);
    //console.log(result.question.items[0].choices);
  res.render('diagonise',{
    data: result.question.items,
    name:name,
    mobileno:mobileno,
    sex: sex,
    age: age,
    symptoms: symptoms,
    evidence:evidence,
    questionType:result.question.type
  });  
//    }else if(isTriage){
}else{

  console.log('triage');
 // console.log(result);

  let triage_result;
  rp({
    method: 'POST',
    uri: config.triageUrl,
    headers: {
      'Content-Type': 'application/json',
      'App-Id': config.AppId,
      'App-Key': config.AppKey,
      'Model': lang_model
    },
    body: {
        'sex' : sex,
        'age' : age,
        'evidence':evidence
    },
    async: true,
    json: true // Automatically stringifies the body to JSON
}).then(function(body){
  //logger.log('parsed');
  triage_result=body;
  
}).catch(function(err){
  logger.log(config.triageUrl+ 'error');
  logger.log(err);
}).done(()=>{

  var emergencyflag=false;

  if(triage_result.serious!=undefined&&triage_result.serious!=null){
    triage_result.serious.forEach(element => {
      emergencyflag=emergencyflag==true||element.is_emergency==true;
    });
  }
  
  
  
  
  let triageObj={
    triage_level:triage_result.triage_level!=undefined&&triage_result.triage_level!=null?triage_result.triage_level:'',
    name:name,
    mobileno:mobileno,
    sex: sex,
    age: age,
    evidence:evidence
  };

 // console.log('triage object:')
  //console.log(triageObj)

  res.render('triage',triageObj);  

  });

  }
});*/


